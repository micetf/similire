/**
 * Contenu de l'aide pédagogique SiMiLire.
 * Chaque section correspond à un onglet dans HelpModal.
 * Ce fichier est la SEULE source à modifier pour mettre à jour l'aide.
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
                    "Après deux erreurs sur le même tour, une flèche → apparaît discrètement sur la bonne réponse. Ce guidage limite les erreurs répétées en indiquant la bonne option, tout en laissant à l’élève l’action de valider sa réponse.",
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
        ],
    },
    {
        id: "fluidite",
        label: "Fluidité",
        icone: "⏱️",
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
                    "Régler le temps total cible pour 10 réponses consécutives : " +
                    "30s pour des élèves de CE2 bien automatisés, " +
                    "60s (défaut) pour CP/CE1 en consolidation, " +
                    "90s pour les élèves en difficulté.",
            },
            {
                titre: "Point thermique",
                icone: "🟢",
                description:
                    "Un point coloré dans le coin bas gauche indique l'état de fluidité : vert (sous le seuil), orange (proche du seuil), rouge (au-dessus du seuil), gris (pas encore de données). L'élève ne voit pas de chronomètre.",
            },
            {
                titre: "Critère du brevet",
                icone: "🎓",
                description:
                    "Le brevet est accessible quand l'élève enchaîne 10 réussites consécutives " +
                    "ET que ces 10 réponses ont été données dans le temps configuré " +
                    "(30s, 60s ou 90s). Les deux conditions sont requises : fiabilité et fluidité.",
            },
        ],
    },
];
