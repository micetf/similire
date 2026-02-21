/**
 * Hook de collecte et persistance du bilan enseignant.
 * Enregistre les tentatives et erreurs par item sur la session.
 * Données anonymes — identifiants d'items uniquement.
 * Réinitialisable uniquement via le bouton dédié dans BilanPanel.
 *
 * @module hooks/useBilan
 */

import { useState, useMemo, useCallback } from "react";
import { loadBilanFromStorage, saveBilanToStorage } from "@utils/storage";

/**
 * @typedef {Object} ItemBilan
 * @property {string} id         - Identifiant de l'item
 * @property {string} valeur     - Valeur affichée de l'item
 * @property {number} tentatives - Nombre de fois présenté
 * @property {number} erreurs    - Nombre d'erreurs (peut dépasser tentatives)
 * @property {number} tauxErreur - Taux d'erreur (peut dépasser 1.0)
 */

/**
 * @typedef {Object} BilanBrut
 * @property {Object.<string, number>} tentatives - Map id → nb tentatives
 * @property {Object.<string, number>} erreurs    - Map id → nb erreurs
 */

/**
 * @typedef {Object} UseBilanReturn
 * @property {BilanBrut}   bilanBrut            - Données brutes pour useGameEngine (mode focus)
 * @property {ItemBilan[]} itemsLesPlusEchoues  - Top 5 items par taux d'erreur
 * @property {number}      totalTentatives      - Total des tentatives
 * @property {number}      totalErreurs         - Total des erreurs
 * @property {boolean}     hasDonnees           - true si au moins une tentative
 * @property {Function}    enregistrerTentative - Incrémente les tentatives d'un item
 * @property {Function}    enregistrerErreur    - Incrémente les erreurs d'un item
 * @property {Function}    reinitialiser        - Remet le bilan à zéro
 */

/**
 * Hook de gestion du bilan enseignant.
 * Instancier une seule fois dans App.jsx.
 *
 * @param {Object.<string, { valeur: string }>} itemsIndex - Index id → item
 * @returns {UseBilanReturn}
 */
export function useBilan(itemsIndex) {
    const [bilan, setBilan] = useState(() => loadBilanFromStorage());

    /**
     * Incrémente le compteur de tentatives d'un item.
     * Appelé quand un nouveau tour est présenté à l'élève.
     *
     * @param {string} itemId
     * @returns {void}
     */
    const enregistrerTentative = useCallback((itemId) => {
        setBilan((prev) => {
            const next = {
                ...prev,
                tentatives: {
                    ...prev.tentatives,
                    [itemId]: (prev.tentatives[itemId] ?? 0) + 1,
                },
            };
            saveBilanToStorage(next);
            return next;
        });
    }, []);

    /**
     * Incrémente le compteur d'erreurs d'un item.
     * Appelé à chaque clic incorrect.
     *
     * @param {string} itemId
     * @returns {void}
     */
    const enregistrerErreur = useCallback((itemId) => {
        setBilan((prev) => {
            const next = {
                ...prev,
                erreurs: {
                    ...prev.erreurs,
                    [itemId]: (prev.erreurs[itemId] ?? 0) + 1,
                },
            };
            saveBilanToStorage(next);
            return next;
        });
    }, []);

    /**
     * Remet le bilan à zéro et efface le localStorage.
     *
     * @returns {void}
     */
    const reinitialiser = useCallback(() => {
        const vide = { tentatives: {}, erreurs: {} };
        setBilan(vide);
        saveBilanToStorage(vide);
    }, []);

    const totalTentatives = useMemo(
        () => Object.values(bilan.tentatives).reduce((a, b) => a + b, 0),
        [bilan.tentatives]
    );

    const totalErreurs = useMemo(
        () => Object.values(bilan.erreurs).reduce((a, b) => a + b, 0),
        [bilan.erreurs]
    );

    /**
     * Top 5 des items les plus échoués.
     * Seuil minimum : 1 tentative.
     * Le taux d'erreur peut dépasser 100% (plusieurs erreurs par tentative).
     */
    const itemsLesPlusEchoues = useMemo(() => {
        return Object.entries(bilan.tentatives)
            .filter(([, nb]) => nb >= 1)
            .map(([id, tentatives]) => {
                const erreurs = bilan.erreurs[id] ?? 0;
                return {
                    id,
                    valeur: itemsIndex[id]?.valeur ?? id,
                    tentatives,
                    erreurs,
                    tauxErreur: erreurs / tentatives,
                };
            })
            .sort((a, b) => b.tauxErreur - a.tauxErreur)
            .slice(0, 5);
    }, [bilan, itemsIndex]);

    return {
        // Sprint E — données brutes exposées pour useGameEngine uniquement.
        // Ne pas consommer directement dans les composants.
        bilanBrut: bilan,
        itemsLesPlusEchoues,
        totalTentatives,
        totalErreurs,
        hasDonnees: totalTentatives > 0,
        enregistrerTentative,
        enregistrerErreur,
        reinitialiser,
    };
}
