# Changelog — SiMiLire

Toutes les modifications notables de ce projet sont documentées dans ce fichier.  
Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).  
Ce projet respecte le [Versionnage Sémantique](https://semver.org/lang/fr/).

---

## [1.5.0] - 2026-02-20 — Sprint D : Tableau de bord enseignant

### Ajouté

- `src/hooks/useBilan.js` — collecte et persistance du bilan par item
  (tentatives + erreurs, localStorage, réinitialisable manuellement)
- `src/components/bilan/BilanPanel.jsx` — panneau bilan enseignant :
  synthèse globale, top 5 items difficiles avec barres de taux d'erreur

### Modifié

- `src/constants.js` — clé `CLES_STORAGE.BILAN`
- `src/utils/storage.js` — fonctions `loadBilanFromStorage` et `saveBilanToStorage`
- `src/hooks/useGameEngine.js` — callback `onNouveauTour` dans `allerTourSuivant`
  et `recommencer`, sliding window `.slice(-SEUIL_BREVET)` pour le critère brevet
- `src/components/config/ConfigPanel.jsx` — labels fluidité en secondes totales
  (30s / 60s / 90s au lieu de 3s / 6s / 9s)
- `src/components/layout/Navbar.jsx` — bouton Bilan (masqué si verrouillé)
- `src/App.jsx` — intégration complète useBilan, enregistrement tentatives
  via callbacks, enregistrement erreurs sur clic incorrect
- `src/data/aide.js` — correction descriptions seuil fluidité et critère brevet

### Règles métier

- 1 tentative = 1 tour présenté (enregistrée à l'affichage, pas à la réussite)
- 1 erreur = 1 clic incorrect (peut dépasser le nombre de tentatives)
- Bilan conservé après brevet — réinitialisable uniquement via BilanPanel
- Critère brevet : fiabilité (10 réussites consécutives) ET fluidité
  (moyenne glissante des 10 derniers temps ≤ seuil)

## [1.4.0] - 2026-02-20 — Sprint HelpModal : Aide pédagogique

### Ajouté

- `src/data/aide.js` — source de vérité du contenu d'aide, structurée
  en sections (Jouer, Configurer, Fluidité) pilotant le composant
- `src/components/help/HelpModal.jsx` — modale d'aide générique à onglets,
  contenu entièrement piloté par aide.js
- `src/utils/storage.js` — fonctions `hasAideVue()` et `markAideVue()`
- `src/constants.js` — clé `CLES_STORAGE.AIDE_VUE`

### Modifié

- `src/components/layout/Navbar.jsx` — ajout bouton `?` (desktop + mobile)
- `src/App.jsx` — gestion `modalAideVisible`, affichage automatique
  à la première visite via flag localStorage

## [1.3.0] - 2026-02-20 — Sprint C : Mesure de fluidité

### Ajouté

- `src/constants.js` — constantes `DELAIS_FLUIDITE` et `DELAI_MAX_FLUIDITE_DEFAUT`
- `src/hooks/useGameEngine.js` — mesure du temps par réponse correcte,
  calcul du temps moyen, exposition de `demarrerChrono()` et `tempsMoyen`
- `src/hooks/useConfig.js` — champ `delaiMaxFluidite` + setter `setDelaiMaxFluidite`
- `src/components/config/ConfigPanel.jsx` — sélecteur seuil de fluidité (3s / 6s / 9s)
- `src/components/progress/ProgressIndicator.jsx` — point thermique de fluidité
  (vert / orange / rouge / gris) sur les 3 modes d'indicateur
- `src/components/brevet/BrevetModal.jsx` — affichage du temps moyen sur le brevet

### Modifié

- `src/utils/storage.js` — persistance du champ `delaiMaxFluidite`
- `src/App.jsx` — branchement de `demarrerChrono()` après le délai d'animation,
  passage de `tempsMoyen` et `delaiMaxFluidite` aux composants concernés

### Critère de brevet mis à jour

- Fiabilité (10 réussites consécutives) **ET** fluidité (temps moyen ≤ seuil)

## [1.2.0] - 2026-02-20 — Sprint B : Accessibilité daltonisme

### Ajouté

- `lucide-react` — bibliothèque d'icônes SVG (dépendance de production)
- `src/components/game/EtiquetteCard.jsx` — badges icônes multicanal :
  ✓ (succès), ✗ (erreur), → (guidage au 2e échec), tous en `aria-hidden="true"`
- `src/components/game/FeedbackMessage.jsx` — icône ✗ devant le message d'erreur

## [1.1.0] - 2026-02-20 — Sprint A : Police d'apprentissage

### Ajouté

- `src/constants.js` — constantes `POLICES_DISPONIBLES` et `POLICE_DEFAUT`
- `src/utils/storage.js` — persistance du champ `police` dans localStorage
- `src/hooks/useConfig.js` — champ `police` + setter `setPolice`
- `src/components/config/ConfigPanel.jsx` — sélecteur de police Aa
- `index.html` + `src/index.css` — chargement des polices Andika, Atkinson Hyperlegible, OpenDyslexic
- `src/App.jsx` — application de la police via CSS custom property `--font-jeu`

## [1.0.1] - 2026-02-20 — Fix corpus

### Corrigé

- `src/data/lettres.js` — 26 lettres scriptes minuscules, distracteurs
  qualifiés par famille de confusion (b/d/p/q, n/u/m/w, i/l/j/t,
  rondes, fourches, angulaires)
- `src/data/syllabes.js` — 50 syllabes, familles de confusion couvertes
  (attaque b/d/p, nasales, miroirs, voyelles composées, graphèmes complexes)
- `src/data/mots.js` — liste de fréquence CP→CM2, familles de confusion
  (miroirs, rimes, mots outils, morphologie proche)
- Auto-distracteurs corrigés : oin (syllabes), dont (mots)

## [1.0.0] - 2026-02-20 — Sprint 9 : Déploiement production

### Déployé

- Production : https://micetf.fr/similire/
- Déploiement via FileZilla (FTP) sur hébergement OVH
- Build Vite avec base `/similire/` — chemins assets corrects
- localStorage opérationnel en production
- Brevet PNG téléchargeable — validé desktop et mobile
- Navbar MiCetF — liens et boutons fonctionnels en production

## [0.9.1] - 2026-02-20 — Fix UI étiquettes

### Corrigé

- `EtiquetteCard` — taille de police adaptative selon longueur du contenu
  (text-4xl → text-xl, plus min-w proportionnel) — plus de débordement
- `ModelZone` — même logique d'adaptation, taille minimale de boîte
  via min-w/min-h plutôt que w/h fixes
- `ProposalGrid` — remplacement grid par flex-wrap justify-center :
  centrage correct des rangées incomplètes (5→3+2, 7→4+3)

## [0.9.0] - 2026-02-20 — Sprint 8 : Layout et intégration MiCetF

### Ajouté

- `src/components/layout/Navbar.jsx` — navbar fixe MiCetF convertie depuis
  Lecture Flash (logo, titre SiMiLire, don PayPal, contact, menu mobile)
- `src/components/layout/NavbarSpacer.jsx` — espaceur h-14 compensant
  la navbar fixe

### Modifié

- `src/App.jsx` — intégration Navbar + NavbarSpacer, conteneur principal
  en balise <main> sémantique

## [0.8.0] - 2026-02-20 — Sprint 7 : Progression et brevet

### Ajouté

- `src/components/progress/ProgressIndicator.jsx` — indicateur de progression
  adaptatif selon le type d'unité :
    - lettre → étoiles (GS/CP)
    - syllabe → barre de progression (CP/CE1)
    - mot → score numérique série + total (CE1/CE2)
- `src/hooks/useBrevet.js` — génération Canvas du brevet PNG
- `src/components/brevet/BrevetModal.jsx` — modale brevet avec aperçu temps réel,
  champ prénom, téléchargement PNG et recommencement

### Modifié

- `src/App.jsx` — intégration ProgressIndicator et BrevetModal,
  gestion de l'état modalBrevetVisible

## [0.7.0] - 2026-02-20 — Sprint 6 : Panneau de configuration

### Ajouté

- `src/components/config/ConfigPanel.jsx` — panneau de configuration enseignant
    - Sélecteur de type d'unité (Lettre / Syllabe / Mot)
    - Compteur de propositions avec bornes min/max désactivant les boutons
    - Bouton mode TNI avec indicateur visuel
    - Bouton verrouillage — masque le panneau, seul le cadenas reste visible
    - Accessibilité : aria-pressed, aria-label, role="group"

### Modifié

- `src/App.jsx` — intégration de ConfigPanel, suppression de la config inline

## [0.6.0] - 2026-02-20 — Sprint 5 : Composants de jeu

### Ajouté

- `src/components/game/EtiquetteCard.jsx` — étiquette cliquable avec états visuels
  (attente, succès vert, erreur orange + animation shake, guidage jaune au 2e échec)
- `src/components/game/ProposalGrid.jsx` — grille responsive des propositions
- `src/components/game/ModelZone.jsx` — zone d'affichage du modèle
- `src/components/game/FeedbackMessage.jsx` — message d'erreur + bouton Réessayer

### Modifié

- `src/App.jsx` — intégration des composants de jeu, gestion de idClique

## [0.5.0] - 2026-02-20 — Sprint 4 : Hook useGameEngine

### Ajouté

- `src/hooks/useGameEngine.js` — moteur de jeu complet
    - Génération des tours avec distracteurs qualifiés
    - Traitement des réponses correctes et incorrectes
    - Répétition espacée implicite (items échoués réinsérés en priorité)
    - Détection du seuil brevet (SEUIL_BREVET réussites consécutives)
    - Réinitialisation au changement de config via useEffect

### Modifié

- `src/data/mots.js` — correction des doublons d'id et des auto-distracteurs
- `src/data/index.js` — validation permanente du corpus (doublons + auto-distracteurs)
  préparant l'ouverture à la personnalisation enseignant

### Corrigé

- Score et statut remis à zéro au changement de type ou de nombre de propositions

## [0.4.0] - 2026-02-20 — Sprint 3 : Hook useConfig

### Ajouté

- `src/hooks/useConfig.js` — gestion de la configuration enseignant
    - Initialisation lazy depuis localStorage (sans useEffect)
    - Persistance de typeUnite et nbPropositions via storage.js
    - Bornes min/max appliquées sur nbPropositions via constants.js
    - modeTni et verrouille : états de session uniquement (non persistés)

## [0.3.0] - 2026-02-19 — Sprint 2 : Utilitaires

### Ajouté

- `src/utils/random.js` — fonctions aléatoires pures (Fisher-Yates, tirage, insertion)
- `src/utils/storage.js` — lecture/écriture localStorage avec valeurs par défaut et gestion d'erreur
- `src/utils/canvas.js` — primitives de rendu Canvas et téléchargement PNG

### Modifié

- `eslint.config.js` — ajout des globals navigateur (`globals.browser`)

### Dépendances

- `globals` ajouté en devDependency

## [0.2.0] - 2026-02-19 — Sprint 1 : Constantes et données

### Ajouté

- `src/constants.js` — toutes les constantes partagées de l'application
- `src/data/lettres.js` — corpus de 25 lettres avec distracteurs qualifiés
- `src/data/syllabes.js` — corpus de 32 syllabes avec distracteurs qualifiés
- `src/data/mots.js` — corpus de 30 mots avec distracteurs qualifiés
- `src/data/index.js` — point d'entrée du corpus indexé par type d'unité

## [0.1.0] - 2026-02-19 — Sprint 0 : Initialisation

### Ajouté

- Scaffolding Vite + React 18.2 (template JavaScript)
- Configuration Tailwind CSS v3 avec animation `shake` et tailles TNI
- Configuration ESLint 9 (flat config) avec règles zéro warning
- Configuration Prettier
- Aliases Vite : `@`, `@data`, `@hooks`, `@utils`, `@constants`
- `App.jsx` et `main.jsx` minimaux de validation
- Workflow git : branches `main` et `develop`, dépôt GitHub `micetf/similire`
- Fichiers de documentation : spécifications fonctionnelles, techniques, plan d'action
