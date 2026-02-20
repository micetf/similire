/**
 * Point d'entrée du corpus de données SiMiLire.
 * Agrège les trois corpus (lettres, syllabes, mots) en un objet unique
 * indexé par type d'unité linguistique.
 *
 * La validation du corpus est active en permanence pour préparer
 * l'ouverture à des corpus personnalisés par l'enseignant.
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

// Validation du corpus — active en développement ET en production
// pour anticiper l'ouverture du corpus à la personnalisation enseignant
Object.entries(corpus).forEach(([type, items]) => {
    const ids = items.map((item) => item.id);

    // Détection des ids en doublon
    const doublons = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (doublons.length > 0) {
        throw new Error(
            `[SiMiLire] Corpus "${type}" — ids en doublon : ${doublons.join(", ")}`
        );
    }

    // Détection d'un item présent dans ses propres distracteurs
    items.forEach((item) => {
        if (item.distracteurs.includes(item.id)) {
            throw new Error(
                `[SiMiLire] Corpus "${type}" — "${item.id}" est son propre distracteur`
            );
        }
    });
});
