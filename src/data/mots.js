/**
 * Corpus des mots avec distracteurs qualifiés.
 * Sélection basée sur la liste de fréquence du corpus original (CP→CM2)
 * croisée avec les familles de confusion visuelles attestées.
 *
 * Valeur pédagogique : seuls les mots présentant des confusions visuelles
 * exploitables sont retenus. Chaque distracteur correspond à une confusion
 * documentée en lecture (miroir, substitution, forme globale proche).
 *
 * Familles de confusion couvertes :
 * - Mots miroirs        : inversion de l'ordre des lettres
 * - Substitution en C1  : 1 lettre différente en attaque
 * - Substitution en Cf  : 1 lettre différente en finale
 * - Rime orthographique : même terminaison, attaque différente
 * - Forme globale       : longueur identique, 1-2 lettres différentes
 * - Mots outils proches : confusion grammaticale fréquente
 *
 * @module data/mots
 */

/** @type {import('./types.js').CorpusItem[]} */
export const mots = [
    // --- Mots miroirs ---
    {
        id: "son",
        valeur: "son",
        distracteurs: ["nos", "bon", "ton"],
    },
    {
        id: "nos",
        valeur: "nos",
        distracteurs: ["son", "bon", "ton"],
    },
    {
        id: "les",
        valeur: "les",
        distracteurs: ["sel", "des", "ses"],
    },
    {
        id: "sel",
        valeur: "sel",
        distracteurs: ["les", "bel", "gel"],
    },
    {
        id: "lit",
        valeur: "lit",
        distracteurs: ["til", "bit", "kit"],
    },
    {
        id: "mer",
        valeur: "mer",
        distracteurs: ["rem", "ver", "fer"],
    },
    {
        id: "sur",
        valeur: "sur",
        distracteurs: ["rus", "par", "car"],
    },

    // --- Rime en -our : substitution consonne initiale ---
    {
        id: "tour",
        valeur: "tour",
        distracteurs: ["jour", "four", "pour"],
    },
    {
        id: "jour",
        valeur: "jour",
        distracteurs: ["tour", "four", "pour"],
    },
    {
        id: "four",
        valeur: "four",
        distracteurs: ["tour", "jour", "pour"],
    },
    {
        id: "pour",
        valeur: "pour",
        distracteurs: ["tour", "jour", "four"],
    },

    // --- Rime en -ain : substitution consonne initiale ---
    {
        id: "main",
        valeur: "main",
        distracteurs: ["nain", "bain", "pain"],
    },
    {
        id: "nain",
        valeur: "nain",
        distracteurs: ["main", "bain", "pain"],
    },
    {
        id: "bain",
        valeur: "bain",
        distracteurs: ["main", "nain", "pain"],
    },
    {
        id: "pain",
        valeur: "pain",
        distracteurs: ["main", "nain", "bain"],
    },

    // --- Rime en -ille : forme globale identique ---
    {
        id: "ville",
        valeur: "ville",
        distracteurs: ["fille", "mille", "bille"],
    },
    {
        id: "fille",
        valeur: "fille",
        distracteurs: ["ville", "mille", "bille"],
    },
    {
        id: "mille",
        valeur: "mille",
        distracteurs: ["ville", "fille", "bille"],
    },

    // --- Rime en -erre/-erre : forme globale ---
    {
        id: "terre",
        valeur: "terre",
        distracteurs: ["verre", "guerre", "pierre"],
    },
    {
        id: "verre",
        valeur: "verre",
        distracteurs: ["terre", "guerre", "pierre"],
    },

    // --- Rime en -ort : substitution consonne initiale ---
    {
        id: "port",
        valeur: "port",
        distracteurs: ["fort", "mort", "sort"],
    },
    {
        id: "fort",
        valeur: "fort",
        distracteurs: ["port", "mort", "sort"],
    },
    {
        id: "mort",
        valeur: "mort",
        distracteurs: ["port", "fort", "sort"],
    },
    {
        id: "sort",
        valeur: "sort",
        distracteurs: ["port", "fort", "mort"],
    },

    // --- Rime en -oir : substitution consonne initiale ---
    {
        id: "voir",
        valeur: "voir",
        distracteurs: ["noir", "soir", "boir"],
    },
    {
        id: "noir",
        valeur: "noir",
        distracteurs: ["voir", "soir", "loir"],
    },
    {
        id: "soir",
        valeur: "soir",
        distracteurs: ["voir", "noir", "loir"],
    },

    // --- Rime en -eur : substitution consonne initiale ---
    {
        id: "peur",
        valeur: "peur",
        distracteurs: ["beur", "seur", "ceur"],
    },
    {
        id: "coeur",
        valeur: "cœur",
        distracteurs: ["peur", "beur", "seur"],
    },

    // --- Confusion début de mot : lapin/sapin ---
    {
        id: "lapin",
        valeur: "lapin",
        distracteurs: ["sapin", "rapin", "napin"],
    },
    {
        id: "sapin",
        valeur: "sapin",
        distracteurs: ["lapin", "rapin", "capin"],
    },

    // --- Confusion début de mot : bouche/touche/mouche ---
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

    // --- Mots outils proches visuellement ---
    {
        id: "dans",
        valeur: "dans",
        distracteurs: ["dont", "sans", "dons"],
    },
    {
        id: "sans",
        valeur: "sans",
        distracteurs: ["dans", "sens", "bans"],
    },
    {
        id: "mais",
        valeur: "mais",
        distracteurs: ["puis", "suis", "lais"],
    },
    {
        id: "puis",
        valeur: "puis",
        distracteurs: ["mais", "suis", "nuis"],
    },
    {
        id: "dont",
        valeur: "dont",
        distracteurs: ["dans", "donc", "dons"],
    },
    {
        id: "donc",
        valeur: "donc",
        distracteurs: ["dont", "dans", "dons"],
    },
    {
        id: "leur",
        valeur: "leur",
        distracteurs: ["peur", "seur", "beur"],
    },
    {
        id: "vers",
        valeur: "vers",
        distracteurs: ["vert", "verre", "ver"],
    },
    {
        id: "par",
        valeur: "par",
        distracteurs: ["car", "sur", "mar"],
    },

    // --- Mots fréquents : rime en -oi ---
    {
        id: "roi",
        valeur: "roi",
        distracteurs: ["loi", "moi", "toi"],
    },
    {
        id: "loi",
        valeur: "loi",
        distracteurs: ["roi", "moi", "toi"],
    },
    {
        id: "moi",
        valeur: "moi",
        distracteurs: ["roi", "loi", "toi"],
    },
    {
        id: "toi",
        valeur: "toi",
        distracteurs: ["roi", "loi", "moi"],
    },

    // --- Rime en -aison : morphologie proche ---
    {
        id: "maison",
        valeur: "maison",
        distracteurs: ["raison", "saison", "gaison"],
    },
    {
        id: "raison",
        valeur: "raison",
        distracteurs: ["maison", "saison", "laison"],
    },
    {
        id: "saison",
        valeur: "saison",
        distracteurs: ["maison", "raison", "gaison"],
    },

    // --- Rime en -ettre : morphologie proche ---
    {
        id: "lettre",
        valeur: "lettre",
        distracteurs: ["mettre", "battre", "pattre"],
    },
    {
        id: "mettre",
        valeur: "mettre",
        distracteurs: ["lettre", "battre", "fattre"],
    },
    {
        id: "battre",
        valeur: "battre",
        distracteurs: ["lettre", "mettre", "pattre"],
    },

    // --- Rime en -endre : morphologie proche ---
    {
        id: "prendre",
        valeur: "prendre",
        distracteurs: ["rendre", "vendre", "tendre"],
    },
    {
        id: "rendre",
        valeur: "rendre",
        distracteurs: ["prendre", "vendre", "tendre"],
    },
    {
        id: "vendre",
        valeur: "vendre",
        distracteurs: ["prendre", "rendre", "tendre"],
    },
    {
        id: "tendre",
        valeur: "tendre",
        distracteurs: ["prendre", "rendre", "vendre"],
    },

    // --- Mots fréquents CP : rime en -on ---
    {
        id: "bon",
        valeur: "bon",
        distracteurs: ["ton", "son", "mon"],
    },
    {
        id: "ton",
        valeur: "ton",
        distracteurs: ["bon", "son", "mon"],
    },
    {
        id: "mon",
        valeur: "mon",
        distracteurs: ["bon", "ton", "son"],
    },

    // --- Rime en -eu : mots courts fréquents ---
    {
        id: "peu",
        valeur: "peu",
        distracteurs: ["feu", "jeu", "bleu"],
    },
    {
        id: "feu",
        valeur: "feu",
        distracteurs: ["peu", "jeu", "bleu"],
    },
    {
        id: "jeu",
        valeur: "jeu",
        distracteurs: ["peu", "feu", "bleu"],
    },
];
