# Plan d'action — Implémentation de SiMiLire

**Application :** `micetf.fr/similire/`
**Date :** 19 février 2026
**Gestionnaire de paquets :** pnpm

---

## Principes généraux du plan

### Déroulement de chaque sprint

```
1. PROPOSITION  → Code fourni complet et documenté
2. ÉCHANGE      → Questions / clarifications avant de coder
3. TEST         → Tu testes : ESLint, console, affichage, comportement
4. CORRECTION   → Aller/retour jusqu'à validation complète
5. DOC          → Mise à jour CHANGELOG + README si nécessaire
6. COMMIT       → Message de commit proposé + workflow git guidé
```

### Règle de validation d'un sprint

Un sprint est **terminé** si et seulement si :

- `pnpm run build` se termine sans warning ni erreur ESLint
- Aucune erreur dans la console navigateur
- Le comportement correspond aux specs fonctionnelles
- La checklist DRY est respectée

---

## Workflow git — référence permanente

### Modèle de branches

```
main
 └── develop
      ├── feat/sprint-00-init
      ├── feat/sprint-01-constants-data
      ├── feat/sprint-02-utils
      ├── feat/sprint-03-useconfig
      ├── feat/sprint-04-game-engine
      ├── feat/sprint-05-composants-jeu
      ├── feat/sprint-06-config-panel
      ├── feat/sprint-07-progression-brevet
      ├── feat/sprint-08-layout-integration
      └── feat/sprint-09-deploiement
```

**Règles :**

- `main` ne reçoit que des merges depuis `develop` — jamais de commit direct
- `develop` ne reçoit que des merges depuis les branches `feat/`
- Chaque sprint = une branche `feat/` dédiée
- Les tags de version sont posés sur `main` après chaque merge validé

### Commandes git — référence par étape

#### Démarrer un sprint

```bash
# Se positionner sur develop et s'assurer qu'elle est à jour
git checkout develop
git pull origin develop

# Créer la branche du sprint
git checkout -b feat/sprint-XX-nom-du-sprint
```

#### Pendant le développement

```bash
# Vérifier l'état courant
git status

# Ajouter les fichiers modifiés (jamais git add . en aveugle)
git add src/constants.js
git add src/utils/random.js

# Commit atomique (un commit = une unité logique de travail)
git commit -m "feat: ajout des constantes partagées"

# Pousser la branche sur GitHub
git push origin feat/sprint-XX-nom-du-sprint
```

#### Valider et fusionner un sprint

```bash
# Revenir sur develop
git checkout develop

# Fusionner la branche du sprint (--no-ff conserve l'historique)
git merge --no-ff feat/sprint-XX-nom-du-sprint -m "merge: sprint XX — nom du sprint"

# Pousser develop sur GitHub
git push origin develop

# Supprimer la branche locale (elle est mergée, inutile de la garder)
git branch -d feat/sprint-XX-nom-du-sprint

# Supprimer la branche distante
git push origin --delete feat/sprint-XX-nom-du-sprint
```

#### Merger develop dans main et tagger

```bash
git checkout main
git merge --no-ff develop -m "release: v0.X.0 — nom de la version"
git tag -a v0.X.0 -m "Version 0.X.0 — description courte"
git push origin main
git push origin --tags
git checkout develop
```

#### Conventions de messages de commit

```
feat:     Nouvelle fonctionnalité
fix:      Correction de bug
refactor: Refactoring sans changement de comportement
style:    Formatage, organisation Tailwind
docs:     Documentation, JSDoc, CHANGELOG, README
chore:    Configuration, dépendances, outils
merge:    Fusion de branche
release:  Tag de version
```

---

## Sprint 0 — Initialisation du projet : ✅ TERMINÉ

**Objectif :** projet fonctionnel, vide, qui compile et passe ESLint.
**Durée estimée :** 1 session

### Étapes

#### 0.1 Scaffolding Vite

```bash
# Depuis le dossier parent de tes projets MiCetF
pnpm create vite@latest similire -- --template react
cd similire
pnpm install
```

#### 0.2 Installation des dépendances

```bash
# Tailwind et PostCSS
pnpm add -D tailwindcss@^3.4.17 autoprefixer postcss
pnpm exec tailwindcss init -p

# PropTypes
pnpm add prop-types

# ESLint (ESLint 9 avec flat config)
pnpm add -D eslint @eslint/js eslint-plugin-react eslint-plugin-react-hooks

# Prettier
pnpm add -D prettier
```

