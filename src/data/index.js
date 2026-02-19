/**
 * Point d'entrée du corpus de données SiMiLire.
 * Agrège les trois corpus (lettres, syllabes, mots) en un objet unique
 * indexé par type d'unité linguistique.
 *
 * @module data
 */

import { lettres } from "./lettres.js";
import { syllabes } from "./syllabes.js";
import { mots } from "./mots.js";

/**
 * @typedef {'lettre' | 'syllabe' | 'mot'} TypeUnite
 */

/**
 * Corpus complet indexé par type d'unité.
 * @type {Record<TypeUnite, import('./lettres.js').CorpusItem[]>}
 */
export const corpus = {
    lettre: lettres,
    syllabe: syllabes,
    mot: mots,
};
