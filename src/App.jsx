/**
 * Composant racine de SiMiLire.
 * Instancie les hooks et orchestre l'affichage.
 *
 * @module App
 */

import { useState, useCallback } from "react";
import { useConfig } from "@hooks/useConfig";
import { useGameEngine } from "@hooks/useGameEngine";
import ConfigPanel from "@/components/config/ConfigPanel";
import ModelZone from "@/components/game/ModelZone";
import ProposalGrid from "@/components/game/ProposalGrid";
import FeedbackMessage from "@/components/game/FeedbackMessage";
import ProgressIndicator from "@/components/progress/ProgressIndicator";
import BrevetModal from "@/components/brevet/BrevetModal";
import { DELAI_SUCCES_MS } from "@constants";

/**
 * Composant racine de SiMiLire.
 *
 * @returns {JSX.Element}
 */
function App() {
    const {
        config,
        setTypeUnite,
        setNbPropositions,
        toggleModeTni,
        toggleVerrouillage,
    } = useConfig();

    const { gameState, repondre, allerTourSuivant, recommencer } =
        useGameEngine(config);

    const {
        tourCourant,
        score,
        scoreTotal,
        statut,
        brevetDisponible,
        nbErreursTourCourant,
    } = gameState;

    const [idClique, setIdClique] = useState(null);
    const [modalBrevetVisible, setModalBrevetVisible] = useState(false);

    // Affiche la modale dès que le brevet est disponible
    const handleBrevetDisponible = useCallback(() => {
        if (brevetDisponible) setModalBrevetVisible(true);
    }, [brevetDisponible]);

    const handleRepondre = useCallback(
        (id) => {
            if (statut === "succes") return;
            setIdClique(id);
            repondre(id);
            if (id === tourCourant.modele.id) {
                setTimeout(() => {
                    setIdClique(null);
                    allerTourSuivant();
                    handleBrevetDisponible();
                }, DELAI_SUCCES_MS);
            }
        },
        [
            statut,
            repondre,
            allerTourSuivant,
            tourCourant.modele.id,
            handleBrevetDisponible,
        ]
    );

    const handleReessayer = useCallback(() => {
        setIdClique(null);
    }, []);

    const handleFermerModal = useCallback(() => {
        setModalBrevetVisible(false);
    }, []);

    const handleRecommencer = useCallback(() => {
        setModalBrevetVisible(false);
        recommencer();
    }, [recommencer]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center gap-6 p-4">
            {/* Panneau de configuration */}
            <ConfigPanel
                config={config}
                onTypeUnite={setTypeUnite}
                onNbPropositions={setNbPropositions}
                onToggleModeTni={toggleModeTni}
                onToggleVerrouillage={toggleVerrouillage}
            />

            {/* Zone modèle */}
            <ModelZone modele={tourCourant.modele} modeTni={config.modeTni} />

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
            />

            {/* Modale brevet */}
            <BrevetModal
                estVisible={modalBrevetVisible}
                typeUnite={config.typeUnite}
                nbPropositions={config.nbPropositions}
                onFermer={handleFermerModal}
                onRecommencer={handleRecommencer}
            />
        </div>
    );
}

export default App;
