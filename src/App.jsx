import { useConfig } from "@hooks/useConfig";
import {
    NB_PROPOSITIONS_MIN,
    NB_PROPOSITIONS_MAX,
    TYPES_UNITE,
} from "@constants";

/**
 * Composant racine de SiMiLire.
 * Sprint 3 — validation du hook useConfig.
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

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold text-blue-600">
                SiMiLire — Test useConfig
            </h1>

            {/* Type d'unité */}
            <div className="space-x-2">
                {TYPES_UNITE.map((type) => (
                    <button
                        key={type}
                        onClick={() => setTypeUnite(type)}
                        className={`px-4 py-2 rounded ${
                            config.typeUnite === type
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-800"
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Nombre de propositions */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setNbPropositions(config.nbPropositions - 1)}
                    className="px-3 py-1 bg-gray-200 rounded"
                >
                    −
                </button>
                <span className="text-xl font-bold">
                    {config.nbPropositions}
                </span>
                <button
                    onClick={() => setNbPropositions(config.nbPropositions + 1)}
                    className="px-3 py-1 bg-gray-200 rounded"
                >
                    +
                </button>
                <span className="text-sm text-gray-500">
                    (min {NB_PROPOSITIONS_MIN} — max {NB_PROPOSITIONS_MAX})
                </span>
            </div>

            {/* Modes */}
            <div className="space-x-2">
                <button
                    onClick={toggleModeTni}
                    className={`px-4 py-2 rounded ${
                        config.modeTni
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-800"
                    }`}
                >
                    Mode TNI : {config.modeTni ? "ON" : "OFF"}
                </button>
                <button
                    onClick={toggleVerrouillage}
                    className={`px-4 py-2 rounded ${
                        config.verrouille
                            ? "bg-red-600 text-white"
                            : "bg-gray-200 text-gray-800"
                    }`}
                >
                    Verrouillé : {config.verrouille ? "OUI" : "NON"}
                </button>
            </div>

            {/* État courant */}
            <pre className="bg-gray-100 p-4 rounded text-sm">
                {JSON.stringify(config, null, 2)}
            </pre>
        </div>
    );
}

export default App;
