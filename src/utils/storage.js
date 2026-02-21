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

/** @typedef {Object} ConfigPersistee
 * @property {string} typeUnite
 * @property {number} nbPropositions
 * @property {string} police
 * @property {number} delaiMaxFluidite
 */

const CONFIG_DEFAUT = {
    typeUnite: TYPES_UNITE[0],
    nbPropositions: NB_PROPOSITIONS_DEFAUT,
    police: POLICE_DEFAUT,
    delaiMaxFluidite: DELAI_MAX_FLUIDITE_DEFAUT,
    modeTni: false,
    verrouille: false,
    modeFocus: false,
    idCorpusCustom: null, // Sprint F — session uniquement, jamais persisté
};

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
        // localStorage indisponible
    }
}

export function hasAideVue() {
    try {
        return localStorage.getItem(CLES_STORAGE.AIDE_VUE) === "1";
    } catch {
        return false;
    }
}

export function markAideVue() {
    try {
        localStorage.setItem(CLES_STORAGE.AIDE_VUE, "1");
    } catch {
        // noop
    }
}

export function loadBilanFromStorage() {
    try {
        const raw = localStorage.getItem(CLES_STORAGE.BILAN);
        if (!raw) return { tentatives: {}, erreurs: {} };
        const parsed = JSON.parse(raw);
        return {
            tentatives:
                parsed.tentatives && typeof parsed.tentatives === "object"
                    ? parsed.tentatives
                    : {},
            erreurs:
                parsed.erreurs && typeof parsed.erreurs === "object"
                    ? parsed.erreurs
                    : {},
        };
    } catch {
        return { tentatives: {}, erreurs: {} };
    }
}

export function saveBilanToStorage(bilan) {
    try {
        localStorage.setItem(CLES_STORAGE.BILAN, JSON.stringify(bilan));
    } catch {
        // noop
    }
}

// ─── Corpus personnalisable (Sprint F) ───────────────────────────────────────

/**
 * Charge la liste brute des corpus personnalisés depuis localStorage.
 * Retourne un tableau vide si absent ou corrompu.
 *
 * Le format stocké est `CorpusCustomStocke[]` — sans les items calculés.
 *
 * @returns {Array<{ id: string, nom: string, typeUnite: string, valeurs: string[] }>}
 */
export function loadCorpusCustomFromStorage() {
    try {
        const raw = localStorage.getItem(CLES_STORAGE.CORPUS_CUSTOM);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(
            (cc) =>
                typeof cc.id === "string" &&
                typeof cc.nom === "string" &&
                typeof cc.typeUnite === "string" &&
                Array.isArray(cc.valeurs)
        );
    } catch {
        return [];
    }
}

/**
 * Sauvegarde la liste brute des corpus personnalisés dans localStorage.
 *
 * @param {Array<{ id: string, nom: string, typeUnite: string, valeurs: string[] }>} liste
 */
export function saveCorpusCustomToStorage(liste) {
    try {
        localStorage.setItem(CLES_STORAGE.CORPUS_CUSTOM, JSON.stringify(liste));
    } catch {
        // localStorage indisponible
    }
}
