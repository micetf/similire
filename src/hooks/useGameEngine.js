/**
 * Hook moteur de jeu SiMiLire.
 *
 * Sprint F : accepte un corpus personnalisé (corpusActif) qui remplace
 * corpus[typeUnite] pour le tirage du modèle ET les distracteurs.
 * Tous les autres comportements (mode focus, fluidité, brevet) sont inchangés.
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

// ─── Fonctions pures locales ──────────────────────────────────────────────────

/**
 * @param {Object}   modele
 * @param {Object[]} itemsDisponibles
 * @param {number}   nbPropositions
 * @returns {{ modele: Object, propositions: Object[] }}
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

/** @param {number[]} tableau @returns {number|null} */
function calculerMoyenne(tableau) {
    if (tableau.length === 0) return null;
    return tableau.reduce((a, b) => a + b, 0) / tableau.length;
}

/**
 * Calcule le corpus focus à partir des données brutes du bilan.
 * @param {{ tentatives: Object, erreurs: Object }} bilanBrut
 * @param {Object[]} itemsDisponibles
 * @returns {Object[]}
 */
function calculerCorpusFocus(bilanBrut, itemsDisponibles) {
    const { tentatives, erreurs } = bilanBrut;

    const itemsAvecTaux = itemsDisponibles
        .filter(
            (item) => (tentatives[item.id] ?? 0) >= SEUIL_TENTATIVES_MIN_FOCUS
        )
        .map((item) => {
            const nb = tentatives[item.id];
            const err = erreurs[item.id] ?? 0;
            return { item, tauxErreur: err / nb };
        });

    const eligibles = itemsAvecTaux
        .filter(({ tauxErreur }) => tauxErreur > SEUIL_ERREUR_FOCUS)
        .sort((a, b) => b.tauxErreur - a.tauxErreur)
        .slice(0, TAILLE_MAX_CORPUS_FOCUS)
        .map(({ item }) => item);

    if (eligibles.length >= TAILLE_MIN_CORPUS_FOCUS) return eligibles;

    const idsEligibles = new Set(eligibles.map((i) => i.id));
    const complementaires = itemsAvecTaux
        .filter(({ item }) => !idsEligibles.has(item.id))
        .sort((a, b) => b.tauxErreur - a.tauxErreur)
        .slice(0, TAILLE_MIN_CORPUS_FOCUS - eligibles.length)
        .map(({ item }) => item);

    return [...eligibles, ...complementaires];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * @param {import('./useConfig.js').Config} config
 * @param {{ tentatives: Object, erreurs: Object }} bilanBrut
 * @param {Object[]|null} corpusActif - Items du corpus custom actif, ou null (Sprint F)
 */
export function useGameEngine(config, bilanBrut, corpusActif = null) {
    const {
        typeUnite,
        nbPropositions,
        delaiMaxFluidite,
        modeFocus,
        idCorpusCustom,
    } = config;

    // ── Corpus ──────────────────────────────────────────────────────────────

    /**
     * Items disponibles : corpus custom si actif, sinon corpus natif.
     * Sprint F : corpusActif remplace corpus[typeUnite] pour TOUT —
     * tirage du modèle ET distracteurs.
     */
    const itemsDisponibles = useMemo(() => {
        if (corpusActif !== null && corpusActif.length > 0) return corpusActif;
        return corpus[typeUnite];
    }, [typeUnite, corpusActif]);

    const corpusFocus = useMemo(() => {
        if (!modeFocus || !bilanBrut) return null;
        return calculerCorpusFocus(bilanBrut, itemsDisponibles);
    }, [modeFocus, bilanBrut, itemsDisponibles]);

    const itemsActifs =
        modeFocus && corpusFocus && corpusFocus.length > 0
            ? corpusFocus
            : itemsDisponibles;

    // ── État ─────────────────────────────────────────────────────────────────

    const [fileItems, setFileItems] = useState(() =>
        melangerTableau(corpus[typeUnite])
    );
    const [tourCourant, setTourCourant] = useState(() =>
        construireTour(corpus[typeUnite][0], corpus[typeUnite], nbPropositions)
    );
    const [statut, setStatut] = useState("attente");
    const [score, setScore] = useState(0);
    const [scoreTotal, setScoreTotal] = useState(0);
    const [brevetDisponible, setBrevetDisponible] = useState(false);
    const [nbErreursTourCourant, setNbErreursTourCourant] = useState(0);
    const [tempsParReponse, setTempsParReponse] = useState([]);

    const debutTour = useRef(Date.now());
    const modeFocusPrecedentRef = useRef(modeFocus);

    // ── Effets ───────────────────────────────────────────────────────────────

    /**
     * Reset sur changement de type, nb propositions ou corpus custom actif.
     * Sprint F : idCorpusCustom ajouté aux dépendances — garantit un reset
     * propre lors de l'activation/désactivation d'un corpus personnalisé.
     */
    useEffect(() => {
        const items =
            corpusActif !== null && corpusActif.length > 0
                ? corpusActif
                : corpus[typeUnite];
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeUnite, nbPropositions, idCorpusCustom]);

    /**
     * Reset de la file sur changement de mode focus.
     * Guard montage : évite le reset parasite au premier rendu.
     */
    useEffect(() => {
        if (modeFocusPrecedentRef.current === modeFocus) return;
        modeFocusPrecedentRef.current = modeFocus;

        const items =
            modeFocus && corpusFocus && corpusFocus.length > 0
                ? corpusFocus
                : itemsDisponibles;
        setFileItems(melangerTableau(items));

        if (!modeFocus) {
            setScore(0);
            setTempsParReponse([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modeFocus]);

    // ── Chronomètre ──────────────────────────────────────────────────────────

    const demarrerChrono = useCallback(() => {
        debutTour.current = Date.now();
    }, []);

    const tempsMoyen = calculerMoyenne(tempsParReponse.slice(-SEUIL_BREVET));

    // ── Tirage ───────────────────────────────────────────────────────────────

    const passerTourSuivant = (currentFile, callback) => {
        const sourceItems =
            modeFocus && corpusFocus && corpusFocus.length > 0
                ? corpusFocus
                : itemsDisponibles;

        let file = currentFile;
        if (file.length === 0) {
            file = melangerTableau(sourceItems).filter(
                (item) => item.id !== tourCourant.modele.id
            );
            if (file.length === 0) file = melangerTableau(sourceItems);
        }
        const [prochain, ...reste] = file;
        setFileItems(reste);
        setTourCourant(
            construireTour(prochain, itemsDisponibles, nbPropositions)
        );
        setStatut("attente");
        setNbErreursTourCourant(0);
        debutTour.current = Date.now();
        callback?.(prochain.id);
    };

    // ── Actions ──────────────────────────────────────────────────────────────

    const repondre = (idReponse) => {
        if (statut !== "attente") return;

        const duree = Date.now() - debutTour.current;

        if (idReponse === tourCourant.modele.id) {
            const nouveauxTemps = [...tempsParReponse, duree];
            setTempsParReponse(nouveauxTemps);
            const nouveauScore = score + 1;
            setScore(nouveauScore);
            setScoreTotal((prev) => prev + 1);
            setStatut("succes");

            // Brevet désactivé en mode focus (corpus biaisé)
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
            setNbErreursTourCourant((prev) => prev + 1);
            setScore(0);
            setTempsParReponse([]);
            setStatut("erreur");
            setFileItems((prev) => [tourCourant.modele, ...prev]);
        }
    };

    const allerTourSuivant = (onNouveauTour) => {
        passerTourSuivant(fileItems, onNouveauTour);
    };

    const recommencer = (onNouveauTour) => {
        const nouvelleFile = melangerTableau(itemsActifs);
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

    return {
        gameState: {
            tourCourant,
            score,
            scoreTotal,
            statut,
            brevetDisponible,
            nbErreursTourCourant,
            tempsMoyen,
        },
        repondre,
        allerTourSuivant,
        recommencer,
        demarrerChrono,
    };
}
