/**
 * Constantes partagées de l'application SiMiLire.
 * Toute valeur utilisée à plus d'un endroit dans le code est déclarée ici.
 *
 * @module constants
 */

// ─── Jeu ─────────────────────────────────────────────────────────────────────

/** Nombre minimum de propositions */
export const NB_PROPOSITIONS_MIN = 2;

/** Nombre maximum de propositions */
export const NB_PROPOSITIONS_MAX = 8;

/** Nombre de propositions par défaut */
export const NB_PROPOSITIONS_DEFAUT = 4;

/** Nombre de bonnes réponses consécutives pour débloquer le brevet */
export const SEUIL_BREVET = 10;

/** Délai en ms avant l'affichage du tour suivant après une bonne réponse */
export const DELAI_SUCCES_MS = 600;

/** Durée en ms du guidage discret (halo sur la réponse correcte) */
export const DUREE_GUIDAGE_MS = 1000;

// ─── Mode Focus APC ──────────────────────────────────────────────────────────

export const SEUIL_ERREUR_FOCUS = 0.3;
export const SEUIL_TENTATIVES_MIN_FOCUS = 1;
export const TAILLE_MIN_CORPUS_FOCUS = 4;
export const TAILLE_MAX_CORPUS_FOCUS = 8;

// ─── Corpus personnalisable (Sprint F) ───────────────────────────────────────

/**
 * Nombre maximum d'items par corpus personnalisé.
 * Contrainte de performance (localStorage + UX).
 */
export const NB_ITEMS_MAX_CORPUS_CUSTOM = 50;

/**
 * Nombre maximum de corpus personnalisés.
 * Correspond à ~15 semaines d'une période scolaire.
 */
export const NB_CORPUS_CUSTOM_MAX = 15;

/**
 * Longueur maximale du nom d'un corpus personnalisé.
 */
export const NOM_CORPUS_MAX_CHARS = 40;

// ─── Stockage ─────────────────────────────────────────────────────────────────

/** Clés de stockage localStorage */
export const CLES_STORAGE = {
    CONFIG: "similire_config",
    AIDE_VUE: "similire_aide_vue",
    BILAN: "similire_bilan",
    CORPUS_CUSTOM: "similire_corpus_custom", // Sprint F
};

// ─── Types d'unités ───────────────────────────────────────────────────────────

/** @type {readonly ['lettre', 'syllabe', 'mot']} */
export const TYPES_UNITE = /** @type {const} */ (["lettre", "syllabe", "mot"]);

/** @type {Record<string, string>} */
export const LABELS_TYPES_UNITE = {
    lettre: "Lettre",
    syllabe: "Syllabe",
    mot: "Mot",
};

// ─── Polices d'apprentissage ──────────────────────────────────────────────────

/**
 * @typedef {Object} DefinitionPolice
 * @property {string} label      - Nom affiché dans le sélecteur
 * @property {string} fontFamily - Valeur CSS font-family
 * @property {string} info       - Description pédagogique courte
 */

/** @type {Record<string, DefinitionPolice>} */
export const POLICES_DISPONIBLES = {
    systeme: {
        label: "Système",
        fontFamily: "system-ui, sans-serif",
        info: "Police par défaut du navigateur",
    },
    andika: {
        label: "Andika",
        fontFamily: "'Andika', sans-serif",
        info: "Conçue pour l'apprentissage de la lecture",
    },
    atkinson: {
        label: "Atkinson",
        fontFamily: "'Atkinson Hyperlegible', sans-serif",
        info: "Lisibilité maximale, inclusion",
    },
    opendyslexic: {
        label: "OpenDyslexic",
        fontFamily: "'OpenDyslexic', sans-serif",
        info: "Adaptée à la dyslexie",
    },
};

export const POLICE_DEFAUT = "systeme";

// ─── Fluidité ─────────────────────────────────────────────────────────────────

/** Seuils de fluidité disponibles en ms */
export const DELAIS_FLUIDITE = [3000, 6000, 9000];

/** Seuil par défaut */
export const DELAI_MAX_FLUIDITE_DEFAUT = 6000;

/** Labels unités de fluidité par type — cohérents avec ProgressIndicator et useBrevet */
export const LABELS_UNITE_FLUIDITE = {
    lettre: "l/min",
    syllabe: "syl/min",
    mot: "mots/min",
};
