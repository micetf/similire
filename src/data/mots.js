/**
 * Corpus des mots avec distracteurs qualifiés.
 *
 * Sélection basée sur la liste des mots fréquents du CP/CE1
 * (référence : listes de fréquence Manulex, mots outils courants).
 *
 * Familles de confusion couvertes :
 * - Mots miroirs (inversion de l'ordre des lettres) : son/nos, les/sel
 * - Rimes orthographiques : main/nain/bain/pain
 * - Morphologie proche (1 lettre de différence) : chat/rat/mat, mer/ver/fer
 * - Confusion début de mot : lapin/sapin, bouche/touche/mouche
 *
 * @module data/mots
 */

/** @type {import('./lettres.js').CorpusItem[]} */
export const mots = [
    // Mots miroirs
    { id: "son", valeur: "son", distracteurs: ["nos", "bon", "ton"] },
    { id: "nos", valeur: "nos", distracteurs: ["son", "bon", "ton"] },
    { id: "les", valeur: "les", distracteurs: ["sel", "des", "ses"] },
    { id: "sel", valeur: "sel", distracteurs: ["les", "del", "vel"] },
    { id: "lit", valeur: "lit", distracteurs: ["til", "bit", "kit"] },

    // Rimes orthographiques en -ain
    { id: "main", valeur: "main", distracteurs: ["nain", "bain", "pain"] },
    { id: "nain", valeur: "nain", distracteurs: ["main", "bain", "pain"] },
    { id: "bain", valeur: "bain", distracteurs: ["main", "nain", "pain"] },
    { id: "pain", valeur: "pain", distracteurs: ["main", "nain", "bain"] },

    // Rimes en -at
    { id: "chat", valeur: "chat", distracteurs: ["chap", "char", "chas"] },
    { id: "rat", valeur: "rat", distracteurs: ["mat", "bat", "fat"] },
    { id: "mat", valeur: "mat", distracteurs: ["rat", "bat", "fat"] },

    // Confusion début de mot
    { id: "lapin", valeur: "lapin", distracteurs: ["sapin", "rapin", "napin"] },
    { id: "sapin", valeur: "sapin", distracteurs: ["lapin", "rapin", "capin"] },
    {
        id: "bouche",
        valeur: "bouche",
        distracteurs: ["touche", "mouche", "louche"],
    },
    {
        id: "touche",
        valeur: "touche",
        distracteurs: ["bouche", "mouche", "louche"],
    },
    {
        id: "mouche",
        valeur: "mouche",
        distracteurs: ["bouche", "touche", "louche"],
    },

    // Mots outils proches visuellement
    { id: "sur", valeur: "sur", distracteurs: ["par", "car", "tar"] },
    { id: "par", valeur: "par", distracteurs: ["sur", "car", "mar"] },
    { id: "mais", valeur: "mais", distracteurs: ["puis", "suis", "lais"] },
    { id: "puis", valeur: "puis", distracteurs: ["mais", "suis", "nuis"] },
    { id: "dans", valeur: "dans", distracteurs: ["sans", "bans", "rans"] },
    { id: "sans", valeur: "sans", distracteurs: ["dans", "bans", "rans"] },

    // Mots courants 1 lettre de différence
    { id: "mer", valeur: "mer", distracteurs: ["ver", "fer", "per"] },
    { id: "ver", valeur: "ver", distracteurs: ["mer", "fer", "per"] },
    { id: "roi", valeur: "roi", distracteurs: ["loi", "moi", "toi"] },
    { id: "loi", valeur: "loi", distracteurs: ["roi", "moi", "toi"] },
    { id: "moi", valeur: "moi", distracteurs: ["roi", "loi", "toi"] },
    { id: "toi", valeur: "toi", distracteurs: ["roi", "loi", "moi"] },
];
