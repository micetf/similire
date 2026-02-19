# Spécifications Techniques — SiMiLire

**Application :** `micetf.fr/similire/`
**Date de rédaction :** 19 février 2026
**Statut :** Prêtes pour développement
**Gestionnaire de paquets :** pnpm

---

## 1. Stack technique

| Couche    | Technologie  | Version | Rôle                                     |
| --------- | ------------ | ------- | ---------------------------------------- |
| UI        | React        | 18.2.x  | Composants fonctionnels + hooks          |
| Style     | Tailwind CSS | ^3.4.17 | Utility-first, mode JIT                  |
| Bundler   | Vite         | ^6.x    | Dev server + build optimisé              |
| Linting   | ESLint       | ^9.x    | Zéro warning toléré                      |
| PropTypes | prop-types   | latest  | Validation des props (pas de TypeScript) |
| Formatage | Prettier     | ^3.x    | Cohérence du code                        |

### Dépendances runtime

```json
{
    "dependencies": {
        "react": "18.2.0",
        "react-dom": "18.2.0",
        "prop-types": "latest"
    },
    "devDependencies": {
        "@vitejs/plugin-react": "^4.x",
        "tailwindcss": "^3.4.17",
        "autoprefixer": "^10.x",
        "postcss": "^8.x",
        "eslint": "^9.x",
        "@eslint/js": "^9.x",
        "eslint-plugin-react": "^7.x",
        "eslint-plugin-react-hooks": "^5.x",
        "prettier": "^3.x",
        "vite": "^6.x"
    }
}
```

### Absence délibérée de dépendances

| Bibliothèque absente     | Raison                                                           |
| ------------------------ | ---------------------------------------------------------------- |
| TypeScript               | Hors stack définie — PropTypes suffisant pour ce projet          |
| Redux / Zustand          | useState + Context API suffisants — pas de state global complexe |
| React Router             | Application mono-vue — pas de routing nécessaire                 |
| Framer Motion            | Animations CSS Tailwind suffisantes pour ce projet simple        |
| Axios / React Query      | Pas de requêtes réseau — données locales uniquement              |
| Testing Library / Vitest | Hors périmètre de cette version                                  |

---

## 2. Structure du projet

```
similire/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── .prettierrc
├── package.json
│
├── public/
│   └── favicon.ico
│
└── src/
    ├── main.jsx                    # Point d'entrée React
    ├── App.jsx                     # Composant racine
    ├── index.css                   # Directives Tailwind + styles globaux
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.jsx          # Barre de navigation MiCetF
    │   │   └── NavbarSpacer.jsx    # Compensateur hauteur navbar sticky
    │   │
    │   ├── config/
    │   │   └── ConfigPanel.jsx     # Panneau de configuration enseignant
    │   │
    │   ├── game/
    │   │   ├── ModelZone.jsx       # Zone d'affichage du modèle
    │   │   ├── ProposalGrid.jsx    # Grille des étiquettes proposées
    │   │   ├── EtiquetteCard.jsx   # Étiquette individuelle cliquable
    │   │   └── FeedbackMessage.jsx # Message de feedback (erreur)
    │   │
    │   ├── progress/
    │   │   └── ProgressIndicator.jsx # Étoiles / barre de progression
    │   │
    │   └── brevet/
    │       └── BrevetModal.jsx     # Modale de génération du brevet
    │
    ├── constants.js                # Toutes les constantes partagées de l'application
    │
    ├── hooks/
    │   ├── useGameEngine.js        # Logique principale du jeu
    │   ├── useConfig.js            # Gestion de la configuration
    │   └── useBrevet.js            # Génération du brevet (Canvas API)
    │
    ├── data/
    │   ├── index.js                # Point d'entrée des données
    │   ├── lettres.js              # Corpus lettres + distracteurs qualifiés
    │   ├── syllabes.js             # Corpus syllabes + distracteurs qualifiés
    │   └── mots.js                 # Corpus mots + distracteurs qualifiés
    │
    └── utils/
        ├── storage.js              # Gestion localStorage (SEUL point d'accès à localStorage)
        ├── random.js               # Fonctions aléatoires pures (SEULE source de Math.random)
        └── canvas.js               # Primitives Canvas (SEULE source de logique de rendu)
```

> **Lecture de la structure :** chaque commentaire de fichier précise sa responsabilité unique. Si une logique ne rentre dans aucune de ces responsabilités, un nouveau fichier dédié est créé plutôt que d'étendre un fichier existant.

---

## 3. Modélisation des données

### 3.1 Structure d'un item du corpus

Chaque item possède un identifiant, sa valeur affichable et une liste de **distracteurs qualifiés** — des graphèmes visuellement proches choisis pour leur pertinence didactique.

