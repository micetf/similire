/**
 * Contenu de l'aide pédagogique SiMiLire.
 * Chaque section correspond à un onglet dans HelpModal.
 * Ce fichier est la SEULE source à modifier pour mettre à jour l'aide.
 *
 * MàJ Sprint E : section "Bilan" ajoutée ; "Configurer" complétée avec
 * "Seuil de fluidité" et "Mode focus APC" ; section "Fluidité" mise à jour
 * (indicateur en items/min, barre en haut, icône ⚡).
 *
 * @module data/aide
 */

/**
 * @typedef {Object} ElementAide
 * @property {string}   titre       - Titre de l'élément
 * @property {string}   description - Texte explicatif
 * @property {string}   [icone]     - Emoji illustratif (optionnel)
 */

/**
 * @typedef {Object} SectionAide
 * @property {string}        id       - Identifiant unique de la section
 * @property {string}        label    - Libellé de l'onglet
 * @property {string}        icone    - Emoji de l'onglet
 * @property {ElementAide[]} elements - Liste des éléments d'aide
 */

/** @type {SectionAide[]} */
export const SECTIONS_AIDE = [
    {
        id: "jouer",
        label: "Jouer",
        icone: "🎮",
        elements: [
            {
                titre: "Objectif",
                icone: "🎯",
                description:
                    "Retrouver parmi plusieurs étiquettes celle qui est identique au modèle affiché en haut de l'écran. L'exercice porte sur des lettres, des syllabes ou des mots.",
            },
            {
                titre: "Bonne réponse",
                icone: "✅",
                description:
                    "L'étiquette correcte s'affiche en vert avec un badge ✓. Un nouveau tour démarre automatiquement.",
            },
            {
                titre: "Mauvaise réponse",
                icone: "❌",
                description:
                    "L'étiquette cliquée s'anime en orange avec un badge ✗. Le message « Essaie encore ! » invite à recommencer le même tour.",
            },
            {
                titre: "Guidage discret",
                icone: "👉",
                description:
                    "Après deux erreurs sur le même tour, une flèche → apparaît discrètement sur la bonne réponse. Ce guidage limite les erreurs répétées en indiquant la bonne option, tout en laissant à l'élève l'action de valider sa réponse.",
            },
            {
                titre: "Retour sur les erreurs",
                icone: "🔁",
                description:
                    "Un item raté revient immédiatement au tour suivant, une fois le tour en cours réussi. Ce mécanisme renforce la mémorisation sans que l'élève le perçoive.",
            },
        ],
    },
    {
        id: "configurer",
        label: "Configurer",
        icone: "⚙️",
        elements: [
            {
                titre: "Type d'unité",
                icone: "🔤",
                description:
                    "Choisir entre Lettre, Syllabe ou Mot selon la progression de la classe. Les lettres conviennent à la GS/CP, les syllabes au CP/CE1, les mots au CE1/CE2.",
            },
            {
                titre: "Nombre de propositions",
                icone: "🔢",
                description:
                    "Régler le nombre d'étiquettes affichées (2 à 8). Commencer par 3 ou 4 pour les élèves débutants, augmenter progressivement pour complexifier l'exercice.",
            },
            {
                titre: "Police d'apprentissage",
                icone: "🔡",
                description:
                    "Aligner la police avec celle utilisée en classe. Andika et Atkinson Hyperlegible sont recommandées pour les élèves dyslexiques. OpenDyslexic est conçue pour les cas sévères.",
            },
            {
                titre: "Seuil de fluidité",
                icone: "🎚️",
                description:
                    "Régler la vitesse cible exprimée en items par minute. " +
                    "7/min convient aux élèves en difficulté ou en début d'apprentissage, " +
                    "10/min est adapté au CP/CE1 en consolidation (valeur par défaut), " +
                    "20/min correspond à des élèves de CE2 bien automatisés.",
            },
            {
                titre: "Mode TNI",
                icone: "🖥️",
                description:
                    "Agrandit toutes les zones de clic pour une utilisation sur tableau numérique interactif. Recommandé pour les séances collectives.",
            },
            {
                titre: "Verrouillage",
                icone: "🔒",
                description:
                    "Masque le panneau de configuration pour éviter les modifications accidentelles pendant l'activité. Un cadenas reste visible pour déverrouiller.",
            },
            {
                titre: "Mode focus APC",
                icone: "🎯",
                description:
                    "Accessible depuis le tableau de bord, ce mode cible automatiquement " +
                    "les items les plus souvent échoués par l'élève. " +
                    "Idéal en APC ou en atelier de remédiation. " +
                    "Le brevet est désactivé en mode focus (corpus biaisé). " +
                    "L'enseignant peut désactiver ce mode depuis le panneau de configuration.",
            },
        ],
    },
    {
        id: "fluidite",
        label: "Fluidité",
        icone: "⚡",
        elements: [
            {
                titre: "Pourquoi mesurer la vitesse ?",
                icone: "📖",
                description:
                    "La recherche (Dehaene, Sprenger-Charolles) montre que la rapidité de décodage est le meilleur prédicteur de la compréhension en lecture. Répondre correctement est nécessaire, mais pas suffisant — la rapidité indique l'automatisation.",
            },
            {
                titre: "Seuil de fluidité",
                icone: "🎚️",
                description:
                    "Les seuils sont exprimés en items par minute, " +
                    "unité standard en orthophonie et en recherche sur la fluence de lecture. " +
                    "7/min correspond à environ 90s pour 10 réponses, " +
                    "10/min à 60s, 20/min à 30s.",
            },
            {
                titre: "Indicateur de fluidité",
                icone: "⚡",
                description:
                    "La barre de progression en haut de l'écran affiche la vitesse en temps réel " +
                    "avec une icône colorée : ⚡ vert (fluide), ⏱ orange (limite), 🐢 rouge (lent). " +
                    "L'élève ne voit pas de chronomètre — l'indicateur est une aide visuelle non anxiogène.",
            },
            {
                titre: "Critère du brevet",
                icone: "🎓",
                description:
                    "Le brevet est accessible quand l'élève enchaîne 10 réussites consécutives " +
                    "ET que la vitesse moyenne dépasse le seuil configuré. " +
                    "Les deux conditions sont requises : fiabilité et fluidité.",
            },
        ],
    },
    {
        id: "bilan",
        label: "Bilan",
        icone: "📊",
        elements: [
            {
                titre: "Tableau de bord",
                icone: "📋",
                description:
                    "Le bouton « Bilan » dans la barre de navigation ouvre le tableau de bord enseignant. " +
                    "Il affiche le nombre de tentatives, d'erreurs, le taux global " +
                    "et les items les plus souvent échoués.",
            },
            {
                titre: "Items difficiles",
                icone: "⚠️",
                description:
                    "Les 5 items avec le taux d'erreur le plus élevé sont mis en avant. " +
                    "Cette information guide les choix pédagogiques : " +
                    "quel item travailler en priorité, quelle confusion discriminer.",
            },
            {
                titre: "Travailler les points durs",
                icone: "🎯",
                description:
                    "Le bouton « Travailler les points durs » active le mode focus APC : " +
                    "seuls les items difficiles sont proposés. " +
                    "Le bilan reste actif — les progrès sont enregistrés en mode focus.",
            },
            {
                titre: "Réinitialisation",
                icone: "🔄",
                description:
                    "Le bouton « Réinitialiser le bilan » remet tous les compteurs à zéro. " +
                    "À utiliser en début de séance ou en changeant d'élève. " +
                    "Le score de la partie en cours n'est pas affecté.",
            },
        ],
    },
];
