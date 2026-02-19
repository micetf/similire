/**
 * Corpus des syllabes avec distracteurs qualifiés.
 *
 * Familles de confusion couvertes :
 * - Syllabes nasales : on/an/en/in/un
 * - Syllabes avec lettres miroirs : ba/da/pa/qa, be/de/pe...
 * - Syllabes miroirs (inversion) : le/el, li/il, me/em
 * - Syllabes proches visuellement : ou/on/au/eu
 *
 * @module data/syllabes
 */

/** @type {import('./lettres.js').CorpusItem[]} */
export const syllabes = [
    // Famille nasales
    { id: "on", valeur: "on", distracteurs: ["an", "en", "in"] },
    { id: "an", valeur: "an", distracteurs: ["on", "en", "in"] },
    { id: "en", valeur: "en", distracteurs: ["on", "an", "in"] },
    { id: "in", valeur: "in", distracteurs: ["on", "an", "en"] },
    { id: "un", valeur: "un", distracteurs: ["on", "an", "in"] },

    // Famille ou/on/au/eu
    { id: "ou", valeur: "ou", distracteurs: ["on", "au", "eu"] },
    { id: "au", valeur: "au", distracteurs: ["ou", "eu", "on"] },
    { id: "eu", valeur: "eu", distracteurs: ["ou", "au", "on"] },

    // Famille ba/da/pa (confusions b/d/p)
    { id: "ba", valeur: "ba", distracteurs: ["da", "pa", "qa"] },
    { id: "da", valeur: "da", distracteurs: ["ba", "pa", "qa"] },
    { id: "pa", valeur: "pa", distracteurs: ["ba", "da", "qa"] },

    // Famille be/de/pe
    { id: "be", valeur: "be", distracteurs: ["de", "pe", "ge"] },
    { id: "de", valeur: "de", distracteurs: ["be", "pe", "ge"] },
    { id: "pe", valeur: "pe", distracteurs: ["be", "de", "ge"] },

    // Famille bi/di/pi
    { id: "bi", valeur: "bi", distracteurs: ["di", "pi", "ni"] },
    { id: "di", valeur: "di", distracteurs: ["bi", "pi", "ni"] },
    { id: "pi", valeur: "pi", distracteurs: ["bi", "di", "ni"] },

    // Famille bo/do/po
    { id: "bo", valeur: "bo", distracteurs: ["do", "po", "go"] },
    { id: "do", valeur: "do", distracteurs: ["bo", "po", "go"] },
    { id: "po", valeur: "po", distracteurs: ["bo", "do", "go"] },

    // Syllabes miroirs (inversion de l'ordre)
    { id: "le", valeur: "le", distracteurs: ["el", "la", "li"] },
    { id: "el", valeur: "el", distracteurs: ["le", "al", "il"] },
    { id: "li", valeur: "li", distracteurs: ["il", "la", "le"] },
    { id: "il", valeur: "il", distracteurs: ["li", "el", "al"] },
    { id: "me", valeur: "me", distracteurs: ["em", "ma", "mi"] },
    { id: "em", valeur: "em", distracteurs: ["me", "am", "im"] },

    // Famille ni/nu/na
    { id: "ni", valeur: "ni", distracteurs: ["nu", "na", "mi"] },
    { id: "nu", valeur: "nu", distracteurs: ["ni", "na", "mu"] },
    { id: "na", valeur: "na", distracteurs: ["ni", "nu", "ma"] },

    // Famille si/sa/su/se
    { id: "si", valeur: "si", distracteurs: ["sa", "su", "se"] },
    { id: "sa", valeur: "sa", distracteurs: ["si", "su", "se"] },
    { id: "su", valeur: "su", distracteurs: ["si", "sa", "se"] },
    { id: "se", valeur: "se", distracteurs: ["si", "sa", "su"] },
];
