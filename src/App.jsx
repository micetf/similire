import { useCallback } from "react";
import { useConfig } from "@hooks/useConfig";
import { useGameEngine } from "@hooks/useGameEngine";
import { TYPES_UNITE, DELAI_SUCCES_MS } from "@constants";

/**
 * Composant racine de SiMiLire.
 * Sprint 4 — validation du hook useGameEngine.
 *
 * @returns {JSX.Element}
 */
function App() {
    const { config, setTypeUnite, setNbPropositions } = useConfig();
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

    const handleRepondre = useCallback(
        (id) => {
            repondre(id);
            if (id === tourCourant.modele.id) {
                setTimeout(() => {
                    allerTourSuivant();
                }, DELAI_SUCCES_MS);
            }
        },
        [repondre, allerTourSuivant, tourCourant.modele.id]
    );

    return (
        <div className="p-8 space-y-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-blue-600">
                SiMiLire — Test useGameEngine
            </h1>

            {/* Config rapide */}
            <div className="flex gap-2">
                {TYPES_UNITE.map((type) => (
                    <button
                        key={type}
                        onClick={() => setTypeUnite(type)}
                        className={`px-3 py-1 rounded ${
                            config.typeUnite === type
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200"
                        }`}
                    >
                        {type}
                    </button>
                ))}
                <button
                    onClick={() => setNbPropositions(config.nbPropositions - 1)}
                    className="px-3 py-1 bg-gray-200 rounded"
                >
                    −
                </button>
                <span className="self-center font-bold">
                    {config.nbPropositions}
                </span>
                <button
                    onClick={() => setNbPropositions(config.nbPropositions + 1)}
                    className="px-3 py-1 bg-gray-200 rounded"
                >
                    +
                </button>
            </div>

            {/* Modèle */}
            <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-700 mb-1">
                    Retrouve cette étiquette
                </p>
                <span className="text-4xl font-bold">
                    {tourCourant.modele.valeur}
                </span>
            </div>

            {/* Propositions */}
            <div className="grid grid-cols-4 gap-3">
                {tourCourant.propositions.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleRepondre(item.id)}
                        className={`h-20 text-3xl font-bold rounded-lg border-2 transition-colors ${
                            statut === "succes" &&
                            item.id === tourCourant.modele.id
                                ? "bg-green-200 border-green-500"
                                : statut === "erreur" &&
                                    item.id === tourCourant.modele.id &&
                                    nbErreursTourCourant >= 2
                                  ? "bg-yellow-200 border-yellow-400"
                                  : "bg-white border-gray-300 hover:border-blue-400"
                        }`}
                    >
                        {item.valeur}
                    </button>
                ))}
            </div>

            {/* Feedback */}
            {statut === "erreur" && (
                <p className="text-orange-600 font-bold text-center">
                    Essaie encore !
                </p>
            )}

            {/* Score */}
            <pre className="bg-gray-100 p-3 rounded text-sm">
                {JSON.stringify(
                    {
                        score,
                        scoreTotal,
                        statut,
                        brevetDisponible,
                        nbErreurs: nbErreursTourCourant,
                    },
                    null,
                    2
                )}
            </pre>

            {/* Brevet */}
            {brevetDisponible && (
                <div className="bg-green-100 border border-green-500 rounded p-4 text-center space-y-2">
                    <p className="font-bold text-green-800">
                        🎉 Brevet disponible !
                    </p>
                    <button
                        onClick={recommencer}
                        className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                        Recommencer
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
