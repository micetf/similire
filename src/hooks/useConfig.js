/**
 * Hook de gestion de la configuration enseignant.
 *
 * Responsabilités :
 * - Stocker l'état de configuration (type d'unité, propositions, mode TNI,
 *   verrouillage, police d'apprentissage)
 * - Persister dans localStorage les réglages enseignant
 * - Exposer des setters atomiques conformes au pattern DRY (écriture directe,
 *   jamais via useEffect)
 *
 * Ce qui est persisté    : typeUnite, nbPropositions, police
 * Ce qui ne l'est pas    : modeTni, verrouille (état de session uniquement)
 *
 * @module hooks/useConfig
 */

import { useState } from "react";
import {
    NB_PROPOSITIONS_MIN,
    NB_PROPOSITIONS_MAX,
    POLICES_DISPONIBLES,
    DELAIS_FLUIDITE,
} from "@constants";
import { loadConfigFromStorage, saveConfigToStorage } from "@utils/storage";

/**
 * @typedef {'lettre' | 'syllabe' | 'mot'} TypeUnite
 */

/**
 * @typedef {Object} Config
 * @property {TypeUnite} typeUnite      - Type d'unité linguistique sélectionné
 * @property {number}    nbPropositions - Nombre d'étiquettes proposées (2–8)
 * @property {boolean}   modeTni        - Mode TNI activé (non persisté)
 * @property {boolean}   verrouille     - Configuration verrouillée (non persisté)
 * @property {string}    police         - Identifiant de la police d'apprentissage
 * @property {number}    delaiMaxFluidite - Seuil de fluidité en ms (persisté)

 */

/**
 * Hook de gestion de la configuration enseignant.
 * Instancier une seule fois dans App.jsx et distribuer la config par props.
 *
 * @returns {{
 *   config: Config,
 *   setTypeUnite: function(TypeUnite): void,
 *   setNbPropositions: function(number): void,
 *   toggleModeTni: function(): void,
 *   toggleVerrouillage: function(): void,
 *   setPolice: function(string): void,
 * }}
 */
export function useConfig() {
    const [config, setConfig] = useState(() => loadConfigFromStorage());

    /**
     * Change le type d'unité linguistique et persiste le choix.
     * @param {TypeUnite} type
     */
    const setTypeUnite = (type) => {
        const next = { ...config, typeUnite: type };
        setConfig(next);
        saveConfigToStorage(next);
    };

    /**
     * Change le nombre de propositions (clamé entre MIN et MAX) et persiste.
     * @param {number} nb
     */
    const setNbPropositions = (nb) => {
        const clamped = Math.max(
            NB_PROPOSITIONS_MIN,
            Math.min(NB_PROPOSITIONS_MAX, nb)
        );
        const next = { ...config, nbPropositions: clamped };
        setConfig(next);
        saveConfigToStorage(next);
    };

    /**
     * Bascule le mode TNI (non persisté — état de session uniquement).
     */
    const toggleModeTni = () => {
        setConfig((prev) => ({ ...prev, modeTni: !prev.modeTni }));
    };

    /**
     * Bascule le verrouillage de la configuration (non persisté).
     */
    const toggleVerrouillage = () => {
        setConfig((prev) => ({ ...prev, verrouille: !prev.verrouille }));
    };

    /**
     * Change la police d'apprentissage et persiste le choix.
     * La valeur doit être une clé de POLICES_DISPONIBLES.
     *
     * @param {string} idPolice - Clé dans POLICES_DISPONIBLES
     */
    const setPolice = (idPolice) => {
        if (!POLICES_DISPONIBLES[idPolice]) return;
        const next = { ...config, police: idPolice };
        setConfig(next);
        saveConfigToStorage(next);
    };

    /**
     * Change le seuil de fluidité et persiste le choix.
     * La valeur doit être dans DELAIS_FLUIDITE.
     *
     * @param {number} delai - Seuil en ms (3000, 6000 ou 9000)
     */
    const setDelaiMaxFluidite = (delai) => {
        if (!DELAIS_FLUIDITE.includes(delai)) return;
        const next = { ...config, delaiMaxFluidite: delai };
        setConfig(next);
        saveConfigToStorage(next);
    };

    return {
        config,
        setTypeUnite,
        setNbPropositions,
        toggleModeTni,
        toggleVerrouillage,
        setPolice,
        setDelaiMaxFluidite,
    };
}
