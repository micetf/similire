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

// ─── Stockage ─────────────────────────────────────────────────────────────────

/** Clés de stockage localStorage */
export const CLES_STORAGE = {
    CONFIG: "similire_config",
    AIDE_VUE: "similire_aide_vue",
};

// ─── Types d'unités ───────────────────────────────────────────────────────────

/**
 * Types d'unités linguistiques disponibles.
 * @type {readonly ['lettre', 'syllabe', 'mot']}
 */
export const TYPES_UNITE = /** @type {const} */ (["lettre", "syllabe", "mot"]);

/**
 * Labels affichés dans l'interface pour chaque type d'unité.
 * @type {Record<string, string>}
 */
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

/**
 * Polices d'apprentissage disponibles.
 * Chaque police est choisie pour un usage pédagogique spécifique.
 *
 * Chargement des fontes externes :
 * - Andika          → Google Fonts (préchargé dans index.html)
 * - Atkinson        → Google Fonts (préchargé dans index.html)
 * - OpenDyslexic    → npm package `opendyslexic` (importé dans index.css)
 *
 * @type {Record<string, DefinitionPolice>}
 */
export const POLICES_DISPONIBLES = {
    systeme: {
        label: "Système",
        fontFamily: "system-ui, -apple-system, sans-serif",
        info: "Police par défaut du navigateur",
    },
    andika: {
        label: "Andika",
        fontFamily: "'Andika', sans-serif",
        info: "Conçue pour l'apprentissage de la lecture — 'a' et 'g' en forme scripte",
    },
    atkinson: {
        label: "Atkinson",
        fontFamily: "'Atkinson Hyperlegible', sans-serif",
        info: "Haute lisibilité — lettres distinctives pour réduire les confusions",
    },
    opendyslexic: {
        label: "OpenDyslexic",
        fontFamily: "'OpenDyslexic', sans-serif",
        info: "Adapté aux élèves dyslexiques — bas de lettre alourdi",
    },
};

/**
 * Identifiant de la police utilisée par défaut.
 * Doit être une clé de POLICES_DISPONIBLES.
 *
 * @type {string}
 */
export const POLICE_DEFAUT = "systeme";

/** Valeurs de seuil de fluidité disponibles dans le ConfigPanel (en ms) */
export const DELAIS_FLUIDITE = [3000, 6000, 9000];

/** Seuil de fluidité par défaut : 6 secondes */
export const DELAI_MAX_FLUIDITE_DEFAUT = 6000;
