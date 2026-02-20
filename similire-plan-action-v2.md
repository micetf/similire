# SiMiLire v2 — Plan d'action pédagogique

**Version actuelle :** v1.0.1 en production  
**Objectif :** Renforcer la valeur didactique et élargir les usages en classe  
**Principe de priorisation :** Impact pédagogique / Coût de développement

---

## Grille de priorisation

| Sprint | Titre                      | Impact pédagogique | Coût dev | Priorité |
| ------ | -------------------------- | ------------------ | -------- | -------- |
| A      | Police d'apprentissage     | ★★★★★              | Faible   | 🔴 P1    |
| B      | Accessibilité daltonisme   | ★★★★☆              | Faible   | 🔴 P1    |
| C      | Mesure de fluidité         | ★★★★★              | Moyen    | 🟠 P2    |
| D      | Tableau de bord enseignant | ★★★★☆              | Moyen    | 🟠 P2    |
| E      | Mode focus APC             | ★★★★★              | Moyen    | 🟠 P2    |
| F      | Corpus personnalisable     | ★★★★★              | Élevé    | 🟡 P3    |
| G      | QR code config partageable | ★★★☆☆              | Faible   | 🟡 P3    |

---

## Sprint A — Police d'apprentissage 🔴 P1 ✅ TERMINÉ

**Objectif :** Aligner la police de l'outil avec celle utilisée en classe  
**Durée estimée :** 1 session  
**Branche :** `feat/sprint-A-police`

### Contexte didactique

La discrimination visuelle n'a de sens que si la forme des lettres correspond
à ce que l'élève rencontre dans son manuel. Les polices d'apprentissage varient
selon les méthodes : scripte, cursive, sans-serif, OpenDyslexic.

### Fichiers à créer / modifier

```
src/constants.js          ← ajout POLICES_DISPONIBLES
src/hooks/useConfig.js    ← ajout police dans config (persistée)
src/components/config/ConfigPanel.jsx  ← sélecteur de police
src/index.css             ← chargement des polices via @font-face ou CDN
src/App.jsx               ← application de la police au conteneur principal
```

### Polices cibles

| Id             | Nom affiché      | Cible pédagogique            |
| -------------- | ---------------- | ---------------------------- |
| `systeme`      | Système (défaut) | Neutre                       |
| `andika`       | Andika           | Dyslexie / inclusion         |
| `opendyslexic` | OpenDyslexic     | Dyslexie sévère              |
| `cursive`      | Cursive scolaire | Classes utilisant la cursive |

### Points d'attention

- Les polices sont chargées via Google Fonts ou CDN (pas de fichiers locaux)
- Le choix de police est persisté dans `localStorage` avec la config
- La police s'applique à `ModelZone` ET à `EtiquetteCard` — cohérence essentielle

---

## Sprint B — Accessibilité daltonisme 🔴 P1 ✅ TERMINÉ

**Objectif :** Rendre les feedbacks perceptibles sans distinction des couleurs  
**Durée estimée :** 1 session  
**Branche :** `feat/sprint-B-accessibilite`

### Contexte didactique

~8% des garçons sont atteints de daltonisme rouge-vert (deutéranopie).
Les feedbacks actuels (vert succès / orange erreur) sont non discernables
pour ces élèves. L'outil doit fonctionner sans la couleur comme seul vecteur.

### Solution retenue

Complément icône + forme en plus de la couleur — pas de remplacement :

- Succès : ✓ visible sur l'étiquette + bordure verte (inchangée)
- Erreur : ✗ visible sur l'étiquette cliquée + animation shake (inchangée)
- Guidage : → flèche discrète sur la bonne réponse au 2e échec

### Fichiers à modifier

```
src/components/game/EtiquetteCard.jsx  ← ajout icônes conditionnelles
src/components/game/FeedbackMessage.jsx ← icône sur le message
```

### Points d'attention

- Les icônes sont en `aria-hidden="true"` — elles sont redondantes avec
  l'aria-label déjà présent, pas une nouvelle source d'information ARIA
- Taille des icônes proportionnelle au mode TNI

---

## Sprint C — Mesure de fluidité 🟠 P2 ✅ TERMINÉ

**Objectif :** Mesurer la vitesse de réponse et l'intégrer au critère de brevet  
**Durée estimée :** 2 sessions  
**Branche :** `feat/sprint-C-fluidite`

### Contexte didactique

La recherche (Dehaene, Sprenger-Charolles) montre que la fluence de décodage
est le prédicteur le plus fiable de la compréhension en lecture. Répondre
correctement est nécessaire mais insuffisant — la rapidité est l'indicateur
de l'automatisation. Le brevet actuel mesure la fiabilité (10 réussites
consécutives), pas la fluidité.

### Nouveau critère de brevet

