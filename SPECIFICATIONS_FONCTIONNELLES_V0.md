# Spécifications Fonctionnelles — SiMiLire

**Application :** `micetf.fr/similire/`
**Nom affiché :** SiMiLire
**Sous-titre interface :** *Retrouve l'étiquette identique*
**Ancienne URL :** `micetf.fr/discrimination/` *(redirection 301 à prévoir)*
**Domaine pédagogique :** Français — Lecture (Cycle 1 / Cycle 2)
**Date de rédaction :** 19 février 2026
**Statut :** Spécifications validées — prêtes pour développement

---

## 0. Identité de l'application

### 0.1 Choix du nom

**SiMiLire** est un jeu de mots activant simultanément deux registres :

- **Similaire** — la tâche cognitive centrale : identifier une étiquette identique à un modèle
- **Lire** — la compétence visée : automatiser la reconnaissance des formes graphiques pour lire plus vite et plus efficacement

| Public | Lecture naturelle du nom | Effet attendu |
|---|---|---|
| **Élève** | *« SiMiLire »* — nom court, rythmé, mémorable à l'oral | Mémorisation facile, identification immédiate de l'application |
| **Enseignant** | *Similaire + Lire* — référence didactique transparente | Compréhension immédiate de la compétence travaillée |

### 0.2 Identité visuelle associée

- **Logotype recommandé :** `Si` `Mi` `Lire` avec les deux premières syllabes en couleur distincte pour faire apparaître visuellement le mot *similaire*
- **Couleur principale :** bleu (`blue-600`) — cohérence avec la charte MiCetF, neutralité visuelle (ne pas interférer avec les feedbacks orange/vert)
- **Icône :** deux étiquettes côte à côte dont l'une est entourée — évoque la tâche de comparaison

### 0.3 Redirections et références

- L'ancienne URL `micetf.fr/discrimination/` doit faire l'objet d'une **redirection HTTP 301** vers `micetf.fr/similire/`
- Les références dans `micetf-data` (`applications.js`) sont à mettre à jour :

```js
// Avant
{
  id: "discrimination",
  title: "Discrimination visuelle",
  url: "discrimination",
  ...
}

// Après
{
  id: "similire",
  title: "SiMiLire",
  url: "similire",
  description: "Jeu interactif permettant d'exercer sa discrimination visuelle pour améliorer sa vitesse de lecture. Retrouve l'étiquette identique parmi des distracteurs visuellement proches : lettres, syllabes ou mots.",
  thumbnail: "similire.png",
  keywords: ["discrimination visuelle", "lecture", "français", "similaire", "syllabes", "lettres", "mots"]
}
```

---

## 1. Ancrage didactique et pédagogique

### 1.1 Place dans les apprentissages

La discrimination visuelle est une **compétence fondatrice du décodage**. Elle précède et accompagne l'automatisation de la reconnaissance des formes graphiques — étape indispensable à la construction d'une lecture fluide et efficace.

Elle s'inscrit dans la progression suivante :

```
Discrimination visuelle  ← SiMiLire intervient ici
        ↓
Correspondance graphème-phonème
        ↓
Décodage (voie phonologique)
        ↓
Reconnaissance orthographique (voie lexicale)
        ↓
Lecture fluente
```

Elle répond directement aux **programmes 2023** (cycle 1 et cycle 2) :
*« Identifier des lettres et des mots, distinguer des formes proches »*,
et s'articule avec les préconisations de la **note de service du 26 janvier 2023** sur l'enseignement de la lecture par la méthode syllabique.

### 1.2 Compétences travaillées par type d'unité

| Type | Compétence ciblée | Période d'usage privilégiée |
|---|---|---|
| **Lettre** | Identifier une lettre parmi des graphèmes visuellement proches | GS fin d'année — CP début |
| **Syllabe** | Reconnaître une unité syllabique dans un ensemble de syllabes distractrices | CP milieu/fin — CE1 |
| **Mot** | Discriminer un mot dans une série de mots à morphologie similaire | CE1 — CE2 |

### 1.3 Qualité didactique des distracteurs

La pertinence pédagogique de SiMiLire repose sur la **qualité des distracteurs**. Un distracteur aléatoire n'a aucune valeur didactique. Les distracteurs doivent exploiter les **confusions graphiques attestées** dans la littérature en didactique de la lecture.

