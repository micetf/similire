/**
 * Panneau de configuration enseignant.
 * Permet de régler le type d'unité, le nombre de propositions,
 * le mode TNI et le verrouillage de la configuration.
 *
 * @module components/config/ConfigPanel
 */

import PropTypes from "prop-types";
import {
    TYPES_UNITE,
    LABELS_TYPES_UNITE,
    NB_PROPOSITIONS_MIN,
    NB_PROPOSITIONS_MAX,
} from "@constants";

/**
 * Icône cadenas — verrouillé.
 * @returns {JSX.Element}
 */
function IconeCadenas() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
        >
            <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
            />
        </svg>
    );
}

/**
 * Icône cadenas — déverrouillé.
 * @returns {JSX.Element}
 */
function IconeCadenasOuvert() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
        >
            <path
                fillRule="evenodd"
                d="M14.5 1A4.5 4.5 0 0010 5.5V9H3a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1.5V5.5a3 3 0 116 0v2.75a.75.75 0 001.5 0V5.5A4.5 4.5 0 0014.5 1z"
                clipRule="evenodd"
            />
        </svg>
    );
}

/**
 * Icône écran TNI.
 * @returns {JSX.Element}
 */
function IconeEcran() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
        >
            <path
                fillRule="evenodd"
                d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5z"
                clipRule="evenodd"
            />
        </svg>
    );
}

/**
 * Panneau de configuration enseignant.
 *
 * @param {Object}   props
 * @param {Object}   props.config               - Configuration courante
 * @param {Function} props.onTypeUnite          - Change le type d'unité
 * @param {Function} props.onNbPropositions     - Change le nombre de propositions
 * @param {Function} props.onToggleModeTni      - Bascule le mode TNI
 * @param {Function} props.onToggleVerrouillage - Bascule le verrouillage
 * @returns {JSX.Element}
 */
function ConfigPanel({
    config,
    onTypeUnite,
    onNbPropositions,
    onToggleModeTni,
    onToggleVerrouillage,
}) {
    const { typeUnite, nbPropositions, modeTni, verrouille } = config;

    // En mode verrouillé, seul le bouton de déverrouillage est visible
    if (verrouille) {
        return (
            <div className="flex justify-end w-full px-4">
                <button
                    onClick={onToggleVerrouillage}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Déverrouiller la configuration"
                    aria-label="Déverrouiller la configuration"
                >
                    <IconeCadenas />
                </button>
            </div>
        );
    }

    return (
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4">
            <div className="flex flex-wrap items-center gap-3 justify-center">
                {/* Sélecteur de type d'unité */}
                <div
                    className="flex rounded-lg border border-gray-300 overflow-hidden"
                    role="group"
                    aria-label="Type d'unité"
                >
                    {TYPES_UNITE.map((type) => (
                        <button
                            key={type}
                            onClick={() => onTypeUnite(type)}
                            className={`
                                px-4 py-2 text-sm font-medium transition-colors
                                ${
                                    typeUnite === type
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                }
                            `}
                            aria-pressed={typeUnite === type}
                        >
                            {LABELS_TYPES_UNITE[type]}
                        </button>
                    ))}
                </div>

                {/* Compteur de propositions */}
                <div
                    className="flex items-center rounded-lg border border-gray-300 overflow-hidden"
                    aria-label="Nombre de propositions"
                >
                    <button
                        onClick={() => onNbPropositions(nbPropositions - 1)}
                        disabled={nbPropositions <= NB_PROPOSITIONS_MIN}
                        className="px-3 py-2 text-gray-700 hover:bg-gray-50
                                   disabled:opacity-40 disabled:cursor-not-allowed
                                   transition-colors font-bold text-lg"
                        aria-label="Diminuer le nombre de propositions"
                    >
                        −
                    </button>
                    <span className="px-4 py-2 text-sm font-bold text-gray-800 min-w-[3rem] text-center">
                        {nbPropositions}
                    </span>
                    <button
                        onClick={() => onNbPropositions(nbPropositions + 1)}
                        disabled={nbPropositions >= NB_PROPOSITIONS_MAX}
                        className="px-3 py-2 text-gray-700 hover:bg-gray-50
                                   disabled:opacity-40 disabled:cursor-not-allowed
                                   transition-colors font-bold text-lg"
                        aria-label="Augmenter le nombre de propositions"
                    >
                        +
                    </button>
                </div>

                {/* Séparateur */}
                <div className="h-8 w-px bg-gray-300 hidden sm:block" />

                {/* Bouton mode TNI */}
                <button
                    onClick={onToggleModeTni}
                    className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg
                        text-sm font-medium transition-colors border
                        ${
                            modeTni
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }
                    `}
                    aria-pressed={modeTni}
                    title="Mode Tableau Numérique Interactif"
                >
                    <IconeEcran />
                    <span className="hidden sm:inline">TNI</span>
                </button>

                {/* Bouton verrouillage */}
                <button
                    onClick={onToggleVerrouillage}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg
                               text-sm font-medium border border-gray-300
                               bg-white text-gray-700 hover:bg-gray-50
                               transition-colors"
                    title="Verrouiller la configuration"
                    aria-label="Verrouiller la configuration"
                >
                    <IconeCadenasOuvert />
                    <span className="hidden sm:inline">Verrouiller</span>
                </button>
            </div>
        </div>
    );
}

ConfigPanel.propTypes = {
    config: PropTypes.shape({
        typeUnite: PropTypes.string.isRequired,
        nbPropositions: PropTypes.number.isRequired,
        modeTni: PropTypes.bool.isRequired,
        verrouille: PropTypes.bool.isRequired,
    }).isRequired,
    onTypeUnite: PropTypes.func.isRequired,
    onNbPropositions: PropTypes.func.isRequired,
    onToggleModeTni: PropTypes.func.isRequired,
    onToggleVerrouillage: PropTypes.func.isRequired,
};

export default ConfigPanel;