```js
// src/data/lettres.js

/**
 * @typedef {Object} CorpusItem
 * @property {string} id        - Identifiant unique de l'item
 * @property {string} valeur    - Valeur affichée à l'écran
 * @property {string[]} distracteurs - Distracteurs qualifiés (confusions attestées)
 */

/** @type {CorpusItem[]} */
export const lettres = [
    { id: "b", valeur: "b", distracteurs: ["d", "p", "q"] },
    { id: "d", valeur: "d", distracteurs: ["b", "p", "q"] },
    { id: "p", valeur: "p", distracteurs: ["b", "d", "q"] },
    { id: "q", valeur: "q", distracteurs: ["b", "d", "p"] },
    { id: "n", valeur: "n", distracteurs: ["h", "u", "m"] },
    { id: "u", valeur: "u", distracteurs: ["n", "m", "v"] },
    { id: "m", valeur: "m", distracteurs: ["n", "w", "u"] },
    { id: "i", valeur: "i", distracteurs: ["l", "j", "t"] },
    { id: "c", valeur: "c", distracteurs: ["e", "o", "a"] },
    // ... suite du corpus
];
```

```js
// src/data/syllabes.js

/** @type {CorpusItem[]} */
export const syllabes = [
    { id: "ba", valeur: "ba", distracteurs: ["da", "pa", "qa"] },
    { id: "on", valeur: "on", distracteurs: ["an", "en", "in"] },
    { id: "ou", valeur: "ou", distracteurs: ["on", "au", "eu"] },
    // ... suite du corpus
];
```

```js
// src/data/mots.js

/** @type {CorpusItem[]} */
export const mots = [
    { id: "son", valeur: "son", distracteurs: ["nos", "bon", "ton"] },
    { id: "main", valeur: "main", distracteurs: ["nain", "bain", "pain"] },
    { id: "les", valeur: "les", distracteurs: ["sel", "des", "ses"] },
    // ... suite du corpus
];
```

```js
// src/data/index.js

/**
 * @typedef {'lettre' | 'syllabe' | 'mot'} TypeUnite
 */

import { lettres } from "./lettres.js";
import { syllabes } from "./syllabes.js";
import { mots } from "./mots.js";

/** @type {Record<TypeUnite, CorpusItem[]>} */
export const corpus = { lettre: lettres, syllabe: syllabes, mot: mots };
```

### 3.2 Règles de construction d'un tour de jeu

```js
/**
 * @typedef {Object} Tour
 * @property {CorpusItem} modele        - L'item à retrouver
 * @property {CorpusItem[]} propositions - Ensemble modèle + distracteurs, mélangé
 * @property {number} indexCorrect       - Index de la bonne réponse dans propositions
 */
```

**Algorithme de construction d'un tour :**

1. Tirer un item aléatoire dans `corpus[typeUnite]`
2. Prendre les `nbPropositions - 1` premiers distracteurs qualifiés de cet item (ou moins s'il n'y en a pas assez — jamais de duplication)
3. Insérer l'item modèle à une position aléatoire dans le tableau résultant
4. Retourner le tour constitué

---

## 4. Hooks personnalisés

### 4.1 `useConfig` — Gestion de la configuration

