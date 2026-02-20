/**
 * Composant racine de SiMiLire.
 * Instancie les hooks et orchestre l'affichage.
 *
 * @module App
 */

import { useState, useCallback } from "react";
import { useConfig } from "@hooks/useConfig";
import { useGameEngine } from "@hooks/useGameEngine";
import ModelZone from "@/components/game/ModelZone";
import ProposalGrid from "@/components/game/ProposalGrid";
import FeedbackMessage from "@/components/game/FeedbackMessage";
import { TYPES_UNITE, DELAI_SUCCES_MS } from "@constants";

/**
 * Composant racine de SiMiLire.
 *
 * @returns {JSX.Element}
 */
function App() {
    const { config, setTypeUnite, setNbPropositions, toggleModeTni } =
        useConfig();

    const { gameState, repondre, allerTourSuivant, recommencer } =
        useGameEngine(config);

    const {
        tourCourant,
        score,
        statut,
        brevetDisponible,
        nbErreursTourCourant,
    } = gameState;

    // Id de l'étiquette cliquée — pour l'animation shake
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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-8 p-6">
            {/* Config rapide — sera remplacée par ConfigPanel au sprint 6 */}
            <div className="flex flex-wrap gap-2 justify-center">
                {TYPES_UNITE.map((type) => (
                    <button
                        key={type}
                        onClick={() => setTypeUnite(type)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            config.typeUnite === type
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        {type}
                    </button>
                ))}
                <button
                    onClick={() => setNbPropositions(config.nbPropositions - 1)}
                    className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                    −
                </button>
                <span className="flex items-center font-bold text-lg px-2">
                    {config.nbPropositions}
                </span>
                <button
                    onClick={() => setNbPropositions(config.nbPropositions + 1)}
                    className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                    +
                </button>
                <button
                    onClick={toggleModeTni}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        config.modeTni
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    TNI
                </button>
            </div>

            {/* Score */}
            <p className="text-sm text-gray-500">
                Réussites consécutives : <strong>{score}</strong>
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
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                    >
                        Recommencer
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