#### 0.3 Fichiers de configuration

Fichiers fournis dans ce sprint :

- `vite.config.js` — avec aliases et base dynamique
- `tailwind.config.js` — avec animation shake et tailles TNI
- `eslint.config.js` — avec règles zéro warning
- `.prettierrc` — formatage cohérent
- `postcss.config.js`
- `src/index.css` — directives Tailwind

#### 0.4 Nettoyage du scaffold

Suppression des fichiers générés par Vite inutiles :

- `src/App.css`
- `src/assets/react.svg`
- `public/vite.svg`

Remplacement de `src/App.jsx` et `src/main.jsx` par des versions minimales.

#### 0.5 Validation du sprint 0

```bash
pnpm run dev     # doit afficher "SiMiLire — OK" dans le navigateur
pnpm run build   # doit se terminer sans warning
```

#### 0.6 Workflow git

```bash
git init
git remote add origin https://github.com/micetf/similire.git

# Première branche
git checkout -b develop
git add .
git commit -m "chore: initialisation du projet SiMiLire"
git push -u origin develop

# main depuis develop
git checkout -b main
git push -u origin main
git checkout develop
```

**Documents mis à jour en fin de sprint :**

- `README.md` — structure minimale (nom, stack, commandes de base)
- `CHANGELOG.md` — créé avec entrée `[0.1.0] - Sprint 0 — Initialisation`

---

## Sprint 1 — Constantes et données : ✅ TERMINÉ

**Objectif :** socle de données complet, typé, importable.
**Durée estimée :** 1–2 sessions
**Branche :** `feat/sprint-01-constants-data`

### Fichiers produits

```
src/
├── constants.js          ← NOUVEAU
└── data/
    ├── index.js          ← NOUVEAU
    ├── lettres.js        ← NOUVEAU
    ├── syllabes.js       ← NOUVEAU
    └── mots.js           ← NOUVEAU
```

### Contenu

**`src/constants.js`**

- `NB_PROPOSITIONS_MIN`, `NB_PROPOSITIONS_MAX`, `NB_PROPOSITIONS_DEFAUT`
- `SEUIL_BREVET`
- `DELAI_SUCCES_MS`, `DUREE_GUIDAGE_MS`
- `CLES_STORAGE`
- `TYPES_UNITE`

**`src/data/lettres.js`**
Corpus complet des lettres avec distracteurs qualifiés (familles de confusion b/d/p/q, n/u/m, i/l/j, c/e/o, etc.)

**`src/data/syllabes.js`**
Corpus des syllabes avec distracteurs qualifiés (nasales, syllabes miroirs, etc.)

**`src/data/mots.js`**
Corpus des mots avec distracteurs qualifiés (mots miroirs, rimes orthographiques, etc.)

**`src/data/index.js`**
Export de `corpus` — objet `Record<TypeUnite, CorpusItem[]>`

### Validation du sprint 1

```bash
# Test manuel dans la console navigateur (ou un composant de debug temporaire)
import { corpus } from "@data";
console.log(corpus.lettre.length);   // doit être > 10
console.log(corpus.syllabe.length);  // doit être > 10
console.log(corpus.mot.length);      // doit être > 10
pnpm run build   # zéro warning
```

**Documents mis à jour :**

- `CHANGELOG.md` — `[0.2.0] - Sprint 1 — Constantes et données`

---

## Sprint 2 — Utilitaires : : ✅ TERMINÉ

**Objectif :** fonctions pures, testables mentalement, sans effet de bord.
**Durée estimée :** 1 session
**Branche :** `feat/sprint-02-utils`

### Fichiers produits

```
src/utils/
├── random.js    ← NOUVEAU
├── storage.js   ← NOUVEAU
└── canvas.js    ← NOUVEAU
```

### Contenu

**`src/utils/random.js`**

- `melangerTableau(tableau)` — Fisher-Yates, retourne un nouveau tableau
- `tirerAleatoire(tableau)` — retourne un élément aléatoire
- `insererAleatoirement(tableau, element)` — insère à position aléatoire

**`src/utils/storage.js`**

- `loadConfigFromStorage()` — lecture sécurisée avec try/catch + valeurs par défaut
- `saveConfigToStorage(config)` — écriture sécurisée avec try/catch

**`src/utils/canvas.js`**

- `dessinerFondBrevet(ctx, width, height)` — fond + cadre décoratif
- `ecrireCentre(ctx, texte, y, fonte, couleur)` — texte centré
- `telechargerCanvasPng(canvas, nomFichier)` — blob + download attribute