Combinaison des deux conditions (ET) :

1. 10 réussites consécutives (fiabilité — existant)
2. Temps moyen par réponse ≤ seuil configurable (fluidité — nouveau)

Seuil par défaut : 6 secondes (repris de l'application originale)  
Seuil configurable par l'enseignant dans le `ConfigPanel`

### Données mesurées

- `tempsParReponse[]` : tableau des durées (ms) pour les réponses correctes
- `tempsMoyen` : moyenne glissante (ignorée pour les erreurs)
- `delaiMaxMs` : constante configurable (DELAI_MAX_FLUIDITE_MS)

### Indicateur visuel discret

Barre de progression existante (`syllabe`) enrichie d'une couleur thermique :

- Vert → sous le seuil (fluidité atteinte)
- Orange → proche du seuil (±20%)
- Rouge → au-dessus du seuil

L'élève ne voit pas de chronomètre — l'indicateur est une aide visuelle
non anxiogène.

### Fichiers à créer / modifier

```
src/constants.js                    ← DELAI_MAX_FLUIDITE_MS = 6000
src/hooks/useGameEngine.js          ← mesure du temps par réponse
src/hooks/useConfig.js              ← delaiMaxFluidite dans config
src/components/config/ConfigPanel.jsx  ← sélecteur seuil de vitesse
src/components/progress/ProgressIndicator.jsx  ← indicateur thermique
src/components/brevet/BrevetModal.jsx  ← affichage temps moyen sur brevet
```

---

## Sprint HelpModal — Aide pédagogique 🔴 P1 ✅ TERMINÉ

**Objectif :** Documenter l'outil pour l'enseignant, extensible à chaque sprint  
**Branche :** `feat/sprint-helpmodal`

### Fichiers produits / modifiés

```
src/data/aide.js                       ← NOUVEAU
src/components/help/HelpModal.jsx      ← NOUVEAU
src/components/layout/Navbar.jsx       ← bouton ?
src/utils/storage.js                   ← hasAideVue / markAideVue
src/constants.js                       ← CLES_STORAGE.AIDE_VUE
src/App.jsx                            ← gestion état + première visite
```

## Sprint D — Tableau de bord enseignant 🟠 P2 ✅ TERMINÉ

**Objectif :** Donner à l'enseignant une vision des items difficiles  
**Durée estimée :** 2 sessions  
**Branche :** `feat/sprint-D-bilan`

### Contexte didactique

Sans retour sur les erreurs, l'enseignant ne peut pas adapter sa séquence
d'enseignement. Le tableau de bord permet d'identifier les confusions
récurrentes et d'orienter les séances suivantes (APC, remédiation).

### Données collectées (session uniquement, localStorage)

| Donnée                 | Type     | Usage                  |
| ---------------------- | -------- | ---------------------- |
| `tentatives[itemId]`   | number   | Fréquence de passage   |
| `erreurs[itemId]`      | number   | Taux d'erreur par item |
| `tempsParItem[itemId]` | number[] | Temps moyen par item   |

### Accès au tableau de bord

Bouton discret dans la `Navbar` (icône graphique, texte "Bilan" en desktop)
→ affiche un overlay `BilanPanel` par-dessus le jeu
→ accessible uniquement quand `verrouille = false`

### Contenu du BilanPanel

1. **Items les plus échoués** (top 5) — avec taux d'erreur
2. **Items les plus lents** (top 5) — avec temps moyen
3. **Bouton "Réinitialiser le bilan"** — remet les compteurs à zéro

### Fichiers à créer / modifier

```
src/hooks/useBilan.js                     ← NOUVEAU — collecte et persistance
src/hooks/useGameEngine.js                ← alimentation de useBilan
src/components/bilan/BilanPanel.jsx       ← NOUVEAU — overlay bilan
src/components/layout/Navbar.jsx          ← bouton Bilan
```

### Points d'attention

- Les données sont anonymes — aucun prénom stocké dans le bilan
- `localStorage` uniquement — aucun serveur
- Le bilan est réinitialisé en même temps que `recommencer()`

---

## Sprint E — Mode focus APC 🟠 P2

**Objectif :** Proposer un corpus ciblé sur les items échoués  
**Durée estimée :** 1 session  
**Branche :** `feat/sprint-E-mode-focus`

### Contexte didactique

En APC (Aide Pédagogique Complémentaire) ou en atelier de remédiation,
l'enseignant cible les difficultés spécifiques de l'élève. Le mode focus
extrait les items les plus échoués du bilan pour construire un corpus réduit
et ciblé — principe de répétition espacée explicite.

### Fonctionnement

1. Le `BilanPanel` (Sprint D) affiche un bouton "Travailler les points durs"
2. Ce bouton active le `modeFocus` dans `useConfig`
3. En `modeFocus`, `useGameEngine` pioche uniquement dans les items
   dont le taux d'erreur dépasse un seuil (configurable, défaut : 30%)
4. Si moins de 4 items éligibles, compléter avec les items les plus lents
5. Un badge "Mode focus" visible dans le `ConfigPanel` signale le mode actif

### Fichiers à modifier

```
src/constants.js                    ← SEUIL_ERREUR_FOCUS = 0.3
src/hooks/useConfig.js              ← modeFocus dans config
src/hooks/useGameEngine.js          ← filtrage corpus en modeFocus
src/components/config/ConfigPanel.jsx  ← badge mode focus + bouton désactiver
src/components/bilan/BilanPanel.jsx    ← bouton "Travailler les points durs"
```

---

## Sprint F — Corpus personnalisable 🟡 P3

**Objectif :** Permettre à l'enseignant de saisir ses propres items  
**Durée estimée :** 3 sessions  
**Branche :** `feat/sprint-F-corpus-custom`

### Contexte didactique

La valeur ajoutée maximale : ancrer l'outil dans la progression de la classe.
L'enseignant utilise les mots de la semaine, les syllabes de sa méthode,
les lettres en cours d'apprentissage. L'outil s'adapte à la pédagogie
et non l'inverse.

### Architecture

La validation du corpus (déjà active en production dans `data/index.js`)
s'applique aussi aux corpus personnalisés — protection contre les erreurs
de saisie.

### Fonctionnement

1. Bouton "Mes corpus" dans la Navbar
2. Interface `CorpusEditor` :
    - Sélection du type (lettre / syllabe / mot)
    - Saisie des items (valeur + distracteurs)
    - Validation en temps réel (doublon, auto-distracteur)
    - Sauvegarde dans `localStorage`
3. Les corpus personnalisés apparaissent dans le `ConfigPanel`
   avec un badge distinctif (étoile ou crayon)

### Fichiers à créer / modifier

```
src/hooks/useCorpusCustom.js              ← NOUVEAU — CRUD corpus custom
src/components/corpus/CorpusEditor.jsx    ← NOUVEAU — interface de saisie
src/components/corpus/ItemForm.jsx        ← NOUVEAU — formulaire item
src/data/index.js                         ← fusion corpus natifs + custom
src/components/config/ConfigPanel.jsx     ← sélecteur corpus custom
src/components/layout/Navbar.jsx          ← bouton Mes corpus
```

### Points d'attention

- La validation de `data/index.js` s'applique à tous les corpus
- Export / Import JSON pour partage entre enseignants (Sprint G)
- Limite : 50 items max par corpus custom (performance)

---

## Sprint G — QR code et partage de configuration 🟡 P3

**Objectif :** Faciliter le partage d'une configuration entre enseignants  
**Durée estimée :** 1 session  
**Branche :** `feat/sprint-G-partage`

### Contexte didactique

Un enseignant prépare une config (type, nombre, police, corpus custom)
et souhaite la partager avec un collègue ou la proposer aux familles
pour un travail à la maison. Le QR code encode la config dans l'URL
(paramètres GET) — aucun serveur, aucune donnée personnelle.

### Fonctionnement

1. Bouton "Partager cette config" dans le `ConfigPanel`
2. Génération d'une URL avec params : `?type=syllabe&nb=4&police=andika`
3. Affichage d'un QR code (bibliothèque `qrcode.js` légère)
4. Au chargement, `useConfig` lit les paramètres GET et initialise la config

### Fichiers à créer / modifier

```
src/hooks/useConfig.js                    ← lecture params GET à l'init
src/components/config/SharePanel.jsx      ← NOUVEAU — QR code + URL copiable
src/components/config/ConfigPanel.jsx     ← bouton Partager
```

---

## Dépendances entre sprints

```
A (Police)  ─┐
B (A11y)    ─┤─→ peuvent être développés en parallèle
             │
C (Fluidité)─┐
             ├─→ D (Bilan) dépend de C (données temps)
D (Bilan)   ─┤
             └─→ E (Focus APC) dépend de D (données erreurs)

F (Custom)  ─→ G (Partage) dépend de F (corpus custom dans URL)
```

---

## Jalons suggérés

| Jalon | Sprints | Version cible    | Description                                 |
| ----- | ------- | ---------------- | ------------------------------------------- |
| v1.1  | A + B   | Accessibilité    | Police + daltonisme — déployable rapidement |
| v1.2  | C + D   | Mesure           | Fluidité + bilan enseignant                 |
| v1.3  | E       | Remédiation      | Mode focus APC                              |
| v2.0  | F + G   | Personnalisation | Corpus custom + partage                     |

---

_Document généré le 2026-02-20_  
_Basé sur l'analyse didactique SiMiLire v1.0.1_
