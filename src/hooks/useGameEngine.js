/**
 * Hook moteur de jeu SiMiLire.
 * Gère la génération des tours, le traitement des réponses,
 * le score et la répétition espacée implicite.
 *
 * Responsabilités :
 * - Générer les tours à partir du corpus et de la config
 * - Traiter les réponses (correcte / incorrecte)
 * - Maintenir le score et détecter le seuil du brevet
 * - Implémenter la répétition espacée (items échoués réinsérés en priorité)
 *
 * Hors responsabilité :
 * - Le délai visuel entre tours (géré dans le composant)
 * - La génération du brevet (géré dans useBrevet)
 *
 * @module hooks/useGameEngine
 */

import { useState, useMemo, useEffect } from "react";
import { corpus } from "@data";
import { SEUIL_BREVET } from "@constants";
import { melangerTableau, insererAleatoirement } from "@utils/random";

/**
 * @typedef {Object} Tour
 * @property {import('../data/lettres.js').CorpusItem}   modele       - L'item à retrouver
 * @property {import('../data/lettres.js').CorpusItem[]} propositions - Modèle + distracteurs mélangés
 */

/**
 * @typedef {'attente' | 'erreur' | 'succes'} StatutTour
 */

/**
 * @typedef {Object} GameState
 * @property {Tour}       tourCourant          - Tour en cours d'affichage
 * @property {number}     score                - Bonnes réponses consécutives
 * @property {number}     scoreTotal           - Bonnes réponses sur la session
 * @property {StatutTour} statut               - Statut du tour courant
 * @property {boolean}    brevetDisponible     - Seuil de réussite atteint
 * @property {number}     nbErreursTourCourant - Erreurs sur le tour actuel (guidage)
 */

/**
 * @typedef {Object} UseGameEngineReturn
 * @property {GameState} gameState   - État courant du jeu
 * @property {Function}  repondre    - Traite une réponse de l'élève
 * @property {Function}  recommencer - Réinitialise le score et génère un nouveau tour
 */

/**
 * Construit un tour de jeu à partir d'un item modèle et du corpus disponible.
 *
 * @param {import('../data/lettres.js').CorpusItem}   modele         - L'item modèle
 * @param {import('../data/lettres.js').CorpusItem[]} itemsDisponibles - Corpus complet
 * @param {number}                                    nbPropositions - Nombre de propositions
 * @returns {Tour}
 */
function construireTour(modele, itemsDisponibles, nbPropositions) {
    // Prendre les distracteurs qualifiés de l'item
    // Si pas assez, compléter avec d'autres items du corpus (hors modèle)
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

    const propositions = insererAleatoirement(distracteurs, modele);

    return { modele, propositions };
}

/**
 * Hook moteur de jeu SiMiLire.
 *
 * @param {import('./useConfig.js').Config} config - Configuration courante
 * @returns {UseGameEngineReturn}
 */
export function useGameEngine(config) {
    const { typeUnite, nbPropositions } = config;

    // Corpus disponible selon le type d'unité — recalculé uniquement si typeUnite change
    const itemsDisponibles = useMemo(() => corpus[typeUnite], [typeUnite]);

    // File d'items : détermine l'ordre de passage, mélangée à l'initialisation
    const [fileItems, setFileItems] = useState(() =>
        melangerTableau(corpus[typeUnite])
    );

    // Tour courant : généré à partir du premier item de la file
    const [tourCourant, setTourCourant] = useState(() =>
        construireTour(corpus[typeUnite][0], corpus[typeUnite], nbPropositions)
    );

    const [statut, setStatut] = useState(/** @type {StatutTour} */ ("attente"));
    const [score, setScore] = useState(0);
    const [scoreTotal, setScoreTotal] = useState(0);
    const [brevetDisponible, setBrevetDisponible] = useState(false);
    const [nbErreursTourCourant, setNbErreursTourCourant] = useState(0);

    /**
     * Réinitialise le jeu quand le type d'unité ou le nombre de propositions change.
     * Cas légitime d'useEffect : réaction à un changement de configuration externe.
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
    }, [typeUnite, nbPropositions]);

    /**
     * Génère le tour suivant en piochant dans la file.
     * Reconstruit la file si elle est épuisée.
     *
     * @param {import('../data/lettres.js').CorpusItem[]} file - File courante
     * @returns {void}
     */
    const passerTourSuivant = (file) => {
        const nouvelleFile =
            file.length > 0 ? file : melangerTableau(itemsDisponibles);
        const [prochain, ...reste] = nouvelleFile;
        setFileItems(reste);
        setTourCourant(
            construireTour(prochain, itemsDisponibles, nbPropositions)
        );
        setStatut("attente");
        setNbErreursTourCourant(0);
    };

    /**
     * Traite la réponse de l'élève.
     * Appelé par le composant, qui gère lui-même le délai visuel après un succès.
     *
     * @param {string} idClique - Identifiant de l'étiquette cliquée
     * @returns {void}
     */
    const repondre = (idClique) => {
        if (statut === "succes") return;

        if (idClique === tourCourant.modele.id) {
            // Bonne réponse
            const nouveauScore = score + 1;
            const nouveauScoreTotal = scoreTotal + 1;
            setScore(nouveauScore);
            setScoreTotal(nouveauScoreTotal);
            setStatut("succes");

            if (nouveauScore >= SEUIL_BREVET) {
                setBrevetDisponible(true);
            } else {
                // Le composant appellera passerTourSuivant après le délai visuel
            }
        } else {
            // Mauvaise réponse
            const nouvellesErreurs = nbErreursTourCourant + 1;
            setNbErreursTourCourant(nouvellesErreurs);
            setScore(0);
            setStatut("erreur");

            // Répétition espacée : réinsérer l'item en tête de file
            setFileItems((prev) => [tourCourant.modele, ...prev]);
        }
    };

    /**
     * Passe au tour suivant après le délai visuel de succès.
     * Appelé par le composant depuis un setTimeout.
     *
     * @returns {void}
     */
    const allerTourSuivant = () => {
        passerTourSuivant(fileItems);
    };

    /**
     * Réinitialise le score et génère un nouveau tour.
     * La configuration (type, nombre de propositions) est conservée.
     *
     * @returns {void}
     */
    const recommencer = () => {
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
    };

    /** @type {GameState} */
    const gameState = {
        tourCourant,
        score,
        scoreTotal,
        statut,
        brevetDisponible,
        nbErreursTourCourant,
    };

    return {
        gameState,
        repondre,
        allerTourSuivant,
        recommencer,
    };
}
