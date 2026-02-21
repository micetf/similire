/**
 * Hook moteur de jeu SiMiLire.
 * Génère les tours, traite les réponses, mesure la fluidité,
 * gère le score et le retour sur les items échoués.
 *
 * Sprint E : mode focus APC — pioche uniquement dans les items difficiles.
 *
 * @module hooks/useGameEngine
 */

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { corpus } from "@data";
import { melangerTableau, insererAleatoirement } from "@utils/random";
import {
    SEUIL_BREVET,
    SEUIL_ERREUR_FOCUS,
    SEUIL_TENTATIVES_MIN_FOCUS,
    TAILLE_MIN_CORPUS_FOCUS,
    TAILLE_MAX_CORPUS_FOCUS,
} from "@constants";

/**
 * @typedef {'attente'|'erreur'|'succes'} StatutTour
 */

/**
 * @typedef {Object} Tour
 * @property {Object}   modele       - Item modèle à retrouver
 * @property {Object[]} propositions - Items proposés (modèle + distracteurs mélangés)
 */

/**
 * @typedef {Object} GameState
 * @property {Tour}        tourCourant          - Tour en cours
 * @property {number}      score                - Réussites consécutives
 * @property {number}      scoreTotal           - Réussites totales sur la session
 * @property {StatutTour}  statut               - Statut du tour courant
 * @property {boolean}     brevetDisponible     - Critères fiabilité + fluidité atteints
 * @property {number}      nbErreursTourCourant - Erreurs sur le tour actuel
 * @property {number|null} tempsMoyen           - Temps moyen des SEUIL_BREVET dernières
 *                                               réponses correctes (ms), null si série vide
 */

// ─── Fonctions pures locales ──────────────────────────────────────────────────

/**
 * Construit un tour à partir d'un item modèle.
 * Les distracteurs sont toujours tirés du corpus COMPLET (itemsDisponibles),
 * même en mode focus — garantit un nombre suffisant de distracteurs.
 *
 * @param {Object}   modele           - Item modèle
 * @param {Object[]} itemsDisponibles - Corpus complet pour les distracteurs
 * @param {number}   nbPropositions   - Nombre de propositions
 * @returns {Tour}
 */
function construireTour(modele, itemsDisponibles, nbPropositions) {
    const distracteursQualifies = modele.distracteurs
        .map((val) => itemsDisponibles.find((item) => item.id === val))
        .filter(Boolean);

    const nbDistracteurs = nbPropositions - 1;
    let distracteurs = distracteursQualifies.slice(0, nbDistracteurs);

    if (distracteurs.length < nbDistracteurs) {
        const autresItems = melangerTableau(
            itemsDisponibles.filter(
                (item) =>
                    item.id !== modele.id &&
                    !distracteurs.some((d) => d.id === item.id)
            )
        );
        distracteurs = [
            ...distracteurs,
            ...autresItems.slice(0, nbDistracteurs - distracteurs.length),
        ];
    }

    return { modele, propositions: insererAleatoirement(distracteurs, modele) };
}

/**
 * Calcule la moyenne d'un tableau de nombres.
 * Retourne null si le tableau est vide.
 *
 * @param {number[]} valeurs
 * @returns {number|null}
 */
function calculerMoyenne(valeurs) {
    if (valeurs.length === 0) return null;
    return Math.round(valeurs.reduce((a, b) => a + b, 0) / valeurs.length);
}

/**
 * Calcule le corpus focus à partir du bilan brut.
 *
 * Algorithme :
 * 1. Sélectionne les items éligibles : tentatives ≥ SEUIL_TENTATIVES_MIN_FOCUS
 *    et taux d'erreur > SEUIL_ERREUR_FOCUS, triés par taux décroissant.
 * 2. Plafonne à TAILLE_MAX_CORPUS_FOCUS items.
 * 3. Si moins de TAILLE_MIN_CORPUS_FOCUS éligibles, complète avec les items
 *    les moins bien maîtrisés (hors éligibles, triés par taux décroissant).
 *    Les items jamais vus (taux = -Infinity) viennent en dernier.
 *
 * @param {{ tentatives: Object.<string,number>, erreurs: Object.<string,number> }} bilanBrut
 * @param {Object[]} itemsDisponibles - Corpus complet du type d'unité courant
 * @returns {Object[]} Corpus focus (entre TAILLE_MIN et TAILLE_MAX items)
 */
