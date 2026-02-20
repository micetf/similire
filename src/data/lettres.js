/**
 * Corpus des lettres avec distracteurs qualifiés.
 *
 * Chaque item contient :
 * - id : identifiant unique (= valeur de la lettre)
 * - valeur : caractère affiché à l'écran
 * - distracteurs : lettres visuellement proches, issues de familles
 *   de confusion attestées en didactique de la lecture
 *
 * Familles de confusion couvertes :
 * - Symétrie axiale verticale : b/d, p/q
 * - Symétrie axiale horizontale : b/p, d/q, n/u, m/w
 * - Similarité morphologique : i/l/j, h/n, m/n, c/e/o, v/y
 *
 * @module data/lettres
 */

/**
 * @typedef {Object} CorpusItem
 * @property {string}   id           - Identifiant unique de l'item
 * @property {string}   valeur       - Valeur affichée à l'écran
 * @property {string[]} distracteurs - Distracteurs qualifiés (confusions attestées)
 */

/** @type {CorpusItem[]} */
export const lettres = [
    // Famille symétrie axiale verticale et horizontale
    { id: "b", valeur: "b", distracteurs: ["d", "p", "q"] },
    { id: "d", valeur: "d", distracteurs: ["b", "p", "q"] },
    { id: "p", valeur: "p", distracteurs: ["b", "d", "q"] },
    { id: "q", valeur: "q", distracteurs: ["b", "d", "p"] },

    // Famille n/u/m/w
    { id: "n", valeur: "n", distracteurs: ["u", "m", "h"] },
    { id: "u", valeur: "u", distracteurs: ["n", "m", "v"] },
    { id: "m", valeur: "m", distracteurs: ["n", "w", "u"] },
    { id: "w", valeur: "w", distracteurs: ["m", "v", "u"] },

    // Famille i/l/j/t
    { id: "i", valeur: "i", distracteurs: ["l", "j", "t"] },
    { id: "l", valeur: "l", distracteurs: ["i", "j", "t"] },
    { id: "j", valeur: "j", distracteurs: ["i", "l", "t"] },

    // Famille h/n/r
    { id: "h", valeur: "h", distracteurs: ["n", "r", "b"] },
    { id: "r", valeur: "r", distracteurs: ["n", "h", "v"] },

    // Famille c/e/o/a
    { id: "c", valeur: "c", distracteurs: ["e", "o", "a"] },
    { id: "e", valeur: "e", distracteurs: ["c", "o", "a"] },
    { id: "o", valeur: "o", distracteurs: ["c", "e", "a"] },
    { id: "a", valeur: "a", distracteurs: ["c", "e", "o"] },

    // Famille v/y/u
    { id: "v", valeur: "v", distracteurs: ["y", "u", "w"] },
    { id: "y", valeur: "y", distracteurs: ["v", "u", "w"] },

    // Famille f/t
    { id: "f", valeur: "f", distracteurs: ["t", "l", "i"] },
    { id: "t", valeur: "t", distracteurs: ["f", "l", "i"] },

    // Lettres isolées avec distracteurs les plus proches
    { id: "g", valeur: "g", distracteurs: ["q", "p", "b"] },
    { id: "k", valeur: "k", distracteurs: ["h", "r", "f"] },
    { id: "s", valeur: "s", distracteurs: ["z", "c", "e"] },
    { id: "z", valeur: "z", distracteurs: ["s", "n", "u"] },
    { id: "x", valeur: "x", distracteurs: ["k", "v", "z"] },
];
