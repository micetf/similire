/**
 * Fonctions de persistance localStorage.
 * SEUL point d'accès à localStorage dans l'application.
 * Toute lecture ou écriture de localStorage passe par ce module.
 *
 * @module utils/storage
 */

import { CLES_STORAGE, NB_PROPOSITIONS_DEFAUT, TYPES_UNITE } from "@constants";

/**
 * @typedef {Object} ConfigPersistee
 * @property {string} typeUnite      - Type d'unité linguistique sélectionné
 * @property {number} nbPropositions - Nombre d'étiquettes proposées
 */

/** @type {ConfigPersistee} */
const CONFIG_DEFAUT = {
    typeUnite: TYPES_UNITE[0],
    nbPropositions: NB_PROPOSITIONS_DEFAUT,
};

/**
 * Charge la configuration depuis localStorage.
 * Retourne les valeurs par défaut si aucune config n'existe
 * ou si le contenu JSON est corrompu.
 *
 * @returns {ConfigPersistee}
 */
export function loadConfigFromStorage() {
    try {
        const raw = localStorage.getItem(CLES_STORAGE.CONFIG);
        if (!raw) return { ...CONFIG_DEFAUT };
        const parsed = JSON.parse(raw);
        return {
            typeUnite: TYPES_UNITE.includes(parsed.typeUnite)
                ? parsed.typeUnite
                : CONFIG_DEFAUT.typeUnite,
            nbPropositions:
                typeof parsed.nbPropositions === "number"
                    ? parsed.nbPropositions
                    : CONFIG_DEFAUT.nbPropositions,
        };
    } catch {
        return { ...CONFIG_DEFAUT };
    }
}

/**
 * Sauvegarde la configuration dans localStorage.
 * Échoue silencieusement si localStorage n'est pas disponible.
 *
 * @param {ConfigPersistee} config
 * @returns {void}
 */
export function saveConfigToStorage(config) {
    try {
        localStorage.setItem(CLES_STORAGE.CONFIG, JSON.stringify(config));
    } catch {
        // localStorage indisponible (navigation privée, quota dépassé)
    }
}
