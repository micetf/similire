/**
 * Hook moteur de jeu SiMiLire.
 * Génère les tours, traite les réponses, mesure la fluidité,
 * gère le score et le retour sur les items échoués.
 *
 * @module hooks/useGameEngine
 */

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { corpus } from "@data";
import { melangerTableau, insererAleatoirement } from "@utils/random";
import { SEUIL_BREVET } from "@constants";

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

/**
 * Construit un tour à partir d'un item modèle.
 *
 * @param {Object}   modele           - Item modèle
 * @param {Object[]} itemsDisponibles - Corpus complet
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
 * Hook moteur de jeu SiMiLire.
 *
 * @param {import('./useConfig.js').Config} config - Configuration courante
 * @returns {{
 *   gameState: GameState,
 *   repondre: function(string): void,
 *   allerTourSuivant: function(function=): void,
 *   recommencer: function(function=): void,
 *   demarrerChrono: function(): void,
 * }}
 */
export function useGameEngine(config) {
    const { typeUnite, nbPropositions, delaiMaxFluidite } = config;

    const itemsDisponibles = useMemo(() => corpus[typeUnite], [typeUnite]);

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

    // Réinitialise le jeu au changement de type d'unité ou de nombre de propositions.
    // Cas légitime de useEffect : réaction à un changement de configuration externe.
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
     * Génère le tour suivant depuis la file.
     * Notifie l'appelant de l'id du nouvel item via callback optionnel.
     *
     * @param {Object[]}          file         - File d'items courante
     * @param {function(string)=} onNouveauTour - Callback reçevant l'id du prochain modèle
     * @returns {void}
     */
    const passerTourSuivant = (file, onNouveauTour) => {
        const nouvelleFile =
            file.length > 0 ? file : melangerTableau(itemsDisponibles);
        const [prochain, ...reste] = nouvelleFile;
        setFileItems(reste);
        setTourCourant(
            construireTour(prochain, itemsDisponibles, nbPropositions)
        );
        setStatut("attente");
        setNbErreursTourCourant(0);
        onNouveauTour?.(prochain.id);
    };

    /**
     * Traite la réponse de l'élève.
     * Mesure le temps depuis le dernier demarrerChrono().
     * Sur bonne réponse : vérifie le critère brevet (fiabilité + fluidité).
     * Sur mauvaise réponse : remet la série à zéro et réinsère l'item en file.
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

            // Critère brevet : fiabilité (score) ET fluidité (moyenne glissante)
            if (nouveauScore >= SEUIL_BREVET) {
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
     * Notifie l'appelant de l'id du premier item via callback optionnel.
     *
     * @param {function(string)=} onNouveauTour
     * @returns {void}
     */
    const recommender = (onNouveauTour) => {
        const nouvelleFile = melangerTableau(itemsDisponibles);
        const [premier, ...reste] = nouvelleFile;
        setFileItems(reste);
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
