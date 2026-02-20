# Changelog — SiMiLire

Toutes les modifications notables de ce projet sont documentées dans ce fichier.  
Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).  
Ce projet respecte le [Versionnage Sémantique](https://semver.org/lang/fr/).

---

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
