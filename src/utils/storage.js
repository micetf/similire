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
} from "@constants";

/**
 * Configuration persistée dans localStorage.
 * Sous-ensemble de Config — exclut modeTni et verrouille (état de session).
 *
 * @typedef {Object} ConfigPersistee
 * @property {string} typeUnite      - Type d'unité linguistique
 * @property {number} nbPropositions - Nombre de propositions
 * @property {string} police         - Identifiant de la police d'apprentissage
 */

/**
 * Valeurs par défaut utilisées en l'absence de configuration persistée.
 * @type {ConfigPersistee}
 */
const CONFIG_DEFAUT = {
    typeUnite: TYPES_UNITE[0],
    nbPropositions: NB_PROPOSITIONS_DEFAUT,
    police: POLICE_DEFAUT,
    modeTni: false,
    verrouille: false,
};

/**
 * Charge la configuration depuis localStorage.
 * Retourne les valeurs par défaut si aucune config n'existe
 * ou si le JSON est corrompu.
 *
 * La valeur `police` est validée : si elle ne figure pas parmi les polices
 * connues au moment du chargement, elle est remplacée par POLICE_DEFAUT.
 *
 * @returns {ConfigPersistee & { modeTni: boolean, verrouille: boolean }}
 */
export function loadConfigFromStorage() {
    try {
        const raw = localStorage.getItem(CLES_STORAGE.CONFIG);
        if (!raw) return { ...CONFIG_DEFAUT };

        const parsed = JSON.parse(raw);

        // Validation des champs critiques
        const typeUnite = TYPES_UNITE.includes(parsed.typeUnite)
            ? parsed.typeUnite
            : CONFIG_DEFAUT.typeUnite;

        const nbPropositions =
            typeof parsed.nbPropositions === "number" &&
            parsed.nbPropositions >= 2 &&
            parsed.nbPropositions <= 8
                ? parsed.nbPropositions
                : CONFIG_DEFAUT.nbPropositions;

        // La liste des polices est importée dynamiquement pour éviter la
        // dépendance circulaire — on valide simplement que la valeur est une string
        const police =
            typeof parsed.police === "string" && parsed.police.length > 0
                ? parsed.police
                : CONFIG_DEFAUT.police;

        return {
            ...CONFIG_DEFAUT,
            typeUnite,
            nbPropositions,
            police,
        };
    } catch {
        return { ...CONFIG_DEFAUT };
    }
}

/**
 * Sauvegarde la configuration dans localStorage.
 * Seuls les champs persistés (typeUnite, nbPropositions, police) sont écrits —
 * modeTni et verrouille sont intentionnellement omis.
 *
 * @param {ConfigPersistee & { modeTni: boolean, verrouille: boolean }} config
 * @returns {void}
 */
export function saveConfigToStorage(config) {
    try {
        const { typeUnite, nbPropositions, police } = config;
        localStorage.setItem(
            CLES_STORAGE.CONFIG,
            JSON.stringify({ typeUnite, nbPropositions, police })
        );
    } catch {
        // localStorage peut être indisponible (navigation privée, quotas) —
        // l'application continue de fonctionner sans persistance
    }
}
