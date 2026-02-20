/**
 * Composant racine de SiMiLire.
 * Instancie les hooks et orchestre l'affichage.
 *
 * @module App
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { useConfig } from "@hooks/useConfig";
import { useGameEngine } from "@hooks/useGameEngine";
import { useBilan } from "@hooks/useBilan";
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
    } = useConfig();

    // ─── Moteur de jeu ──────────────────────────────────────────────────────
    const {
        gameState,
        repondre,
        allerTourSuivant,
        recommencer,
        demarrerChrono,
    } = useGameEngine(config);

    const {
        tourCourant,
        score,
        scoreTotal,
        statut,
        brevetDisponible,
        nbErreursTourCourant,
        tempsMoyen,
    } = gameState;

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
        itemsLesPlusEchoues,
        totalTentatives,
        totalErreurs,
        hasDonnees,
        enregistrerTentative,
        enregistrerErreur,
        reinitialiser: reinitialiserBilan,
    } = useBilan(itemsIndex);

    // ─── État des modales ────────────────────────────────────────────────────
    const [idClique, setIdClique] = useState(null);
    const [modalBrevetVisible, setModalBrevetVisible] = useState(false);
    const [modalAideVisible, setModalAideVisible] = useState(
        () => !hasAideVue()
    );
    const [modalBilanVisible, setModalBilanVisible] = useState(false);

    // ─── Enregistrement du premier tour ─────────────────────────────────────
    // Intentionnellement limité au mount — les tours suivants sont enregistrés
    // via les callbacks de allerTourSuivant et recommencer.
    useEffect(() => {
        enregistrerTentative(tourCourant.modele.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Handlers jeu ───────────────────────────────────────────────────────
    const handleBrevetDisponible = useCallback(() => {
        if (brevetDisponible) setModalBrevetVisible(true);
    }, [brevetDisponible]);

    const handleRepondre = useCallback(
        (id) => {
            if (statut === "succes") return;
            setIdClique(id);
            repondre(id);

            if (id === tourCourant.modele.id) {
                // Bonne réponse — passer au tour suivant après délai visuel
                setTimeout(() => {
                    setIdClique(null);
                    allerTourSuivant((nouvelItemId) => {
                        enregistrerTentative(nouvelItemId);
                    });
                    demarrerChrono();
                    handleBrevetDisponible();
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
            handleBrevetDisponible,
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
    }, []);

    const handleRecommencer = useCallback(() => {
        setModalBrevetVisible(false);
        recommencer((nouvelItemId) => {
            enregistrerTentative(nouvelItemId);
        });
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
            />
            <NavbarSpacer />

            <main
                className="zone-jeu min-h-screen bg-gray-50 flex flex-col
                             items-center gap-6 p-4"
                style={stylePolice}
            >
                {/* Panneau de configuration */}
                <ConfigPanel
                    config={config}
                    onTypeUnite={setTypeUnite}
                    onNbPropositions={setNbPropositions}
                    onToggleModeTni={toggleModeTni}
                    onToggleVerrouillage={toggleVerrouillage}
                    onPolice={setPolice}
                    onDelaiMaxFluidite={setDelaiMaxFluidite}
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

                {/* Indicateur de progression */}
                <ProgressIndicator
                    score={score}
                    scoreTotal={scoreTotal}
                    typeUnite={config.typeUnite}
                    tempsMoyen={tempsMoyen}
                    delaiMaxFluidite={config.delaiMaxFluidite}
                />

                {/* Modale brevet */}
                <BrevetModal
                    estVisible={modalBrevetVisible}
                    typeUnite={config.typeUnite}
                    nbPropositions={config.nbPropositions}
                    tempsMoyen={tempsMoyen}
                    onFermer={handleFermerModal}
                    onRecommencer={handleRecommencer}
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
                onReinitialiser={handleReinitialiserBilan}
                onFermer={handleFermerBilan}
            />
        </>
    );
}

export default App;