**Responsabilités :** stocker et persister la configuration enseignant (type d'unité, nombre de propositions, modes TNI et verrouillage).

```js
// src/hooks/useConfig.js

/**
 * @typedef {Object} Config
 * @property {TypeUnite} typeUnite       - Type d'unité linguistique sélectionné
 * @property {number}    nbPropositions  - Nombre d'étiquettes proposées (2–8)
 * @property {boolean}   modeTni         - Mode TNI activé
 * @property {boolean}   verrouille      - Configuration verrouillée
 */

/**
 * Hook de gestion de la configuration enseignant.
 * Persiste la configuration dans localStorage (hors verrou et mode TNI).
 *
 * @returns {{
 *   config: Config,
 *   setTypeUnite: function(TypeUnite): void,
 *   setNbPropositions: function(number): void,
 *   toggleModeTni: function(): void,
 *   toggleVerrouillage: function(): void
 * }}
 */
export function useConfig() { ... }
```

**Points d'implémentation critiques :**

- `useState` avec **initialisation lazy** pour lire `localStorage` sans déclencher de re-render inutile :
    ```js
    const [config, setConfig] = useState(() => loadConfigFromStorage());
    ```
- La persistance dans `localStorage` se fait via une mise à jour directe lors du setter, **jamais via `useEffect`** :
    ```js
    const setTypeUnite = (type) => {
        const next = { ...config, typeUnite: type };
        setConfig(next);
        saveConfigToStorage(next); // écriture directe, synchrone
    };
    ```
- `modeTni` et `verrouille` ne sont **pas persistés** (état de session uniquement)

### 4.2 `useGameEngine` — Moteur de jeu

**Responsabilités :** générer les tours, traiter les réponses, gérer le score, implémenter la répétition espacée implicite.

```js
// src/hooks/useGameEngine.js

/**
 * @typedef {Object} GameState
 * @property {Tour}    tourCourant         - Tour en cours d'affichage
 * @property {number}  score               - Nombre de bonnes réponses consécutives
 * @property {number}  scoreTotal          - Nombre de bonnes réponses sur la session
 * @property {'attente'|'erreur'|'succes'} statut - Statut du tour courant
 * @property {boolean} brevetDisponible    - Seuil de réussite atteint
 * @property {number}  nbErreursTourCourant - Erreurs sur le tour actuel (guidage)
 */

/**
 * Hook moteur de jeu SiMiLire.
 * Génère les tours, traite les réponses, gère le score
 * et la répétition espacée implicite des items échoués.
 *
 * @param {Config} config - Configuration courante
 * @returns {{
 *   gameState: GameState,
 *   repondre: function(string): void,
 *   recommencer: function(): void
 * }}
 */
export function useGameEngine(config) { ... }
```

**Points d'implémentation critiques :**

- La **file d'items** est calculée avec `useMemo` depuis `config` — pas de `useEffect` :
    ```js
    const itemsDisponibles = useMemo(
        () => corpus[config.typeUnite],
        [config.typeUnite]
    );
    ```
- La **répétition espacée implicite** est gérée via une file interne :
    ```js
    // Items échoués réinsérés en tête de file avec priorité ×2
    const [fileItems, setFileItems] = useState(() =>
        shuffleArray(itemsDisponibles)
    );
    ```
- La fonction `repondre(idClique)` :
    1. Compare `idClique` avec `tourCourant.modele.id`
    2. Si correct → incrémente score, génère un nouveau tour, vérifie le seuil du brevet
    3. Si incorrect → incrémente `nbErreursTourCourant`, réinsère l'item en tête de file, passe le statut à `'erreur'`
- Le **seuil du brevet** est fixé à 10 bonnes réponses consécutives (`SEUIL_BREVET = 10`)
- Le statut `'succes'` déclenche un délai de 600ms avant le tour suivant (géré dans le composant par `setTimeout`, pas dans le hook)

### 4.3 `useBrevet` — Génération du brevet

**Responsabilités :** générer le brevet au format PNG via l'API Canvas, entièrement côté client.

```js
// src/hooks/useBrevet.js

/**
 * @typedef {Object} DonneesBrevet
 * @property {string}    prenom        - Prénom saisi par l'élève
 * @property {TypeUnite} typeUnite     - Type d'unité maîtrisé
 * @property {number}    nbPropositions - Nombre de propositions maîtrisé
 */

/**
 * Hook de génération du brevet SiMiLire.
 * Utilise l'API Canvas pour produire une image PNG côté client.
 * Aucune donnée personnelle ne transite par un serveur.
 *
 * @param {DonneesBrevet} donnees - Données à inscrire sur le brevet
 * @returns {{
 *   canvasRef: React.RefObject,
 *   genererBrevet: function(): void,
 *   telechargerBrevet: function(): void,
 *   brevetGenere: boolean
 * }}
 */
export function useBrevet(donnees) { ... }
```

**Points d'implémentation :**

- Rendu Canvas A5 paysage (1587×1122px à 96dpi)
- `telechargerBrevet` utilise le pattern `blob + download attribute` pour la compatibilité Safari iOS
- Le canvas est rendu dans un `<canvas>` caché attaché via `canvasRef`

---

## 5. Architecture des composants

### 5.1 `App.jsx` — Composant racine

**Responsabilités :** orchestrer les hooks, passer les props aux enfants. Aucune logique métier directe.

```jsx
// src/App.jsx

/**
 * Composant racine de SiMiLire.
 * Orchestre useConfig et useGameEngine.
 * Ne contient aucune logique métier directe.
 *
 * @returns {JSX.Element}
 */
function App() {
    const {
        config,
        setTypeUnite,
        setNbPropositions,
        toggleModeTni,
        toggleVerrouillage,
    } = useConfig();
    const { gameState, repondre, recommencer } = useGameEngine(config);

    return (
        <>
            <Navbar />
            <NavbarSpacer />
            <main className="container mx-auto px-4">
                <ConfigPanel
                    config={config}
                    onTypeUnite={setTypeUnite}
                    onNbPropositions={setNbPropositions}
                    onToggleTni={toggleModeTni}
                    onToggleVerrouillage={toggleVerrouillage}
                />
                <ModelZone
                    modele={gameState.tourCourant.modele}
                    modeTni={config.modeTni}
                />
                <ProposalGrid
                    propositions={gameState.tourCourant.propositions}
                    statut={gameState.statut}
                    nbErreurs={gameState.nbErreursTourCourant}
                    onRepondre={repondre}
                    modeTni={config.modeTni}
                />
                <FeedbackMessage
                    statut={gameState.statut}
                    onReessayer={recommencer}
                />
                <ProgressIndicator score={gameState.score} />
                {gameState.brevetDisponible && (
                    <BrevetModal config={config} onFermer={recommencer} />
                )}
            </main>
        </>
    );
}
```

### 5.2 `ConfigPanel.jsx`

```jsx
/**
 * Panneau de configuration enseignant.
 * Toujours visible, discret visuellement (arrière-plan secondaire).
 * Masqué en mode verrouillé.
 *
 * @param {Object}   props
 * @param {Config}   props.config              - Configuration courante
 * @param {Function} props.onTypeUnite         - Callback changement type
 * @param {Function} props.onNbPropositions    - Callback changement nombre
 * @param {Function} props.onToggleTni         - Callback mode TNI
 * @param {Function} props.onToggleVerrouillage - Callback verrouillage
 * @returns {JSX.Element}
 */
```

**Règles de rendu :**

- En mode verrouillé (`config.verrouille === true`) → le panneau est **masqué** (`hidden`), seul le cadenas déverrouillé reste visible
- Le bouton actif des types (`Lettre / Syllabe / Mot`) reçoit `bg-blue-600 text-white`
- Le compteur de propositions permet la saisie directe en plus des boutons `−` / `+`

### 5.3 `EtiquetteCard.jsx`

```jsx
/**
 * Étiquette individuelle cliquable dans la grille de propositions.
 * Gère ses propres états visuels (repos, survol, succès, erreur, guidage).
 *
 * @param {Object}   props
 * @param {string}   props.valeur      - Valeur textuelle de l'étiquette
 * @param {string}   props.id          - Identifiant de l'item
 * @param {boolean}  props.estCorrecte - True si c'est la bonne réponse
 * @param {boolean}  props.estCliquee  - True si l'élève vient de cliquer dessus
 * @param {'attente'|'erreur'|'succes'} props.statut - Statut du tour
 * @param {boolean}  props.guider      - True si guidage discret activé
 * @param {boolean}  props.modeTni     - True si mode TNI actif
 * @param {Function} props.onClic      - Callback au clic
 * @returns {JSX.Element}
 */
```

**Logique des classes Tailwind selon le statut :**

```js
// Calcul des classes — useMemo recommandé dans le composant parent (ProposalGrid)
const classesCarte = {
    repos: "bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50",
    succes: "bg-green-200 border-green-500 animate-pulse",
    erreur: "bg-orange-200 border-orange-500 animate-shake",
    guidage: "bg-yellow-100 border-yellow-300 ring-2 ring-yellow-300",
};
```

> **Note :** `animate-shake` est une animation personnalisée à définir dans `tailwind.config.js` via `extend.keyframes`.

### 5.4 `BrevetModal.jsx`

```jsx
/**
 * Modale de génération et téléchargement du brevet SiMiLire.
 * Délègue la logique de génération au hook useBrevet.
 * Aucune donnée personnelle ne transite par un serveur.
 *
 * @param {Object}   props
 * @param {Config}   props.config   - Configuration au moment de la réussite
 * @param {Function} props.onFermer - Callback fermeture de la modale
 * @returns {JSX.Element}
 */
```

---

## 6. Gestion du state — règles impératives

Ces règles sont issues des standards établis sur les projets MiCetF et sont **non négociables** :

| Règle                                                         | Application dans SiMiLire                                                                               |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Initialisation lazy de `useState`**                         | Toute lecture de `localStorage` se fait en fonction d'initialisation, jamais dans le corps du composant |
| **Pas de `useEffect` pour la synchronisation d'état interne** | La config est écrite dans `localStorage` directement dans les setters, pas via `useEffect([config])`    |
| **`useMemo` pour les valeurs dérivées**                       | `itemsDisponibles`, `classesCarte`, liste de propositions aléatoires                                    |
| **Zéro prop drilling au-delà de 2 niveaux**                   | Si nécessaire, Context API — mais l'architecture actuelle ne l'exige pas                                |
| **Séparation logique / présentation**                         | Les hooks contiennent 100 % de la logique métier — les composants ne font que du rendu                  |

---

## 7. Persistance localStorage

```js
// src/utils/storage.js

/** Clés de stockage SiMiLire */
const CLES = {
  CONFIG: "similire_config",
};

/**
 * @typedef {Object} ConfigPersistee
 * @property {TypeUnite} typeUnite
 * @property {number}    nbPropositions
 */

/** Valeurs par défaut si aucune config n'existe */
const CONFIG_DEFAUT = {
  typeUnite: "lettre",
  nbPropositions: 4,
};

/**
 * Charge la configuration depuis localStorage.
 * @returns {ConfigPersistee}
 */
export function loadConfigFromStorage() { ... }

/**
 * Sauvegarde la configuration dans localStorage.
 * @param {ConfigPersistee} config
 */
export function saveConfigToStorage(config) { ... }
```

**Ce qui est persisté :** `typeUnite`, `nbPropositions`
**Ce qui ne l'est pas :** `modeTni`, `verrouille`, score de session

---

## 8. Principes DRY et modularité — règles impératives

Ces deux principes sont des **contraintes architecturales non négociables**, au même titre que l'absence de warning ESLint. Ils s'appliquent à chaque fichier produit, sans exception.

### 8.1 Règle fondamentale : un code = un endroit

> **Tout code réutilisable — constante, fonction utilitaire, logique métier, hook — vit dans un fichier dédié, est exporté explicitement, et est importé là où il est nécessaire. Il n'est jamais recodé localement, même partiellement, même pour aller vite.**

Cette règle s'applique à quatre niveaux :

---

#### Niveau 1 — Les constantes (`src/constants.js`)

Toute valeur utilisée à plus d'un endroit dans le code est une constante. Elle vit dans `src/constants.js` et nulle part ailleurs.

```js
// src/constants.js

/** Nombre minimum de propositions */
export const NB_PROPOSITIONS_MIN = 2;

/** Nombre maximum de propositions */
export const NB_PROPOSITIONS_MAX = 8;

/** Nombre de propositions par défaut */
export const NB_PROPOSITIONS_DEFAUT = 4;

/** Nombre de bonnes réponses consécutives pour débloquer le brevet */
export const SEUIL_BREVET = 10;

/** Délai en ms avant l'affichage du tour suivant après une bonne réponse */
export const DELAI_SUCCES_MS = 600;

/** Durée en ms du guidage discret (halo sur la réponse correcte) */
export const DUREE_GUIDAGE_MS = 1000;

/** Clés de stockage localStorage */
export const CLES_STORAGE = {
    CONFIG: "similire_config",
};

/** Types d'unités linguistiques disponibles */
export const TYPES_UNITE = /** @type {const} */ (["lettre", "syllabe", "mot"]);
```

**Antipattern interdit :**

```js
// ❌ INTERDIT — valeur magique dans un hook
if (score >= 10) {
    setBrevetDisponible(true);
}

// ✅ CORRECT — import depuis constants.js
import { SEUIL_BREVET } from "@/constants.js";
if (score >= SEUIL_BREVET) {
    setBrevetDisponible(true);
}
```

---

#### Niveau 2 — Les utilitaires (`src/utils/`)

Chaque fichier utilitaire a une **responsabilité unique et déclarée**. Une fonction utilitaire n'est jamais réécrite inline dans un hook ou un composant.

**`src/utils/random.js`** — tout ce qui touche à l'aléatoire

```js
// src/utils/random.js

/**
 * Mélange un tableau de façon aléatoire (algorithme Fisher-Yates).
 * Retourne un NOUVEAU tableau — ne mute pas l'original.
 *
 * @template T
 * @param {T[]} tableau - Le tableau à mélanger
 * @returns {T[]} Nouveau tableau mélangé
 */
export function melangerTableau(tableau) { ... }

/**
 * Tire un élément aléatoire dans un tableau.
 *
 * @template T
 * @param {T[]} tableau - Le tableau source
 * @returns {T} Un élément aléatoire
 */
export function tirerAleatoire(tableau) { ... }

/**
 * Insère un élément à une position aléatoire dans un tableau.
 * Retourne un NOUVEAU tableau — ne mute pas l'original.
 *
 * @template T
 * @param {T[]} tableau  - Le tableau de base
 * @param {T}   element  - L'élément à insérer
 * @returns {T[]} Nouveau tableau avec l'élément inséré aléatoirement
 */
export function insererAleatoirement(tableau, element) { ... }
```

**Antipattern interdit :**

```js
// ❌ INTERDIT — logique aléatoire inline dans useGameEngine
const propositionsMelangees = [...distracteurs, modele].sort(
    () => Math.random() - 0.5
);

// ✅ CORRECT — import depuis random.js
import { insererAleatoirement, melangerTableau } from "@utils/random.js";
const propositions = insererAleatoirement(distracteurs, modele);
```

**`src/utils/storage.js`** — tout ce qui touche à `localStorage`

```js
// src/utils/storage.js
import { CLES_STORAGE, NB_PROPOSITIONS_DEFAUT, TYPES_UNITE } from "@/constants.js";

/**
 * Charge la configuration depuis localStorage.
 * Retourne les valeurs par défaut si aucune config n'existe ou si le JSON est corrompu.
 *
 * @returns {ConfigPersistee}
 */
export function loadConfigFromStorage() { ... }

/**
 * Sauvegarde la configuration dans localStorage.
 *
 * @param {ConfigPersistee} config
 * @returns {void}
 */
export function saveConfigToStorage(config) { ... }
```

**Antipattern interdit :**

```js
// ❌ INTERDIT — accès direct à localStorage dans un hook
const [config, setConfig] = useState(() => {
    const raw = localStorage.getItem("similire_config");
    return raw ? JSON.parse(raw) : { typeUnite: "lettre", nbPropositions: 4 };
});

// ✅ CORRECT — import depuis storage.js
import { loadConfigFromStorage, saveConfigToStorage } from "@utils/storage.js";
const [config, setConfig] = useState(() => loadConfigFromStorage());
```

**`src/utils/canvas.js`** — tout ce qui touche au rendu Canvas

```js
// src/utils/canvas.js

/**
 * Dessine le fond et le cadre décoratif du brevet sur le canvas.
 *
 * @param {CanvasRenderingContext2D} ctx    - Contexte 2D du canvas
 * @param {number}                   width  - Largeur du canvas en px
 * @param {number}                   height - Hauteur du canvas en px
 * @returns {void}
 */
export function dessinerFondBrevet(ctx, width, height) { ... }

/**
 * Écrit un texte centré horizontalement sur le canvas.
 *
 * @param {CanvasRenderingContext2D} ctx    - Contexte 2D
 * @param {string}                   texte  - Texte à écrire
 * @param {number}                   y      - Position verticale en px
 * @param {string}                   fonte  - Fonte CSS canvas (ex. "bold 48px sans-serif")
 * @param {string}                   couleur - Couleur CSS
 * @returns {void}
 */
export function ecrireCentre(ctx, texte, y, fonte, couleur) { ... }

/**
 * Déclenche le téléchargement d'un canvas au format PNG.
 * Utilise le pattern blob + download attribute pour la compatibilité Safari iOS.
 *
 * @param {HTMLCanvasElement} canvas    - Le canvas à exporter
 * @param {string}            nomFichier - Nom du fichier téléchargé (sans extension)
 * @returns {void}
 */
export function telechargerCanvasPng(canvas, nomFichier) { ... }
```

---

#### Niveau 3 — Les hooks (`src/hooks/`)

Un hook encapsule de la logique réutilisable. Il n'est **instancié qu'à un seul niveau de l'arbre** — en pratique dans `App.jsx` — et ses valeurs descendent par props. Appeler un même hook dans plusieurs composants pour éviter le prop drilling est interdit : c'est une duplication de logique.

```js
// ❌ INTERDIT — useConfig() appelé dans un composant enfant
function ConfigPanel() {
  const { config } = useConfig(); // Crée une instance parallèle non liée
  ...
}

// ✅ CORRECT — config passé par props depuis App.jsx
function ConfigPanel({ config, onTypeUnite, onNbPropositions }) {
  ...
}
```

Un hook n'embarque jamais de logique qui appartient à un utilitaire ou à une constante :

```js
// ❌ INTERDIT — logique de stockage codée dans le hook
export function useConfig() {
    const [config, setConfig] = useState(() => {
        try {
            return (
                JSON.parse(localStorage.getItem("similire_config")) ??
                CONFIG_DEFAUT
            );
        } catch {
            return CONFIG_DEFAUT;
        }
    });
}

// ✅ CORRECT — délégation totale à storage.js
import { loadConfigFromStorage, saveConfigToStorage } from "@utils/storage.js";

export function useConfig() {
    const [config, setConfig] = useState(() => loadConfigFromStorage());
}
```

---

#### Niveau 4 — Les composants (`src/components/`)

Un composant ne contient **aucune logique métier**. Il reçoit des données par props, affiche, et remonte des événements par callbacks. Toute logique appartient à un hook ou un utilitaire.

```jsx
// ❌ INTERDIT — logique de génération de tour dans un composant
function ProposalGrid({ modele, corpus, nbPropositions }) {
  // Logique de mélange inline → appartient à useGameEngine
  const propositions = [modele, ...corpus.slice(0, nbPropositions - 1)]
    .sort(() => Math.random() - 0.5);
  ...
}

// ✅ CORRECT — propositions déjà construites, reçues par props
function ProposalGrid({ propositions, statut, onRepondre, modeTni }) {
  return (
    <div className="grid gap-4">
      {propositions.map((item) => (
        <EtiquetteCard key={item.id} {...item} onClic={onRepondre} modeTni={modeTni} />
      ))}
    </div>
  );
}
```

---

### 8.2 Règles de taille et de responsabilité

Ces seuils sont des **indicateurs de maintenabilité**. Les dépasser n'est pas interdit mais déclenche une revue du découpage.

| Unité              | Seuil d'alerte         | Action recommandée                                |
| ------------------ | ---------------------- | ------------------------------------------------- |
| Composant          | > 100 lignes JSX       | Extraire des sous-composants                      |
| Hook               | > 80 lignes de logique | Extraire vers un utilitaire ou un hook secondaire |
| Fichier utilitaire | > 60 lignes            | Vérifier si la responsabilité est encore unique   |
| Fonction           | > 20 lignes            | Vérifier si elle fait une seule chose             |

**Principe de responsabilité unique appliqué à SiMiLire :**

| Fichier                             | Fait exactement                                   |
| ----------------------------------- | ------------------------------------------------- |
| `constants.js`                      | Déclarer les valeurs partagées                    |
| `utils/random.js`                   | Fournir des fonctions d'aléatoire pures           |
| `utils/storage.js`                  | Lire et écrire dans localStorage                  |
| `utils/canvas.js`                   | Fournir des primitives de rendu Canvas            |
| `hooks/useConfig.js`                | Gérer l'état de la configuration                  |
| `hooks/useGameEngine.js`            | Gérer la logique du jeu                           |
| `hooks/useBrevet.js`                | Orchestrer la génération du brevet                |
| `components/game/EtiquetteCard.jsx` | Afficher une étiquette et gérer ses états visuels |
| `components/game/ProposalGrid.jsx`  | Disposer les étiquettes en grille                 |
| `App.jsx`                           | Instancier les hooks et distribuer props          |

---

### 8.3 Checklist DRY — à vérifier avant chaque commit

Avant tout commit, répondre `oui` à chacune de ces questions :

- [ ] Toutes les valeurs numériques ou textuelles partagées viennent de `constants.js` ?
- [ ] Aucun `localStorage.getItem` / `setItem` en dehors de `storage.js` ?
- [ ] Aucun `Math.random()` ou logique de mélange en dehors de `random.js` ?
- [ ] Aucun `canvas.getContext` ou `canvas.toBlob` en dehors de `canvas.js` ?
- [ ] Aucun hook instancié à plusieurs niveaux de l'arbre de composants ?
- [ ] Aucune logique métier (calcul, transformation, décision) dans un composant ?
- [ ] Chaque fonction fait une seule chose, lisible à son nom seul ?

---

## 9. Standards de code

### 9.1 JSDoc

Chaque fonction, hook et composant est documenté en **français** avec JSDoc complet :

```js
/**
 * Description courte en français.
 * Description longue si nécessaire.
 *
 * @param {Type} nomParam - Description du paramètre
 * @returns {Type} Description de la valeur retournée
 */
```

### 9.2 PropTypes

PropTypes obligatoire sur chaque composant, déclaré **après** la définition de la fonction :

```jsx
import PropTypes from "prop-types";

EtiquetteCard.propTypes = {
    valeur: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    estCorrecte: PropTypes.bool.isRequired,
    estCliquee: PropTypes.bool.isRequired,
    statut: PropTypes.oneOf(["attente", "erreur", "succes"]).isRequired,
    guider: PropTypes.bool.isRequired,
    modeTni: PropTypes.bool.isRequired,
    onClic: PropTypes.func.isRequired,
};
```

### 9.3 Organisation des classes Tailwind

Ordre conventionnel au sein d'un élément :

```
layout → flexbox/grid → sizing → spacing → typography → colors → borders → effects → transitions → responsive → dark
```

Exemple :

```jsx
className="flex items-center justify-center w-20 h-20 p-2 text-2xl font-bold
           bg-white text-gray-800 border-2 border-gray-300 rounded-lg shadow-sm
           transition-colors duration-200 hover:border-blue-400 hover:bg-blue-50
           md:w-32 md:h-32 md:text-4xl"
```

### 9.4 Convention de commits

```
feat:     Nouvelle fonctionnalité
fix:      Correction de bug
refactor: Refactoring sans changement de comportement
style:    Formatage, organisation Tailwind
docs:     Documentation, JSDoc
chore:    Configuration, dépendances
```

Exemples :

```bash
git commit -m "feat: ajout du hook useGameEngine avec répétition espacée"
git commit -m "fix: correction de la taille des zones de clic en mode TNI"
git commit -m "docs: JSDoc complet sur useBrevet"
```

---

## 10. Configuration Vite

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
    const isProd = mode === "production";

    return {
        plugins: [react()],

        // En production : /similire/ — en développement : /
        base: isProd ? "/similire/" : "/",

        resolve: {
            alias: {
                "@": resolve(__dirname, "./src"),
                "@data": resolve(__dirname, "./src/data"),
                "@hooks": resolve(__dirname, "./src/hooks"),
                "@utils": resolve(__dirname, "./src/utils"),
                "@constants": resolve(__dirname, "./src/constants.js"),
            },
        },

        build: {
            outDir: "dist",
            assetsDir: "assets",
        },

        server: {
            port: 3001, // 3000 réservé au projet home MiCetF
            open: true,
        },
    };
});
```

---

## 11. Configuration ESLint

```js
// eslint.config.js
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
    js.configs.recommended,
    {
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
        },
        rules: {
            // Hooks
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            // PropTypes
            "react/prop-types": "error",

            // Qualité générale
            "no-unused-vars": "error",
            "no-console": "warn",

            // React moderne
            "react/react-in-jsx-scope": "off", // Pas besoin d'importer React en React 18
        },
        settings: {
            react: { version: "detect" },
        },
    },
];
```

> **Exigence absolue :** `pnpm run build` doit se terminer avec **zéro warning ESLint**.

---

## 12. Configuration Tailwind

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            // Animation shake pour le feedback d'erreur
            keyframes: {
                shake: {
                    "0%, 100%": { transform: "translateX(0)" },
                    "20%": { transform: "translateX(-6px)" },
                    "40%": { transform: "translateX(6px)" },
                    "60%": { transform: "translateX(-4px)" },
                    "80%": { transform: "translateX(4px)" },
                },
            },
            animation: {
                shake: "shake 0.4s ease-in-out",
            },
            // Tailles TNI
            fontSize: {
                "tni-sm": ["2rem", { lineHeight: "2.5rem" }],
                "tni-md": ["3rem", { lineHeight: "3.5rem" }],
                "tni-lg": ["4rem", { lineHeight: "4.5rem" }],
            },
        },
    },
    plugins: [],
};
```

