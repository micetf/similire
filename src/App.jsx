/**
 * Composant racine de SiMiLire.
 * Instancie les hooks et orchestre l'affichage.
 *
 * Sprint E : câblage du mode focus APC.
 *
 * Fix brevet : ouverture de la modale via useEffect déclaratif sur
 * brevetDisponible. Badge "Brevet !" dans ProgressIndicator permet
 * de rouvrir la modale si elle a été fermée sans action.
 *
 * @module App
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { useConfig } from "@hooks/useConfig";
import { useGameEngine } from "@hooks/useGameEngine";
import { useBilan } from "@hooks/useBilan";
import { useCorpusCustom } from "@hooks/useCorpusCustom";
import CorpusEditor from "@/components/corpus/CorpusEditor";
import Navbar from "@/components/layout/Navbar";
import NavbarSpacer from "@/components/layout/NavbarSpacer";
import ConfigPanel from "@/components/config/ConfigPanel";
import ModelZone from "@/components/game/ModelZone";
import ProposalGrid from "@/components/game/ProposalGrid";
import FeedbackMessage from "@/components/game/FeedbackMessage";
import ProgressIndicator from "@/components/progress/ProgressIndicator";
import BrevetModal from "@/components/brevet/BrevetModal";
import HelpModal from "@/components/help/HelpModal";
import BilanPanel from "@/components/bilan/BilanPanel";
import { corpus } from "@data";
import { DELAI_SUCCES_MS, POLICES_DISPONIBLES } from "@constants";
import { hasAideVue, markAideVue } from "@utils/storage";

/**
 * Composant racine de SiMiLire.
 *
 * @returns {JSX.Element}
 */
