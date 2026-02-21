# Changelog — SiMiLire

Toutes les modifications notables de ce projet sont documentées dans ce fichier.  
Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).  
Ce projet respecte le [Versionnage Sémantique](https://semver.org/lang/fr/).

---

## [1.7.0] - Sprint F : Corpus personnalisable

### Ajouté

- `src/constants.js` — `NB_ITEMS_MAX_CORPUS_CUSTOM`, `NB_CORPUS_CUSTOM_MAX`,
  `NOM_CORPUS_MAX_CHARS`, `CLES_STORAGE.CORPUS_CUSTOM`
- `src/utils/storage.js` — `loadCorpusCustomFromStorage`, `saveCorpusCustomToStorage`
- `src/hooks/useCorpusCustom.js` — CRUD corpus custom avec validation complète ;
  distracteurs auto-calculés (tous les autres items du corpus) ;
  guard défensif `TYPES_UNITE.includes(typeUnite)` dans `creerCorpus`
- `src/components/corpus/ItemForm.jsx` — formulaire d'ajout d'item avec validation
  temps réel (doublon, vide, limite atteinte)
- `src/components/corpus/CorpusEditor.jsx` — modale 3 vues (liste / nouveau / éditer) ;
  bouton "Utiliser" / "Désactiver" par corpus ; confirmation avant suppression ;
  avertissement si items < nbPropositions ; compteur N/15 corpus

### Modifié

- `src/hooks/useConfig.js` — champ `idCorpusCustom` (session, non persisté) + setter
  `setIdCorpusCustom` ; action atomique `activerCorpusCustom` (met à jour `typeUnite`
  ET `idCorpusCustom` en un seul `setConfig` — évite les stale closures)
- `src/hooks/useGameEngine.js` — paramètre `corpusActif` ; `itemsDisponibles` utilise
  le corpus custom si actif ; `idCorpusCustom` ajouté aux dépendances du reset effect
- `src/hooks/useBrevet.js` — `DonneesBrevet` : champs `sourceCorpus` et
  `nomCorpusCustom` ; libellé brevet adapté ("a relevé le défi «…»") pour corpus custom
- `src/components/brevet/BrevetModal.jsx` — props `sourceCorpus` et `nomCorpusCustom`
  transmises à `genererBrevet`
- `src/components/config/ConfigPanel.jsx` — sélecteur `<select>` corpus custom
  (masqué si liste vide) ; boutons de type désactivés quand corpus custom actif ;
  badge ✦ sous les boutons de type ; `onActiverCorpusCustom` en prop
- `src/components/layout/Navbar.jsx` — bouton "Mes corpus" (desktop + mobile),
  masqué si verrouillé
- `src/App.jsx` — câblage complet `useCorpusCustom`, `corpusCustomActif`,
  `CorpusEditor`, `handleActiverCorpusCustom` via `activerCorpusCustom` atomique ;
  props `sourceCorpus` et `nomCorpusCustom` passées à `BrevetModal`

### Règles métier

- Type d'unité fixé à la création du corpus, non modifiable
- Distracteurs automatiques = tous les autres items du corpus
- Limite : 15 corpus × 50 items max
- Brevet activé sur corpus custom avec libellé différencié
  ("a relevé le défi «…»" vs "est capable de retrouver…")
- Bilan et mode focus APC fonctionnels sur corpus custom
- `idCorpusCustom` non persisté — corpus réactivé manuellement après rechargement

## [1.6.0] - 2026-02-21 — Sprint E : Mode focus APC + correctifs UX

### Ajouté

- `src/constants.js` — constantes `SEUIL_ERREUR_FOCUS`, `SEUIL_TENTATIVES_MIN_FOCUS`,
  `TAILLE_MIN_CORPUS_FOCUS`, `TAILLE_MAX_CORPUS_FOCUS`
- `src/hooks/useConfig.js` — champ `modeFocus` (état session, non persisté) + setter `setModeFocus`
- `src/hooks/useGameEngine.js` — paramètre `bilanBrut`, fonction pure `calculerCorpusFocus`,
  corpus dynamique `corpusFocus` (useMemo), `useEffect` de reset sur changement de mode,
  brevet désactivé en mode focus
- `src/hooks/useBilan.js` — exposition de `bilanBrut` (alias données brutes)
- `src/components/bilan/BilanPanel.jsx` — bouton « Travailler les points durs »
- `src/components/config/ConfigPanel.jsx` — badge 🎯 Mode focus + bouton Désactiver
  (masqué en mode verrouillé)

### Modifié

- `src/utils/storage.js` — `modeFocus` exclu de la persistance (`saveConfigToStorage`
  destructure explicitement les 4 champs persistés)
- `src/App.jsx` — câblage complet mode focus (`handleTravaillerPointsDurs`,
  `handleDesactiverFocus`) ; fix brevet : ouverture modale via `useEffect` déclaratif
  sur `brevetDisponible` (suppression stale closure dans setTimeout) ;
  ajout `handleOuvrirBrevet` pour rouvrir la modale depuis `ProgressIndicator`
- `src/components/progress/ProgressIndicator.jsx` — repositionné dans le flux normal
  (suppression `fixed bottom-4 left-4`) ; barre horizontale pleine largeur entre
  `NavbarSpacer` et `ConfigPanel` ; point thermique remplacé par `LabelFluidite`
  (⚡/⏱/🐢 + valeur en items/min) ; ajout `BadgeBrevet` cliquable (rouvre la modale
  si fermée sans action) ; icône 🎯 mode focus intégrée
- `src/components/config/ConfigPanel.jsx` — libellés fluidité en items/min
  (7/10/20 selon typeUnite) ; ordre des contrôles révisé selon logique pédagogique →
  opérationnelle (Type d'unité → Nb propositions → Police → Fluidité → TNI →
  [Mode focus] → Verrouillage) ; composant `Separateur` extrait
- `src/hooks/useBrevet.js` — mention fluidité sur le brevet en items/min
  (cohérence avec `ProgressIndicator` et `ConfigPanel`)
- `src/data/aide.js` — section "Bilan" ajoutée ; section "Configurer" complétée
  avec entrée "Mode focus APC" ; descriptions fluidité mises à jour (items/min,
  indicateur barre en haut) ; icône section fluidité mise à jour (⏱️ → ⚡)

### Règles métier

- Corpus focus : items avec ≥ 1 tentative ET taux d'erreur > 30%, 4-8 items
  (complété si insuffisant), recalculé dynamiquement à chaque mise à jour du bilan
- Distracteurs toujours issus du corpus complet (garantit nbPropositions)
- Brevet désactivé en mode focus (corpus biaisé invalide l'évaluation sommative)
- Désactivation mode focus sans reset score/bilan — continuité totale

### Fix

- Brevet ne se déclenchait pas : stale closure sur `brevetDisponible` dans `setTimeout` —
  remplacé par `useEffect` déclaratif sur `brevetDisponible`
- Brevet perdu si modale fermée sans action : badge 🎓 persistant dans `ProgressIndicator`
  permet de rouvrir la modale tant que `brevetDisponible === true`

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