> **Implication technique :** Le corpus de distracteurs ne doit pas être pioché aléatoirement dans l'ensemble du corpus, mais dans un **sous-ensemble de distracteurs qualifiés** associé à chaque item.

#### Confusions à cibler pour les lettres

| Famille de confusion | Lettres concernées | Mécanisme |
|---|---|---|
| Symétrie axiale verticale | `b / d`, `p / q` | Inversion gauche/droite |
| Symétrie axiale horizontale | `b / p`, `d / q`, `n / u`, `m / w` | Inversion haut/bas |
| Similarité morphologique | `i / l / 1`, `h / n`, `m / n`, `c / e / o` | Proximité de forme |
| Confusion scripte/cursive | `a` scripte vs `a` cursive | Double forme du même graphème |

#### Confusions à cibler pour les syllabes

| Exemples de paires | Mécanisme |
|---|---|
| `on / an / en / in` | Syllabes nasales — confusion phonético-visuelle |
| `ba / da / pa / qa` | Lettres à symétrie + voyelle identique |
| `ou / on / au` | Syllabes fermées visuellement proches |

#### Confusions à cibler pour les mots

| Exemples de paires | Mécanisme |
|---|---|
| `son / nos`, `les / sel` | Mots miroirs (inversion de l'ordre des lettres) |
| `main / nain / bain / pain` | Rimes orthographiques |
| `chat / chats` | Variantes morphologiques (pluriel, accents) |

### 1.4 Principes pédagogiques structurants

**Principe 1 — Charge cognitive minimale**
L'interface ne présente qu'une seule tâche à la fois : identifier l'étiquette identique au modèle. Toute information non directement utile à cette tâche est éliminée de l'écran actif.

**Principe 2 — Feedback immédiat et non culpabilisant**
Le feedback est rapide, orienté vers la progression, jamais vers la sanction. La couleur orange (et non rouge) marque l'erreur sans stigmatiser.

**Principe 3 — Répétition espacée implicite**
Les items ayant donné lieu à une erreur réapparaissent dans la session avec une fréquence légèrement supérieure aux items réussis, sans que ce mécanisme soit visible dans l'interface.

**Principe 4 — Progressivité maîtrisée par l'enseignant**
La difficulté est réglable sur deux axes indépendants : la nature des unités (lettre → syllabe → mot) et le nombre de distracteurs.

---

## 2. Spécifications fonctionnelles — Enseignant

### 2.1 Panneau de configuration

Le panneau de configuration reste **visible et accessible en permanence** en haut de l'interface, sans menu caché. L'enseignant ajuste les paramètres en direct, y compris pendant une séance sur TNI.

#### UC-E01 — Sélectionner le type d'unité

| Attribut | Valeur |
|---|---|
| **Interface** | Sélecteur à 3 boutons toggle : `Lettre` / `Syllabe` / `Mot` |
| **Valeur par défaut** | `Lettre` |
| **Comportement** | Bascule instantanée — le jeu s'adapte sans rechargement |
| **Indicateur visuel** | Le bouton actif est en `blue-600` texte blanc, les inactifs en `gray-200` |

#### UC-E02 — Régler le nombre de propositions

| Attribut | Valeur |
|---|---|
| **Interface** | Compteur avec boutons `−` et `+` + champ numérique éditable directement |
| **Valeur minimale** | 2 |
| **Valeur maximale** | 8 |
| **Valeur par défaut** | 4 |

| Valeur | Niveau | Usage recommandé |
|---|---|---|
| 2 | Différenciation / remédiation | Élèves en grande difficulté |
| 3–4 | Standard CP | Séance habituelle |
| 5–6 | Renforcement | Élèves autonomes ou CE1 |
| 7–8 | Expert | Défi / évaluation rapide |

#### UC-E03 — Activer le mode TNI

| Attribut | Valeur |
|---|---|
| **Interface** | Bouton toggle icône écran `🖥` dans le panneau enseignant |
| **Effet** | Toutes les tailles typographiques et zones cliquables sont doublées |
| **Usage** | Séance collective au tableau interactif ou vidéoprojecteur |

#### UC-E04 — Verrouiller la configuration

| Attribut | Valeur |
|---|---|
| **Interface** | Icône cadenas `🔒` dans le panneau enseignant |
| **Effet** | Le panneau de configuration est masqué — l'élève ne peut pas modifier les paramètres |
| **Déverrouillage** | Clic sur le cadenas (aucun mot de passe requis — usage en classe) |
| **Usage** | Poste en autonomie en atelier |

---

## 3. Spécifications fonctionnelles — Élève

### 3.1 Écran de jeu

#### UC-EL01 — Affichage du modèle

| Attribut | Valeur |
|---|---|
| **Label affiché** | *« Retrouve cette étiquette »* — sous-titre permanent de SiMiLire |
| **Zone visuelle** | Fond `blue-100`, bordure `blue-500`, nettement séparée de la zone de réponses |
| **Taille** | Étiquette modèle significativement plus grande que les propositions |
| **Police** | Forme scripte par défaut (standard école) |

#### UC-EL02 — Zone de propositions

| Attribut | Valeur |
|---|---|
| **Disposition** | Grille régulière (pas de liste linéaire) |
| **Taille minimale des zones cliquables** | 80×80px en mode standard — 160×160px en mode TNI |
| **Espacement** | Généreux entre les étiquettes (évite les erreurs de pointage) |
| **Feedback au survol** | Highlight au hover/focus avant validation |
| **Contenu** | 1 étiquette identique au modèle + N−1 distracteurs qualifiés |
| **Position correcte** | Aléatoire à chaque nouveau tour |

#### UC-EL03 — Feedback

**Bonne réponse :**

| Élément | Comportement |
|---|---|
| Visuel | Flash `green-200` → `green-500` sur l'étiquette correcte + animation brève |
| Sonore *(optionnel)* | Son court et positif |
| Textuel | Aucun — l'animation suffit |
| Suite | Passage automatique à un nouveau tour après 600ms |

**Mauvaise réponse (1er échec sur un item) :**

| Élément | Comportement |
|---|---|
| Visuel | Fond `orange-200` + légère animation `shake` sur l'étiquette cliquée |
| Sonore *(optionnel)* | Son neutre (pas d'échec dramatisé) |
| Textuel | *« Essaie encore ! »* en bas de l'écran |
| Bouton | `Réessayer →` |
| Suite | Même tour présenté à nouveau — **mêmes propositions, même ordre** |

> **Choix du orange vs rouge :** Le rouge est culturellement associé à l'interdit et l'échec dans le contexte scolaire français. L'orange indique l'alerte sans la sanction, en cohérence avec les pratiques d'évaluation positive encouragées par les textes officiels.

**Mauvaise réponse (2e échec sur le même item) :**

| Élément | Comportement |
|---|---|
| Guidage discret | L'étiquette correcte reçoit un halo lumineux `yellow-300` pendant 1 seconde puis s'estompe |
| Suite | L'élève peut cliquer librement — le guidage ne donne pas la réponse directement |

#### UC-EL04 — Indicateur de progression

Affiché en périphérie de l'écran (coin bas gauche), jamais au centre.

| Format | Déclencheur | Public cible |
|---|---|---|
| **Étoiles** `★ ★ ★ ☆ ☆` | 1 étoile tous les 5 succès | GS / CP |
| **Barre de progression** | Remplissage visuel continu | CP / CE1 |
| **Score numérique** `X / Y réussies` | Affiché en complément à partir de 10 réussites | CE1 / CE2 |

#### UC-EL05 — Répétition espacée implicite

| Règle | Description |
|---|---|
| **RF-REP-01** | Les items ayant provoqué une erreur sont réinsérés dans la file d'items à afficher |
| **RF-REP-02** | La fréquence de réapparition est légèrement supérieure aux items réussis |
| **RF-REP-03** | Ce mécanisme est **invisible dans l'interface** — l'élève ne le perçoit pas |

#### UC-EL06 — Brevet SiMiLire

Déclenché après un seuil de réussite (défaut : 10 bonnes réponses consécutives sans erreur).

**Contenu du brevet :**

| Champ | Valeur |
|---|---|
| Titre | *Brevet SiMiLire* |
| Sous-titre | *Discrimination visuelle* |
| Prénom | Saisi par l'élève dans un champ dédié (icône crayon pour guider) |
| Date | Date du jour générée automatiquement |
| Description | *« Je suis capable de retrouver rapidement une étiquette [TYPE] dans une série de [N] étiquettes. »* |
| Source | Mention MiCetF avec lien `micetf.fr/similire` |
| Format | A5 paysage — imprimable, rangeable dans un cahier de réussites |

**Interactions :**

| Action | Description |
|---|---|
| `Saisir le prénom` | Champ texte — icône crayon comme affordance pour les non-lecteurs |
| `Valider` | Génère le brevet (Canvas API, côté client uniquement — aucune donnée ne transite par un serveur) |
| `Télécharger` | Export PNG ou PDF |
| `Fermer` | Ferme la modale, reprend l'activité |

---

## 4. Règles fonctionnelles transversales

### 4.1 Génération des étiquettes

| Règle | Description |
|---|---|
| **RF-01** | Le modèle est tiré aléatoirement dans le corpus du type sélectionné |
| **RF-02** | L'étiquette correcte apparaît exactement une fois dans la zone de propositions |
| **RF-03** | Les distracteurs sont issus du **sous-ensemble qualifié** associé à l'item — pas du corpus global |
| **RF-04** | Aucune étiquette distracteur n'est dupliquée dans la même série |
| **RF-05** | La position de la réponse correcte est aléatoire à chaque nouveau tour |

### 4.2 Persistance et données

| Règle | Description |
|---|---|
| **RF-06** | Aucune authentification requise |
| **RF-07** | Aucune donnée personnelle ne transite par un serveur |
| **RF-08** | La configuration (type + nombre) est persistée en `localStorage` pour retrouver les derniers réglages au rechargement |
| **RF-09** | Le score de session est en mémoire uniquement — réinitialisé au rechargement |

---

## 5. Architecture de l'expérience utilisateur

### 5.1 Principes UX non négociables pour le 1er degré

| Principe | Justification | Application concrète |
|---|---|---|
| **Zéro friction au démarrage** | Un enfant doit pouvoir commencer seul en moins de 5 secondes | Pas d'écran d'accueil, pas de tutoriel obligatoire — l'activité est immédiatement visible |
| **Pas de défilement** | Le scroll est source de désorientation | Tout le contenu tient dans la viewport quelle que soit la taille d'écran |
| **Affordance évidente** | Les élèves de CP ne lisent pas les instructions | Les zones cliquables ressemblent visuellement à des étiquettes manipulables |
| **Irréversibilité minimale** | Une erreur de clic ne doit pas avoir de conséquence grave | Pas de validation en deux temps — feedback non punitif |
| **Autonomie de l'élève** | L'enseignant ne peut pas assister tous les élèves simultanément | L'élève comprend quoi faire sans lire les instructions |

### 5.2 Gestion des contextes d'usage

| Contexte | Particularités UX |
|---|---|
| **Ordinateur fixe** | Interaction souris — hover disponible |
| **Tablette individuelle** | Interaction tactile — grandes zones de tap — orientation paysage privilégiée |
| **TNI / Vidéoprojecteur** | Distance 2–4m — mode TNI activé — clic enseignant ou élève au tableau |
| **Écran interactif (TBI)** | Interaction tactile à grande échelle — zones de tap très larges |

### 5.3 Palette graphique et typographie

**Typographie :**

| Élément | Recommandation |
|---|---|
| Police principale | **Luciole** (conçue pour les personnes dyslexiques, validée scientifiquement, libre) ou OpenDyslexic |
| Taille corps étiquettes | Minimum 24px en mode standard — minimum 48px en mode TNI |
| Interlettrage | `tracking-wide` (Tailwind) pour les items b/d/p/q |

**Couleurs :**

| Élément | Classe Tailwind | Rôle |
|---|---|---|
| Fond de page | `bg-gray-50` | Neutralité — ne pas interférer avec la discrimination |
| Zone modèle | `bg-blue-100 border-blue-500` | Identification claire du modèle |
| Propositions au repos | `bg-white border-gray-300` | Contraste élevé pour la lisibilité |
| Bonne réponse | `bg-green-200 / green-500` | Validation positive |
| Mauvaise réponse | `bg-orange-200 / orange-500` | Alerte sans stigmatisation |
| Guidage discret | `bg-yellow-300` halo temporaire | Aide sans donner la réponse |
| Panneau enseignant | `bg-gray-100 border-b border-gray-300` | Discret, secondaire visuellement |

### 5.4 Accessibilité

| Besoin | Solution |
|---|---|
| Élèves DYS | Option police Luciole / OpenDyslexic, espacement augmenté |
| Élèves malvoyants | Contraste WCAG AA garanti (ratio ≥ 4.5:1) |
| Élèves avec difficultés motrices | Grandes zones de clic, pas de double-clic, temps de réponse illimité |
| Navigation clavier | Tab entre propositions + Entrée pour valider |

---

## 6. Matrice de difficulté

| Niveau | Type | Nb propositions | Qualité des distracteurs | Profil cible |
|---|---|---|---|---|
| **Découverte** | Lettre | 2 | Distracteurs morphologiquement éloignés | GS fin / grande difficulté |
| **Initiation** | Lettre | 3–4 | Distracteurs de familles proches | CP début |
| **Standard** | Lettre | 5–6 | Même famille (b/d/p/q) | CP milieu |
| **Consolidation** | Syllabe | 3–4 | Distracteurs à 1 lettre de différence | CP fin / CE1 début |
| **Approfondissement** | Syllabe | 5–6 | Nasales / syllabes miroirs | CE1 |
| **Maîtrise** | Mot | 4–6 | Mots miroirs / variantes morphologiques | CE1 / CE2 |

---

## 7. Synthèse des écrans

```
┌──────────────────────────────────────────────────────────────────┐
│  SiMiLire — Retrouve l'étiquette identique                       │
├──────────────────────────────────────────────────────────────────┤
│  PANNEAU ENSEIGNANT (toujours visible, discret)                  │
│  [ Lettre ●] [ Syllabe ] [ Mot ]   Propositions: [－] 4 [＋]     │
│  [🖥 Mode TNI]  [🔒 Verrouiller]                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────┐                            │
│   │  Retrouve cette étiquette       │                            │
│   │                                 │                            │
│   │        ┌─────────┐              │                            │
│   │        │    b    │  ← modèle   │                            │
│   │        └─────────┘              │                            │
│   └─────────────────────────────────┘                            │
│                                                                  │
│   ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                │
│   │   d    │  │   b    │  │   p    │  │   q    │                │
│   └────────┘  └────────┘  └────────┘  └────────┘                │
│           ↑ fond vert au clic réussi                             │
│                                                                  │
│  [★ ★ ★ ☆ ☆]          ← Indicateur (coin bas gauche)            │
└──────────────────────────────────────────────────────────────────┘

FEEDBACK ERREUR (inline, sans modale)
┌──────────────────────────────────────────────────────────────────┐
│  [ d ] cliqué → fond orange + animation shake                    │
│  Bas de page : « Essaie encore ! »            [Réessayer →]      │
└──────────────────────────────────────────────────────────────────┘

MODALE BREVET SiMiLire (après seuil de réussite)
┌──────────────────────────────────────────────────────────────────┐
│  🏅 Brevet SiMiLire                                               │
│     Discrimination visuelle                                      │
│                                                                  │
│  ✏️ Écris ton prénom : [______________]          [Valider →]     │
│                                                                  │
│  Prénom, le JJ/MM/AAAA                                           │
│  « Je suis capable de retrouver rapidement                       │
│    une étiquette LETTRE dans une série de 4. »                   │
│                                                                  │
│  micetf.fr/similire                                              │
│                                                                  │
│  [⬇ Télécharger]                           [✕ Fermer]           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 8. Hors périmètre — exclusions délibérées

| Fonctionnalité exclue | Raison |
|---|---|
| Compte enseignant / espace personnel | Complexité technique sans bénéfice immédiat pour l'usage en classe |
| Statistiques par élève persistantes | RGPD + données de mineurs — complexité disproportionnée |
| Mode multijoueur | Hors de la vocation de l'outil (entraînement individuel) |
| Sons de voix lisant les étiquettes | Risque de contournement — l'élève écouterait au lieu de discriminer visuellement |
| Corpus personnalisé enseignant | Couvert par d'autres outils MiCetF — hors périmètre ici |

---

## 9. Évolutions envisageables (backlog)

| ID | Description | Priorité |
|---|---|---|
| **EV-01** | Chronomètre optionnel pour mesurer la vitesse de réponse | Haute |
| **EV-02** | Paramétrage de la casse (minuscule / majuscule / cursive) | Haute |
| **EV-03** | Accessibilité renforcée (contraste, taille police configurable) | Haute |
| **EV-04** | Historique de session exportable pour l'enseignant | Moyenne |
| **EV-05** | Mode « défi » avec objectif de temps | Basse |

---

*Document rédigé dans le cadre du projet de refonte des outils MiCetF.*
*Frédéric MISERY — micetf.fr*