### Validation du sprint 2

```bash
# Vérification manuelle dans la console :
import { melangerTableau } from "@utils/random.js";
const t = [1,2,3,4,5];
console.log(melangerTableau(t)); // ordre différent, longueur identique
console.log(t);                  // tableau original inchangé

pnpm run build   # zéro warning
```

**Documents mis à jour :**

- `CHANGELOG.md` — `[0.3.0] - Sprint 2 — Utilitaires`

---

## Sprint 3 — Hook `useConfig` : : ✅ TERMINÉ

**Objectif :** gestion de la configuration avec persistance localStorage.
**Durée estimée :** 1 session
**Branche :** `feat/sprint-03-useconfig`

### Fichiers produits

```
src/hooks/
└── useConfig.js    ← NOUVEAU
```

### Comportement attendu

- Lecture initiale depuis `localStorage` (lazy init)
- Écriture dans `localStorage` à chaque setter (synchrone, sans `useEffect`)
- `modeTni` et `verrouille` : état de session uniquement, non persistés
- API : `{ config, setTypeUnite, setNbPropositions, toggleModeTni, toggleVerrouillage }`

### Validation du sprint 3

Test via un `App.jsx` minimaliste qui affiche la config et des boutons pour la modifier.
Vérifier dans DevTools → Application → localStorage que `similire_config` se met à jour.

**Documents mis à jour :**

- `CHANGELOG.md` — `[0.4.0] - Sprint 3 — Hook useConfig`

---

## Sprint 4 — Hook `useGameEngine` : : ✅ TERMINÉ

**Objectif :** moteur de jeu complet (génération des tours, scoring, répétition espacée).
**Durée estimée :** 2 sessions
**Branche :** `feat/sprint-04-game-engine`

### Fichiers produits

```
src/hooks/
└── useGameEngine.js    ← NOUVEAU
```

### Comportement attendu

- Reçoit `config` en paramètre
- Génère le premier tour à l'initialisation
- `repondre(id)` : traite la réponse, met à jour le statut et le score
- Répétition espacée : items échoués réinsérés en tête de file
- `brevetDisponible` passe à `true` après `SEUIL_BREVET` réussites consécutives
- `recommencer()` : réinitialise le score et génère un nouveau tour

### Validation du sprint 4

Test via `App.jsx` avec affichage brut (pas encore de composants graphiques) :

```jsx
<pre>{JSON.stringify(gameState, null, 2)}</pre>
<button onClick={() => repondre(gameState.tourCourant.modele.id)}>
  Bonne réponse
</button>
<button onClick={() => repondre("mauvaise")}>
  Mauvaise réponse
</button>
```

**Documents mis à jour :**

- `CHANGELOG.md` — `[0.5.0] - Sprint 4 — Hook useGameEngine`

---

## Sprint 5 — Composants de jeu : ✅ TERMINÉ

**Objectif :** interface jouable de bout en bout, sans ConfigPanel ni brevet.
**Durée estimée :** 2–3 sessions
**Branche :** `feat/sprint-05-composants-jeu`

### Fichiers produits

```
src/components/game/
├── ModelZone.jsx       ← NOUVEAU
├── ProposalGrid.jsx    ← NOUVEAU
├── EtiquetteCard.jsx   ← NOUVEAU
└── FeedbackMessage.jsx ← NOUVEAU
```

### Ordre de développement interne

1. `EtiquetteCard` — brique de base, états visuels complets
2. `ProposalGrid` — grille d'étiquettes
3. `ModelZone` — affichage du modèle
4. `FeedbackMessage` — message d'erreur + bouton Réessayer
5. Intégration dans `App.jsx`

### Points d'attention

- Tailles de clic : 80×80px minimum (standard), doublé en mode TNI
- Animation `shake` sur erreur (classe Tailwind personnalisée)
- Flash `green` sur succès
- Halo `yellow` au 2e échec (guidage discret)
- PropTypes complets sur chaque composant
- JSDoc en français

### Validation du sprint 5

- Cliquer la bonne réponse → animation verte → nouveau tour
- Cliquer une mauvaise réponse → animation orange + message
- Cliquer une 2e mauvaise réponse → halo jaune sur la bonne réponse
- Aucune erreur console
- `pnpm run build` zéro warning

**Documents mis à jour :**

- `CHANGELOG.md` — `[0.6.0] - Sprint 5 — Composants de jeu`

---

