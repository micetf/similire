/**
 * Constantes partagées de l'application SiMiLire.
 * Toute valeur utilisée à plus d'un endroit dans le code est déclarée ici.
 * Aucune valeur magique ne doit apparaître ailleurs dans le code.
 *
 * @module constants
 */

/** Nombre minimum de propositions affichées */
export const NB_PROPOSITIONS_MIN = 2;

/** Nombre maximum de propositions affichées */
export const NB_PROPOSITIONS_MAX = 8;

/** Nombre de propositions affiché par défaut */
export const NB_PROPOSITIONS_DEFAUT = 4;

/** Nombre de bonnes réponses consécutives pour débloquer le brevet */
export const SEUIL_BREVET = 10;

/** Délai en ms avant l'affichage du tour suivant après une bonne réponse */
export const DELAI_SUCCES_MS = 600;

/** Durée en ms du guidage discret (halo sur la réponse correcte) */
export const DUREE_GUIDAGE_MS = 1000;

/** Clés de stockage localStorage */
export const CLES_STORAGE = {
    CONFIG: "similire_config",
};

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
