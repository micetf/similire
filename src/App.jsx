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
        statut,
        brevetDisponible,
        nbErreursTourCourant,
    } = gameState;

    const [idClique, setIdClique] = useState(null);

    const handleRepondre = useCallback(
        (id) => {
            if (statut === "succes") return;
            setIdClique(id);
            repondre(id);
            if (id === tourCourant.modele.id) {
                setTimeout(() => {
                    setIdClique(null);
                    allerTourSuivant();
                }, DELAI_SUCCES_MS);
            }
        },
        [statut, repondre, allerTourSuivant, tourCourant.modele.id]
    );

    const handleReessayer = useCallback(() => {
        setIdClique(null);
    }, []);

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

            {/* Score */}
            <p className="text-sm text-gray-500">
                Réussites consécutives :{" "}
                <strong className="text-gray-800">{score}</strong>
            </p>

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

            {/* Brevet disponible — sera remplacé par BrevetModal au sprint 7 */}
            {brevetDisponible && (
                <div className="bg-green-100 border border-green-500 rounded-xl p-6 text-center space-y-3">
                    <p className="text-xl font-bold text-green-800">
                        Bravo ! Brevet disponible !
                    </p>
                    <button
                        onClick={recommencer}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700
                                   text-white font-bold rounded-lg transition-colors"
                    >
                        Recommencer
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