## Sprint 6 — Panneau de configuration ✅ TERMINÉ

**Objectif :** panneau enseignant complet, verrouillable, mode TNI.
**Durée estimée :** 1–2 sessions
**Branche :** `feat/sprint-06-config-panel`

### Fichiers produits

```
src/components/config/
└── ConfigPanel.jsx    ← NOUVEAU
```

### Comportement attendu

- Toujours visible (sauf en mode verrouillé)
- Sélecteur de type : 3 boutons toggle (`Lettre / Syllabe / Mot`)
- Compteur de propositions : boutons `−` / `+` + saisie directe
- Bouton mode TNI : double toutes les tailles
- Bouton verrou : masque le panneau

### Validation du sprint 6

- Changer de type → le jeu bascule immédiatement
- Changer le nombre → la grille s'adapte au tour suivant
- Mode TNI → tout s'agrandit visuellement
- Verrou → panneau masqué, cadenas seul visible
- Rechargement page → config restaurée depuis localStorage
- `pnpm run build` zéro warning

**Documents mis à jour :**

- `CHANGELOG.md` — `[0.7.0] - Sprint 6 — Panneau de configuration`

---

## Sprint 7 — Progression et brevet ✅ TERMINÉ

**Objectif :** indicateur de progression + génération du brevet PNG.
**Durée estimée :** 2 sessions
**Branche :** `feat/sprint-07-progression-brevet`

### Fichiers produits

```
src/components/progress/
└── ProgressIndicator.jsx    ← NOUVEAU

src/components/brevet/
└── BrevetModal.jsx          ← NOUVEAU

src/hooks/
└── useBrevet.js             ← NOUVEAU
```

### Comportement attendu

**`ProgressIndicator`**

- Étoiles (1 par tranche de 5 réussites)
- Barre de progression (remplissage continu)
- Score numérique à partir de 10 réussites
- Positionné en coin bas gauche, discret

**`useBrevet`**

- Canvas A5 paysage (1587×1122px)
- Délègue le rendu à `canvas.js`
- `telechargerBrevet` via blob + download attribute

**`BrevetModal`**

- Modale accessible (focus trap)
- Champ prénom avec icône crayon
- Aperçu du brevet dans la modale
- Boutons : Télécharger / Fermer

### Validation du sprint 7

- Atteindre `SEUIL_BREVET` réussites → modale apparaît
- Saisir un prénom → brevet généré avec prénom, date, type, nb propositions
- Télécharger → fichier PNG téléchargé (vérifier nom du fichier)
- Fermer → retour au jeu, score réinitialisé
- Test sur mobile (Safari iOS) — téléchargement fonctionnel
- `pnpm run build` zéro warning

**Documents mis à jour :**

- `CHANGELOG.md` — `[0.8.0] - Sprint 7 — Progression et brevet`

---

## Sprint 8 — Layout et intégration MiCetF ✅ TERMINÉ

**Objectif :** habillage MiCetF complet + mise à jour micetf-data.
**Durée estimée :** 1 session
**Branche :** `feat/sprint-08-layout-integration`

### Fichiers produits / modifiés

```
src/components/layout/
├── Navbar.jsx        ← NOUVEAU (converti depuis le HTML de Lecture Flash)
└── NavbarSpacer.jsx  ← NOUVEAU

public/
└── favicon.ico       ← NOUVEAU

[dépôt micetf-data]
└── src/applications.js  ← MODIFIÉ (ajout entrée similire)
```

### Points d'attention

- La `Navbar` est convertie depuis le HTML existant de Lecture Flash
  (navbar `fixed`, `bg-gray-800`, logo MiCetF, boutons don/contact, menu mobile)
- Le titre affiché : `SiMiLire` avec le chevron MiCetF
- `NavbarSpacer` compense la hauteur `h-14` de la navbar fixed
- Miniature `similire.png` (280×210px) à créer## Sprint 9 — Build et déploiement OVH

**Objectif :** application en production sur `micetf.fr/similire/`.
**Durée estimée :** 1 session
**Branche :** `feat/sprint-09-deploiement`

## Fix post-sprints

## fix/etiquette-ui — débordement texte + centrage ProposalGrid : ✅ CORRIGÉ

## Sprint 9 — Déploiement OVH : ✅ TERMINÉ

### 9.1 Build de production

```bash
# Vérification finale avant build
pnpm run lint       # zéro warning
pnpm run build      # génère dist/

# Vérification du build
pnpm run preview    # http://localhost:4173/similire/
```