function App() {
    // ─── Configuration ──────────────────────────────────────────────────────
    const {
        config,
        setTypeUnite,
        setNbPropositions,
        toggleModeTni,
        toggleVerrouillage,
        setPolice,
        setDelaiMaxFluidite,
        setModeFocus,
        setIdCorpusCustom,
        activerCorpusCustom,
    } = useConfig();

    const {
        liste: listeCorpusCustom,
        creerCorpus,
        supprimerCorpus,
        ajouterItem,
        supprimerItem,
        validerNom,
    } = useCorpusCustom();

    const corpusCustomActif = useMemo(() => {
        if (!config.idCorpusCustom) return null;
        return (
            listeCorpusCustom.find((cc) => cc.id === config.idCorpusCustom) ??
            null
        );
    }, [config.idCorpusCustom, listeCorpusCustom]);

    // ─── Bilan ──────────────────────────────────────────────────────────────
    /**
     * Index id → item, toutes unités confondues.
     * Stable — corpus est une constante importée.
     */
    const itemsIndex = useMemo(() => {
        const index = {};
        Object.values(corpus)
            .flat()
            .forEach((item) => {
                index[item.id] = item;
            });
        return index;
    }, []);

    const {
        bilanBrut,
        itemsLesPlusEchoues,
        totalTentatives,
        totalErreurs,
        hasDonnees,
        enregistrerTentative,
        enregistrerErreur,
        reinitialiser: reinitialiserBilan,
    } = useBilan(itemsIndex);

    // ─── Moteur de jeu ──────────────────────────────────────────────────────
    // bilanBrut est passé en second paramètre pour le calcul du corpus focus.
    const {
        gameState,
        repondre,
        allerTourSuivant,
        recommencer,
        demarrerChrono,
    } = useGameEngine(config, bilanBrut, corpusCustomActif?.items ?? null);
    const {
        tourCourant,
        score,
        scoreTotal,
        statut,
        brevetDisponible,
        nbErreursTourCourant,
        tempsMoyen,
    } = gameState;

    // ─── État des modales ────────────────────────────────────────────────────
    const [idClique, setIdClique] = useState(null);
    const [modalBrevetVisible, setModalBrevetVisible] = useState(false);
    const [modalAideVisible, setModalAideVisible] = useState(
        () => !hasAideVue()
    );
    const [modalBilanVisible, setModalBilanVisible] = useState(false);
    const [modalCorpusVisible, setModalCorpusVisible] = useState(false);

    // ─── Enregistrement du premier tour ─────────────────────────────────────
    // Intentionnellement limité au mount — les tours suivants sont enregistrés
    // via les callbacks de allerTourSuivant et recommencer.
    useEffect(() => {
        enregistrerTentative(tourCourant.modele.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Ouverture automatique de la modale brevet ───────────────────────────
    /**
     * Réagit déclarativement au passage de brevetDisponible à true.
     * Pattern retenu : useEffect sur brevetDisponible plutôt qu'une lecture
     * dans setTimeout — pas de stale closure, pas de dépendance au timing.
     *
     * Si l'élève ferme la modale sans agir, brevetDisponible reste true
     * (recommencer() ne pas été appelé). Le badge dans ProgressIndicator
     * reste visible et permet de rouvrir la modale via handleOuvrirBrevet.
     */
    useEffect(() => {
        if (brevetDisponible) {
            setModalBrevetVisible(true);
        }
    }, [brevetDisponible]);

    // ─── Handlers jeu ───────────────────────────────────────────────────────
    const handleRepondre = useCallback(
        (id) => {
            if (statut === "succes") return;
            setIdClique(id);
            repondre(id);

            if (id === tourCourant.modele.id) {
                // Bonne réponse — passer au tour suivant après le délai visuel.
                // La détection du brevet est gérée par le useEffect ci-dessus.
                setTimeout(() => {
                    setIdClique(null);
                    allerTourSuivant((nouvelItemId) => {
                        enregistrerTentative(nouvelItemId);
                    });
                    demarrerChrono();
                }, DELAI_SUCCES_MS);
            } else {
                // Mauvaise réponse — enregistrer l'erreur sur l'item courant
                enregistrerErreur(tourCourant.modele.id);
            }
        },
        [
            statut,
            repondre,
            allerTourSuivant,
            demarrerChrono,
            tourCourant.modele.id,
            enregistrerTentative,
            enregistrerErreur,
        ]
    );

    const handleReessayer = useCallback(() => {
        setIdClique(null);
    }, []);

    // ─── Handlers brevet ────────────────────────────────────────────────────
    const handleFermerModal = useCallback(() => {
        setModalBrevetVisible(false);
        // brevetDisponible reste true dans useGameEngine — le badge
        // dans ProgressIndicator reste visible pour rouvrir la modale.
    }, []);

    const handleOuvrirBrevet = useCallback(() => {
        setModalBrevetVisible(true);
    }, []);

    const handleRecommencer = useCallback(() => {
        setModalBrevetVisible(false);
        recommencer((nouvelItemId) => {
            enregistrerTentative(nouvelItemId);
        });
        // recommencer() remet brevetDisponible à false dans useGameEngine —
        // le badge dans ProgressIndicator disparaît automatiquement.
    }, [recommencer, enregistrerTentative]);

    // ─── Handlers aide ──────────────────────────────────────────────────────
    const handleOuvrirAide = useCallback(() => {
        setModalAideVisible(true);
    }, []);

    const handleFermerAide = useCallback(() => {
        markAideVue();
        setModalAideVisible(false);
    }, []);

    // ─── Handlers bilan ─────────────────────────────────────────────────────
    const handleOuvrirBilan = useCallback(() => {
        setModalBilanVisible(true);
    }, []);

    const handleFermerBilan = useCallback(() => {
        setModalBilanVisible(false);
    }, []);

    const handleReinitialiserBilan = useCallback(() => {
        reinitialiserBilan();
        setModalBilanVisible(false);
    }, [reinitialiserBilan]);

    // ─── Handlers mode focus (Sprint E) ─────────────────────────────────────

    /**
     * Active le mode focus APC et ferme le panneau bilan.
     */
    const handleTravaillerPointsDurs = useCallback(() => {
        setModeFocus(true);
        setModalBilanVisible(false);
    }, [setModeFocus]);

    /**
     * Désactive le mode focus APC.
     * Ne réinitialise ni le bilan ni le score.
     */
    const handleDesactiverFocus = useCallback(() => {
        setModeFocus(false);
    }, [setModeFocus]);

    // ─── Modale corpus ───────────────────────────────────────────────────────────

    const handleOuvrirCorpus = useCallback(() => {
        setModalCorpusVisible(true);
    }, []);

    const handleFermerCorpus = useCallback(() => {
        setModalCorpusVisible(false);
    }, []);

    // ─── Activation corpus custom ─────────────────────────────────────────────────
    const handleActiverCorpusCustom = useCallback(
        (corpusOuNull) => {
            activerCorpusCustom(corpusOuNull ?? null);
        },
        [activerCorpusCustom]
    );
    // ─── Style police ────────────────────────────────────────────────────────
    const stylePolice = {
        "--font-jeu":
            POLICES_DISPONIBLES[config.police]?.fontFamily ??
            "system-ui, -apple-system, sans-serif",
    };

    // ─── Rendu ───────────────────────────────────────────────────────────────
    return (
        <>
            <Navbar
                onAide={handleOuvrirAide}
                onBilan={handleOuvrirBilan}
                verrouille={config.verrouille}
                onCorpusCustom={handleOuvrirCorpus}
            />
            <NavbarSpacer />

            <main
                className="zone-jeu min-h-screen bg-gray-50 flex flex-col
                             items-center gap-6 p-4"
                style={stylePolice}
            >
                {/* Indicateur de progression */}
                <ProgressIndicator
                    score={score}
                    scoreTotal={scoreTotal}
                    typeUnite={config.typeUnite}
                    tempsMoyen={tempsMoyen}
                    delaiMaxFluidite={config.delaiMaxFluidite}
                    modeFocus={config.modeFocus}
                    brevetDisponible={brevetDisponible}
                    onOuvrirBrevet={handleOuvrirBrevet}
                />

                {/* Panneau de configuration */}
                <ConfigPanel
                    config={config}
                    onTypeUnite={setTypeUnite}
                    onNbPropositions={setNbPropositions}
                    onToggleModeTni={toggleModeTni}
                    onToggleVerrouillage={toggleVerrouillage}
                    onPolice={setPolice}
                    onDelaiMaxFluidite={setDelaiMaxFluidite}
                    onDesactiverFocus={handleDesactiverFocus}
                    listeCorpusCustom={listeCorpusCustom}
                    onActiverCorpusCustom={handleActiverCorpusCustom}
                />

                {/* Zone modèle */}
                <ModelZone
                    modele={tourCourant.modele}
                    modeTni={config.modeTni}
                />

                {/* Grille de propositions */}
                <ProposalGrid
                    propositions={tourCourant.propositions}
                    idModele={tourCourant.modele.id}
                    idClique={idClique}
                    statut={statut}
                    nbErreursTourCourant={nbErreursTourCourant}
                    modeTni={config.modeTni}
                    onRepondre={handleRepondre}
                />

                {/* Feedback erreur */}
                <FeedbackMessage
                    statut={statut}
                    modeTni={config.modeTni}
                    onReessayer={handleReessayer}
                />

                {/* Modale brevet */}
                <BrevetModal
                    estVisible={modalBrevetVisible}
                    typeUnite={config.typeUnite}
                    nbPropositions={config.nbPropositions}
                    tempsMoyen={tempsMoyen}
                    onFermer={handleFermerModal}
                    onRecommencer={handleRecommencer}
                    sourceCorpus={config.idCorpusCustom ? "custom" : "natif"}
                    nomCorpusCustom={corpusCustomActif?.nom ?? undefined}
                />
            </main>

            {/* Modales hors flux principal */}
            <HelpModal
                estVisible={modalAideVisible}
                onFermer={handleFermerAide}
            />
            <BilanPanel
                estVisible={modalBilanVisible}
                itemsLesPlusEchoues={itemsLesPlusEchoues}
                totalTentatives={totalTentatives}
                totalErreurs={totalErreurs}
                hasDonnees={hasDonnees}
                modeFocusActif={config.modeFocus}
                onReinitialiser={handleReinitialiserBilan}
                onFermer={handleFermerBilan}
                onTravaillerPointsDurs={handleTravaillerPointsDurs}
            />
            {modalCorpusVisible && (
                <CorpusEditor
                    liste={listeCorpusCustom}
                    idCorpusActif={config.idCorpusCustom ?? null}
                    nbPropositions={config.nbPropositions}
                    onFermer={handleFermerCorpus}
                    onCreerCorpus={creerCorpus}
                    onSupprimerCorpus={supprimerCorpus}
                    onAjouterItem={ajouterItem}
                    onSupprimerItem={supprimerItem}
                    validerNom={validerNom}
                    onActiverCorpusCustom={handleActiverCorpusCustom}
                />
            )}
        </>
    );
}

export default App;