---

## 13. Intégration dans l'écosystème MiCetF

### 13.1 Mise à jour de `micetf-data`

Modifier `data/src/applications.js` :

```js
{
  id: "similire",
  title: "SiMiLire",
  url: "similire",
  description:
    "Jeu interactif permettant d'exercer sa discrimination visuelle " +
    "pour améliorer sa vitesse de lecture. Retrouve l'étiquette identique " +
    "parmi des distracteurs visuellement proches : lettres, syllabes ou mots.",
  thumbnail: "similire.png",
  keywords: [
    "discrimination visuelle",
    "lecture",
    "français",
    "similaire",
    "syllabes",
    "lettres",
    "mots",
    "fluence",
    "décodage",
  ],
},
```

### 13.2 Redirection HTTP 301

À configurer côté serveur (Apache `.htaccess` ou Nginx) :

```apache
# .htaccess
Redirect 301 /discrimination/ /similire/
Redirect 301 /discrimination  /similire
```

### 13.3 Miniature `similire.png`

Format attendu : **280×210px**, PNG, cohérent avec les miniatures existantes de `micetf-data`.

---

## 14. Hors périmètre technique

| Fonctionnalité              | Raison d'exclusion                                     |
| --------------------------- | ------------------------------------------------------ |
| Backend / API               | Données locales uniquement — pas de serveur applicatif |
| Base de données             | localStorage suffisant pour la configuration           |
| Authentification            | Aucune gestion de compte                               |
| Tests automatisés           | Hors périmètre de cette version                        |
| PWA / Service Worker        | Évolution future possible (EV-06)                      |
| Internationalisation (i18n) | Application mono-langue (français)                     |

