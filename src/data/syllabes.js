/**
 * Corpus des syllabes avec distracteurs qualifiés.
 *
 * Valeur pédagogique : chaque distracteur correspond à une confusion
 * visuelle ou phonologique attestée en apprentissage du décodage (CP/CE1).
 *
 * Familles de confusion couvertes :
 * - b/d/p en attaque syllabique : confusion majeure de décodage CP
 * - Paires sourdes/sonores : p/b, t/d, f/v, c/g, ch/j
 * - Nasales : on/an/en/in/un — confusions vocaliques fréquentes
 * - Voyelles composées : ou/au/eu — graphèmes proches visuellement
 * - Syllabes miroirs : inversion consonne/voyelle (le/el, li/il)
 * - Graphèmes complexes : ch, gn, qu, ph, oi, oin
 *
 * @module data/syllabes
 */

/** @type {import('./types.js').CorpusItem[]} */
export const syllabes = [
    // --- Famille b/d/p en attaque + voyelle a ---
    {
        id: "ba",
        valeur: "ba",
        distracteurs: ["da", "pa", "va"],
    },
    {
        id: "da",
        valeur: "da",
        distracteurs: ["ba", "pa", "ta"],
    },
    {
        id: "pa",
        valeur: "pa",
        distracteurs: ["ba", "da", "ta"],
    },

    // --- Famille b/d/p + voyelle i ---
    {
        id: "bi",
        valeur: "bi",
        distracteurs: ["di", "pi", "vi"],
    },
    {
        id: "di",
        valeur: "di",
        distracteurs: ["bi", "pi", "ti"],
    },
    {
        id: "pi",
        valeur: "pi",
        distracteurs: ["bi", "di", "ti"],
    },

    // --- Famille b/d/p + voyelle o ---
    {
        id: "bo",
        valeur: "bo",
        distracteurs: ["do", "po", "vo"],
    },
    {
        id: "do",
        valeur: "do",
        distracteurs: ["bo", "po", "to"],
    },
    {
        id: "po",
        valeur: "po",
        distracteurs: ["bo", "do", "to"],
    },

    // --- Paires sourdes/sonores + voyelle a ---
    {
        id: "ta",
        valeur: "ta",
        distracteurs: ["da", "na", "sa"],
    },
    {
        id: "fa",
        valeur: "fa",
        distracteurs: ["va", "pa", "ba"],
    },
    {
        id: "va",
        valeur: "va",
        distracteurs: ["fa", "ba", "da"],
    },

    // --- Paires sourdes/sonores + voyelle e ---
    {
        id: "pe",
        valeur: "pe",
        distracteurs: ["be", "de", "te"],
    },
    {
        id: "be",
        valeur: "be",
        distracteurs: ["pe", "de", "ve"],
    },
    {
        id: "de",
        valeur: "de",
        distracteurs: ["be", "pe", "te"],
    },
    {
        id: "te",
        valeur: "te",
        distracteurs: ["de", "pe", "ne"],
    },

    // --- Syllabes miroirs : inversion C/V ---
    {
        id: "le",
        valeur: "le",
        distracteurs: ["el", "li", "lo"],
    },
    {
        id: "el",
        valeur: "el",
        distracteurs: ["le", "al", "il"],
    },
    {
        id: "li",
        valeur: "li",
        distracteurs: ["il", "le", "ni"],
    },
    {
        id: "il",
        valeur: "il",
        distracteurs: ["li", "el", "al"],
    },
    {
        id: "me",
        valeur: "me",
        distracteurs: ["em", "ne", "re"],
    },
    {
        id: "em",
        valeur: "em",
        distracteurs: ["me", "en", "el"],
    },
    {
        id: "or",
        valeur: "or",
        distracteurs: ["ro", "on", "ol"],
    },
    {
        id: "ro",
        valeur: "ro",
        distracteurs: ["or", "lo", "do"],
    },

    // --- Nasales : on/an/en/in/un ---
    {
        id: "on",
        valeur: "on",
        distracteurs: ["an", "en", "un"],
    },
    {
        id: "an",
        valeur: "an",
        distracteurs: ["on", "en", "in"],
    },
    {
        id: "en",
        valeur: "en",
        distracteurs: ["on", "an", "un"],
    },
    {
        id: "in",
        valeur: "in",
        distracteurs: ["un", "an", "on"],
    },
    {
        id: "un",
        valeur: "un",
        distracteurs: ["in", "on", "an"],
    },

    // --- Voyelles composées : ou/au/eu ---
    {
        id: "ou",
        valeur: "ou",
        distracteurs: ["au", "eu", "oi"],
    },
    {
        id: "au",
        valeur: "au",
        distracteurs: ["ou", "eu", "ai"],
    },
    {
        id: "eu",
        valeur: "eu",
        distracteurs: ["ou", "au", "ei"],
    },

    // --- Graphèmes complexes ch/c/j ---
    {
        id: "cha",
        valeur: "cha",
        distracteurs: ["ca", "ja", "sha"],
    },
    {
        id: "chi",
        valeur: "chi",
        distracteurs: ["ci", "ji", "shi"],
    },
    {
        id: "cho",
        valeur: "cho",
        distracteurs: ["co", "jo", "sho"],
    },

    // --- Graphème ou en attaque ---
    {
        id: "bou",
        valeur: "bou",
        distracteurs: ["dou", "pou", "mou"],
    },
    {
        id: "mou",
        valeur: "mou",
        distracteurs: ["bou", "nou", "vou"],
    },
    {
        id: "tou",
        valeur: "tou",
        distracteurs: ["dou", "bou", "sou"],
    },

    // --- Graphème on en attaque ---
    {
        id: "bon",
        valeur: "bon",
        distracteurs: ["don", "ton", "mon"],
    },
    {
        id: "ton",
        valeur: "ton",
        distracteurs: ["don", "bon", "ron"],
    },
    {
        id: "don",
        valeur: "don",
        distracteurs: ["bon", "ton", "lon"],
    },

    // --- Graphème oi/io ---
    {
        id: "oi",
        valeur: "oi",
        distracteurs: ["io", "ou", "oin"],
    },
    {
        id: "oin",
        valeur: "oin",
        distracteurs: ["oi", "ion", "loin"],
    },
    {
        id: "loi",
        valeur: "loi",
        distracteurs: ["roi", "moi", "lio"],
    },
    {
        id: "roi",
        valeur: "roi",
        distracteurs: ["loi", "moi", "rio"],
    },

    // --- Graphème gn ---
    {
        id: "gna",
        valeur: "gna",
        distracteurs: ["na", "nia", "kna"],
    },
    {
        id: "gni",
        valeur: "gni",
        distracteurs: ["ni", "nid", "gui"],
    },

    // --- Graphème qu ---
    {
        id: "qui",
        valeur: "qui",
        distracteurs: ["cui", "gui", "ki"],
    },
    {
        id: "que",
        valeur: "que",
        distracteurs: ["ce", "ke", "gue"],
    },
];
