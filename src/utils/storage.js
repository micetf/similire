/**
 * Utilitaires de persistance localStorage pour SiMiLire.
 * Toute lecture/écriture dans localStorage passe obligatoirement par ce module.
 *
 * @module utils/storage
 */

import {
    CLES_STORAGE,
    NB_PROPOSITIONS_DEFAUT,
    TYPES_UNITE,
    POLICE_DEFAUT,
    DELAI_MAX_FLUIDITE_DEFAUT,
} from "@constants";

/**
 * Configuration persistée dans localStorage.
 * Sous-ensemble de Config — exclut modeTni et verrouille (état de session).
 *
 * @typedef {Object} ConfigPersistee
 * @property {string} typeUnite         - Type d'unité linguistique
 * @property {number} nbPropositions    - Nombre de propositions
 * @property {string} police            - Identifiant de la police d'apprentissage
 * @property {number} delaiMaxFluidite  - Seuil de fluidité en ms
 */

/**
 * Valeurs par défaut utilisées en l'absence de configuration persistée.
 * @type {ConfigPersistee}
 */
const CONFIG_DEFAUT = {
    typeUnite: TYPES_UNITE[0],
    nbPropositions: NB_PROPOSITIONS_DEFAUT,
    police: POLICE_DEFAUT,
    delaiMaxFluidite: DELAI_MAX_FLUIDITE_DEFAUT,
    modeTni: false,
    verrouille: false,
};

/**
 * Charge la configuration depuis localStorage.
 * Retourne les valeurs par défaut si aucune config n'existe
 * ou si le JSON est corrompu.
 *
 * @returns {ConfigPersistee & { modeTni: boolean, verrouille: boolean }}
 */
export function loadConfigFromStorage() {
    try {
        const raw = localStorage.getItem(CLES_STORAGE.CONFIG);
        if (!raw) return { ...CONFIG_DEFAUT };

        const parsed = JSON.parse(raw);

        const typeUnite = TYPES_UNITE.includes(parsed.typeUnite)
            ? parsed.typeUnite
            : CONFIG_DEFAUT.typeUnite;

        const nbPropositions =
            typeof parsed.nbPropositions === "number" &&
            parsed.nbPropositions >= 2 &&
            parsed.nbPropositions <= 8
                ? parsed.nbPropositions
                : CONFIG_DEFAUT.nbPropositions;

        const police =
            typeof parsed.police === "string" && parsed.police.length > 0
                ? parsed.police
                : CONFIG_DEFAUT.police;

        const delaiMaxFluidite =
            typeof parsed.delaiMaxFluidite === "number" &&
            parsed.delaiMaxFluidite > 0
                ? parsed.delaiMaxFluidite
                : CONFIG_DEFAUT.delaiMaxFluidite;

        return {
            ...CONFIG_DEFAUT,
            typeUnite,
            nbPropositions,
            police,
            delaiMaxFluidite,
        };
    } catch {
        return { ...CONFIG_DEFAUT };
    }
}

/**
 * Sauvegarde la configuration dans localStorage.
 * Seuls les champs persistés sont écrits —
 * modeTni et verrouille sont intentionnellement omis.
 *
 * @param {ConfigPersistee & { modeTni: boolean, verrouille: boolean }} config
 * @returns {void}
 */
export function saveConfigToStorage(config) {
    try {
        const { typeUnite, nbPropositions, police, delaiMaxFluidite } = config;
        localStorage.setItem(
            CLES_STORAGE.CONFIG,
            JSON.stringify({
                typeUnite,
                nbPropositions,
                police,
                delaiMaxFluidite,
            })
        );
    } catch {
        // localStorage indisponible — l'application continue sans persistance
    }
}

/**
 * Vérifie si l'aide a déjà été affichée lors d'une session précédente.
 *
 * @returns {boolean}
 */
export function hasAideVue() {
    try {
        return localStorage.getItem(CLES_STORAGE.AIDE_VUE) === "1";
    } catch {
        return false;
    }
}

/**
 * Marque l'aide comme vue dans localStorage.
 *
 * @returns {void}
 */
export function markAideVue() {
    try {
        localStorage.setItem(CLES_STORAGE.AIDE_VUE, "1");
    } catch {
        // localStorage indisponible — pas bloquant
    }
}