---

## 15. Ordre de développement recommandé

| Étape | Module                      | Livrable                                                                     |
| ----- | --------------------------- | ---------------------------------------------------------------------------- |
| 1     | Constantes                  | `src/constants.js` complet — aucune valeur magique dans le reste du code     |
| 2     | Données                     | `src/data/` complet avec corpus et distracteurs qualifiés                    |
| 3     | Utilitaires                 | `src/utils/random.js`, `src/utils/storage.js`, `src/utils/canvas.js`         |
| 4     | `useConfig`                 | Hook + persistance via `storage.js`                                          |
| 5     | `useGameEngine`             | Moteur de jeu complet via `random.js` + `constants.js`                       |
| 6     | Composants de jeu           | `ModelZone`, `ProposalGrid`, `EtiquetteCard`, `FeedbackMessage`              |
| 7     | `ConfigPanel`               | Panneau enseignant avec modes TNI et verrouillage                            |
| 8     | `ProgressIndicator`         | Indicateur de progression                                                    |
| 9     | `useBrevet` + `BrevetModal` | Génération Canvas via `canvas.js`                                            |
| 10    | Intégration MiCetF          | Navbar, NavbarSpacer, mise à jour micetf-data                                |
| 11    | Recette                     | Checklist DRY complète + zéro warning ESLint + tests manuels multi-contextes |

---

_Spécifications techniques rédigées dans le cadre du projet de refonte des outils MiCetF._
_Frédéric MISERY — micetf.fr_