function calculerCorpusFocus(bilanBrut, itemsDisponibles) {
    /**
     * Calcule le taux d'erreur d'un item.
     * Retourne -Infinity pour les items sans tentative suffisante
     * (non éligibles, mais utilisables en complément).
     */
    const getTaux = (id) => {
        const tentatives = bilanBrut.tentatives[id] ?? 0;
        if (tentatives < SEUIL_TENTATIVES_MIN_FOCUS) return -Infinity;
        return (bilanBrut.erreurs[id] ?? 0) / tentatives;
    };

    // 1. Items éligibles — taux supérieur au seuil, triés par difficulté décroissante
    const eligibles = itemsDisponibles
        .filter((item) => getTaux(item.id) > SEUIL_ERREUR_FOCUS)
        .sort((a, b) => getTaux(b.id) - getTaux(a.id))
        .slice(0, TAILLE_MAX_CORPUS_FOCUS);

    // 2. Si assez d'éligibles, on s'arrête là
    if (eligibles.length >= TAILLE_MIN_CORPUS_FOCUS) {
        return eligibles;
    }

    // 3. Complétion avec les items non éligibles les moins bien maîtrisés
    const eligiblesIds = new Set(eligibles.map((i) => i.id));
    const complement = itemsDisponibles
        .filter((item) => !eligiblesIds.has(item.id))
        .map((item) => ({ item, taux: getTaux(item.id) }))
        .sort((a, b) => b.taux - a.taux) // -Infinity en dernier
        .slice(0, TAILLE_MIN_CORPUS_FOCUS - eligibles.length)
        .map(({ item }) => item);

    return [...eligibles, ...complement];
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Hook moteur de jeu SiMiLire.
 *
 * @param {import('./useConfig.js').Config} config    - Configuration courante
 * @param {{ tentatives: Object, erreurs: Object }}  bilanBrut - Données brutes du bilan (Sprint E)
 * @returns {{
 *   gameState: GameState,
 *   repondre: function(string): void,
 *   allerTourSuivant: function(function=): void,
 *   recommencer: function(function=): void,
 *   demarrerChrono: function(): void,
 * }}
 */
export function useGameEngine(config, bilanBrut) {
    const { typeUnite, nbPropositions, delaiMaxFluidite, modeFocus } = config;

    // ── Corpus ──────────────────────────────────────────────────────────────

    const itemsDisponibles = useMemo(() => corpus[typeUnite], [typeUnite]);

    /**
     * Corpus focus — recalculé dynamiquement à chaque mise à jour du bilan.
     * null si le mode focus est inactif.
     */
    const corpusFocus = useMemo(() => {
        if (!modeFocus || !bilanBrut) return null;
        return calculerCorpusFocus(bilanBrut, itemsDisponibles);
    }, [modeFocus, bilanBrut, itemsDisponibles]);

    /**
     * Items actifs pour le tirage du MODÈLE.
     * En mode focus : corpus focus (items difficiles).
     * Sinon : corpus complet.
     * Note : construireTour utilise TOUJOURS itemsDisponibles pour les distracteurs.
     */
    const itemsActifs =
        modeFocus && corpusFocus && corpusFocus.length > 0
            ? corpusFocus
            : itemsDisponibles;

    // ── État du jeu ──────────────────────────────────────────────────────────

    const [fileItems, setFileItems] = useState(() =>
        melangerTableau(corpus[typeUnite])
    );
    const [tourCourant, setTourCourant] = useState(() =>
        construireTour(corpus[typeUnite][0], corpus[typeUnite], nbPropositions)
    );
    const [statut, setStatut] = useState(/** @type {StatutTour} */ ("attente"));
    const [score, setScore] = useState(0);
    const [scoreTotal, setScoreTotal] = useState(0);
    const [brevetDisponible, setBrevetDisponible] = useState(false);
    const [nbErreursTourCourant, setNbErreursTourCourant] = useState(0);

    /**
     * Tableau des durées (ms) des réponses correctes de la série consécutive en cours.
     * Remis à zéro à chaque erreur — reflète uniquement la série courante.
     */
    const [tempsParReponse, setTempsParReponse] = useState([]);

    /** Timestamp de début du tour courant */
    const debutTour = useRef(Date.now());

    /**
     * Référence à la valeur précédente de modeFocus.
     * Permet d'éviter le reset parasite de la file au montage initial.
     */
    const modeFocusPrecedentRef = useRef(modeFocus);

    // ── Effets ───────────────────────────────────────────────────────────────

    /**
     * Réinitialise le jeu au changement de type d'unité ou de nombre de propositions.
     * Cas légitime de useEffect : réaction à un changement de configuration externe.
     */
    useEffect(() => {
        const items = corpus[typeUnite];
        const nouvelleFile = melangerTableau(items);
        const [premier, ...reste] = nouvelleFile;
        setFileItems(reste);
        setTourCourant(construireTour(premier, items, nbPropositions));
        setStatut("attente");
        setNbErreursTourCourant(0);
        setScore(0);
        setScoreTotal(0);
        setBrevetDisponible(false);
        setTempsParReponse([]);
        debutTour.current = Date.now();
    }, [typeUnite, nbPropositions]);

    /**
     * Reconstruit la file d'items lors du changement de mode focus.
     * Ignoré au montage initial (modeFocusPrecedentRef guard) pour ne pas
     * interférer avec l'effet [typeUnite, nbPropositions] ci-dessus.
     *
     * Sur activation   : file reconstruite depuis le corpus focus.
     * Sur désactivation : file reconstruite depuis le corpus complet.
     * Le tour courant déjà affiché n'est PAS modifié — il se termine normalement.
     */
    useEffect(() => {
        // Guard montage : on ne recalcule la file que si modeFocus a réellement changé
        if (modeFocusPrecedentRef.current === modeFocus) return;
        modeFocusPrecedentRef.current = modeFocus;

        const items =
            modeFocus && corpusFocus && corpusFocus.length > 0
                ? corpusFocus
                : itemsDisponibles;
        setFileItems(melangerTableau(items));

        // Sortie du mode focus : réinitialise le score consécutif et la fenêtre
        // de fluidité pour que le brevet soit décroché intégralement sur le corpus complet.
        // scoreTotal et bilan sont préservés.
        if (!modeFocus) {
            setScore(0);
            setTempsParReponse([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modeFocus]);

    // ── Chronomètre ──────────────────────────────────────────────────────────

    /**
     * Démarre le chronomètre du tour courant.
     * Appelé depuis App.jsx après le délai d'animation de succès.
     *
     * @returns {void}
     */
    const demarrerChrono = useCallback(() => {
        debutTour.current = Date.now();
    }, []);

    /**
     * Temps moyen des SEUIL_BREVET dernières réponses correctes (ms).
     * Null si la série courante est vide.
     */
    const tempsMoyen = calculerMoyenne(tempsParReponse.slice(-SEUIL_BREVET));

    // ── Logique de tirage ────────────────────────────────────────────────────

    /**
     * Génère le tour suivant depuis la file.
     * Quand la file est vide, la reconstruit depuis itemsActifs (corpus focus
     * ou corpus complet selon le mode).
     * Les distracteurs sont toujours tirés depuis itemsDisponibles (corpus complet).
     *
     * @param {Object[]}          file          - File d'items courante
     * @param {function(string)=} onNouveauTour - Callback reçevant l'id du prochain modèle
     * @returns {void}
     */
    const passerTourSuivant = (file, onNouveauTour) => {
        const nouvelleFile =
            file.length > 0 ? file : melangerTableau(itemsActifs);
        const [prochain, ...reste] = nouvelleFile;
        setFileItems(reste);
        // Distracteurs depuis le corpus complet — garantit nbPropositions respecté
        setTourCourant(
            construireTour(prochain, itemsDisponibles, nbPropositions)
        );
        setStatut("attente");
        setNbErreursTourCourant(0);
        onNouveauTour?.(prochain.id);
    };

    // ── Handlers exposés ─────────────────────────────────────────────────────

    /**
     * Traite la réponse de l'élève.
     * Mesure le temps depuis le dernier demarrerChrono().
     *
     * Sur bonne réponse :
     *   - Met à jour score et tempsParReponse
     *   - Vérifie le critère brevet (DÉSACTIVÉ en mode focus — corpus biaisé)
     *
     * Sur mauvaise réponse :
     *   - Remet la série à zéro
     *   - Réinsère l'item courant en tête de file (répétition immédiate)
     *
     * @param {string} idClique - Identifiant de l'étiquette cliquée
     * @returns {void}
     */
    const repondre = (idClique) => {
        if (statut === "succes") return;

        if (idClique === tourCourant.modele.id) {
            // Bonne réponse — enregistrer le temps
            const temps = Date.now() - debutTour.current;
            const nouveauxTemps = [...tempsParReponse, temps];
            setTempsParReponse(nouveauxTemps);

            const nouveauScore = score + 1;
            const nouveauScoreTotal = scoreTotal + 1;
            setScore(nouveauScore);
            setScoreTotal(nouveauScoreTotal);
            setStatut("succes");

            // Critère brevet désactivé en mode focus :
            // le corpus biaisé (items difficiles sur-représentés) invaliderait
            // la signification pédagogique du brevet (évaluation sommative).
            if (!modeFocus && nouveauScore >= SEUIL_BREVET) {
                const fenetre = nouveauxTemps.slice(-SEUIL_BREVET);
                const moyenneFenetre = calculerMoyenne(fenetre);
                if (
                    moyenneFenetre !== null &&
                    moyenneFenetre <= delaiMaxFluidite
                ) {
                    setBrevetDisponible(true);
                }
            }
        } else {
            // Mauvaise réponse — série brisée
            setNbErreursTourCourant((prev) => prev + 1);
            setScore(0);
            setTempsParReponse([]); // réinitialise la fenêtre de fluidité
            setStatut("erreur");
            setFileItems((prev) => [tourCourant.modele, ...prev]);
        }
    };

    /**
     * Passe au tour suivant après le délai visuel de succès.
     * Notifie l'appelant de l'id du nouvel item via callback optionnel.
     *
     * @param {function(string)=} onNouveauTour
     * @returns {void}
     */
    const allerTourSuivant = (onNouveauTour) => {
        passerTourSuivant(fileItems, onNouveauTour);
    };

    /**
     * Réinitialise le score et génère un nouveau tour.
     * Le bilan n'est PAS réinitialisé — réinitialisable uniquement via BilanPanel.
     * En mode focus, repart depuis le corpus focus courant.
     * Notifie l'appelant de l'id du premier item via callback optionnel.
     *
     * @param {function(string)=} onNouveauTour
     * @returns {void}
     */
    const recommender = (onNouveauTour) => {
        const nouvelleFile = melangerTableau(itemsActifs);
        const [premier, ...reste] = nouvelleFile;
        setFileItems(reste);
        // Distracteurs depuis le corpus complet — garantit nbPropositions respecté
        setTourCourant(
            construireTour(premier, itemsDisponibles, nbPropositions)
        );
        setScore(0);
        setScoreTotal(0);
        setStatut("attente");
        setBrevetDisponible(false);
        setNbErreursTourCourant(0);
        setTempsParReponse([]);
        debutTour.current = Date.now();
        onNouveauTour?.(premier.id);
    };

    // ── GameState ────────────────────────────────────────────────────────────

    /** @type {GameState} */
    const gameState = {
        tourCourant,
        score,
        scoreTotal,
        statut,
        brevetDisponible,
        nbErreursTourCourant,
        tempsMoyen,
    };

    return {
        gameState,
        repondre,
        allerTourSuivant,
        recommencer: recommender,
        demarrerChrono,
    };
}
