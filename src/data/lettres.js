/**
 * Corpus des lettres minuscules scriptes avec distracteurs qualifiés.
 *
 * Valeur pédagogique : chaque distracteur correspond à une confusion
 * visuelle attestée en apprentissage de la lecture (CP/CE1).
 *
 * Familles de confusion couvertes :
 * - Symétrie axe vertical    : b ↔ d
 * - Symétrie axe horizontal  : p ↔ q, n ↔ u, m ↔ w
 * - Rotation 180°            : b ↔ q, d ↔ p
 * - Traits verticaux proches : i / l / j / t
 * - Structure h/n/r          : jambe + courbe ou fourche
 * - Lettres rondes           : c / e / o / a
 * - Forme en fourche         : v / y / w
 * - Courbes angulaires       : s / z
 * - Barre transversale       : f / t
 * - Jambage descendant       : g / q / y / j
 *
 * @module data/lettres
 */

/** @type {import('./types.js').CorpusItem[]} */
export const lettres = [
    // --- Famille b/d/p/q : confusions majeures CP ---
    {
        id: "b",
        valeur: "b",
        distracteurs: ["d", "p", "q"],
    },
    {
        id: "d",
        valeur: "d",
        distracteurs: ["b", "p", "q"],
    },
    {
        id: "p",
        valeur: "p",
        distracteurs: ["q", "b", "d"],
    },
    {
        id: "q",
        valeur: "q",
        distracteurs: ["p", "b", "d"],
    },

    // --- Famille n/u/m/w : inversions verticales ---
    {
        id: "n",
        valeur: "n",
        distracteurs: ["u", "m", "h"],
    },
    {
        id: "u",
        valeur: "u",
        distracteurs: ["n", "v", "w"],
    },
    {
        id: "m",
        valeur: "m",
        distracteurs: ["w", "n", "r"],
    },
    {
        id: "w",
        valeur: "w",
        distracteurs: ["m", "u", "v"],
    },

    // --- Famille i/l/j/t : traits verticaux ---
    {
        id: "i",
        valeur: "i",
        distracteurs: ["l", "j", "t"],
    },
    {
        id: "l",
        valeur: "l",
        distracteurs: ["i", "t", "j"],
    },
    {
        id: "j",
        valeur: "j",
        distracteurs: ["i", "l", "y"],
    },
    {
        id: "t",
        valeur: "t",
        distracteurs: ["f", "l", "i"],
    },

    // --- Famille h/n/r : jambe + courbe ou fourche ---
    {
        id: "h",
        valeur: "h",
        distracteurs: ["n", "r", "b"],
    },
    {
        id: "r",
        valeur: "r",
        distracteurs: ["n", "h", "m"],
    },

    // --- Famille c/e/o/a : lettres rondes ---
    {
        id: "c",
        valeur: "c",
        distracteurs: ["e", "o", "a"],
    },
    {
        id: "e",
        valeur: "e",
        distracteurs: ["c", "o", "a"],
    },
    {
        id: "o",
        valeur: "o",
        distracteurs: ["c", "e", "a"],
    },
    {
        id: "a",
        valeur: "a",
        distracteurs: ["o", "e", "c"],
    },

    // --- Famille v/y : forme en fourche ---
    {
        id: "v",
        valeur: "v",
        distracteurs: ["y", "u", "w"],
    },
    {
        id: "y",
        valeur: "y",
        distracteurs: ["v", "j", "g"],
    },

    // --- Famille f/t : barre transversale ---
    {
        id: "f",
        valeur: "f",
        distracteurs: ["t", "l", "i"],
    },

    // --- Famille g/q/y : jambage descendant ---
    {
        id: "g",
        valeur: "g",
        distracteurs: ["q", "y", "j"],
    },

    // --- Famille s/z : courbes angulaires ---
    {
        id: "s",
        valeur: "s",
        distracteurs: ["z", "c", "e"],
    },
    {
        id: "z",
        valeur: "z",
        distracteurs: ["s", "x", "n"],
    },

    // --- Lettres à structure distinctive ---
    // Distracteurs choisis sur ressemblance de forme globale
    {
        id: "k",
        valeur: "k",
        distracteurs: ["h", "r", "x"],
    },
    {
        id: "x",
        valeur: "x",
        distracteurs: ["k", "z", "s"],
    },
];