### 9.2 Structure du build généré

```
dist/
├── index.html
└── assets/
    ├── index-[hash].js
    └── index-[hash].css
```

### 9.3 Déploiement sur OVH via FTP/SFTP

**Option A — FTP manuel (FileZilla)**

```
Serveur   : ftp.micetf.fr (ou ssh.micetf.fr selon config OVH)
Dossier distant cible : /www/similire/
Contenu à uploader : tout le contenu de dist/
```

**Option B — Déploiement via script rsync (recommandé)**

```bash
# Créer un script deploy.sh à la racine du projet
rsync -avz --delete dist/ user@ssh.micetf.fr:/www/similire/
```

```bash
# Usage
pnpm run deploy
```

Ajouter dans `package.json` :

```json
"scripts": {
  "deploy": "pnpm run build && rsync -avz --delete dist/ user@ssh.micetf.fr:/www/similire/"
}
```

### 9.4 Redirection HTTP 301

Sur le serveur OVH, dans le dossier `/www/discrimination/` :

```apache
# /www/discrimination/.htaccess
Redirect 301 / https://micetf.fr/similire/
```

### 9.5 Vérifications post-déploiement

```
✓ https://micetf.fr/similire/          → application chargée
✓ https://micetf.fr/discrimination/    → redirigée vers /similire/
✓ Console navigateur                   → aucune erreur
✓ DevTools Network                     → assets chargés (pas de 404)
✓ Test mobile (iOS Safari, Android Chrome)
✓ Test TNI (résolution 1920×1080, zoom navigateur 100%)
```

### 9.6 Tag de version finale et merge dans main

```bash
git checkout develop
git merge --no-ff feat/sprint-09-deploiement -m "merge: sprint 9 — déploiement OVH"
git push origin develop

git checkout main
git merge --no-ff develop -m "release: v1.0.0 — SiMiLire en production"
git tag -a v1.0.0 -m "Version 1.0.0 — Première mise en production sur micetf.fr/similire"
git push origin main
git push origin --tags
```

**Documents mis à jour :**

- `CHANGELOG.md` — `[1.0.0] - Sprint 9 — Mise en production`
- `README.md` — URL de production, instructions de déploiement complètes

---

## Récapitulatif des sprints

| Sprint | Contenu                               | Branche                             | Tag cible |
| ------ | ------------------------------------- | ----------------------------------- | --------- |
| **0**  | Init projet, config outils            | `feat/sprint-00-init`               | `v0.1.0`  |
| **1**  | Constantes + données corpus           | `feat/sprint-01-constants-data`     | `v0.2.0`  |
| **2**  | Utilitaires (random, storage, canvas) | `feat/sprint-02-utils`              | `v0.3.0`  |
| **3**  | Hook `useConfig`                      | `feat/sprint-03-useconfig`          | `v0.4.0`  |
| **4**  | Hook `useGameEngine`                  | `feat/sprint-04-game-engine`        | `v0.5.0`  |
| **5**  | Composants de jeu                     | `feat/sprint-05-composants-jeu`     | `v0.6.0`  |
| **6**  | Panneau de configuration              | `feat/sprint-06-config-panel`       | `v0.7.0`  |
| **7**  | Progression + brevet                  | `feat/sprint-07-progression-brevet` | `v0.8.0`  |
| **8**  | Layout MiCetF + intégration           | `feat/sprint-08-layout-integration` | `v0.9.0`  |
| **9**  | Build + déploiement OVH               | `feat/sprint-09-deploiement`        | `v1.0.0`  |

---

## Commandes de référence rapide

```bash
# Démarrer un sprint
git checkout develop && git pull origin develop
git checkout -b feat/sprint-XX-nom

# En cours de sprint
git status
git add src/fichier-modifie.js
git commit -m "feat: description courte"
git push origin feat/sprint-XX-nom

# Valider un sprint
git checkout develop
git merge --no-ff feat/sprint-XX-nom -m "merge: sprint XX — description"
git push origin develop
git branch -d feat/sprint-XX-nom
git push origin --delete feat/sprint-XX-nom

# Mise en production
git checkout main
git merge --no-ff develop -m "release: vX.Y.Z — description"
git tag -a vX.Y.Z -m "Version X.Y.Z — description"
git push origin main && git push origin --tags
git checkout develop
```

---

_Plan d'action rédigé dans le cadre du projet SiMiLire — MiCetF._
_Frédéric MISERY — micetf.fr_
