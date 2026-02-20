/**
 * Indicateur de progression de l'élève.
 * Le format s'adapte automatiquement au type d'unité sélectionné :
 * - lettre  → étoiles (GS/CP)
 * - syllabe → barre de progression (CP/CE1)
 * - mot     → score numérique (CE1/CE2)
 *
 * @module components/progress/ProgressIndicator
 */

import PropTypes from "prop-types";
import { SEUIL_BREVET } from "@constants";

/**
 * Indicateur étoiles — format GS/CP.
 *
 * @param {Object} props
 * @param {number} props.score - Score consécutif courant
 * @returns {JSX.Element}
 */
function IndicateurEtoiles({ score }) {
    const nbEtoiles = 5;
    const etoilesPleine = Math.min(Math.floor(score / 2), nbEtoiles);

    return (
        <div
            className="flex items-center gap-1"
            aria-label={`${score} réussites`}
        >
            {Array.from({ length: nbEtoiles }, (_, i) => (
                <span
                    key={i}
                    className={`text-2xl transition-colors duration-300 ${
                        i < etoilesPleine ? "text-yellow-400" : "text-gray-300"
                    }`}
                    aria-hidden="true"
                >
                    ★
                </span>
            ))}
        </div>
    );
}

IndicateurEtoiles.propTypes = {
    score: PropTypes.number.isRequired,
};

/**
 * Indicateur barre de progression — format CP/CE1.
 *
 * @param {Object} props
 * @param {number} props.score - Score consécutif courant
 * @returns {JSX.Element}
 */
function IndicateurBarre({ score }) {
    const pourcentage = Math.min((score / SEUIL_BREVET) * 100, 100);

    return (
        <div className="flex items-center gap-3 w-48">
            <div
                className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={score}
                aria-valuemin={0}
                aria-valuemax={SEUIL_BREVET}
                aria-label={`${score} réussites sur ${SEUIL_BREVET}`}
            >
                <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${pourcentage}%` }}
                />
            </div>
            <span className="text-sm font-medium text-gray-600 tabular-nums">
                {score}/{SEUIL_BREVET}
            </span>
        </div>
    );
}

IndicateurBarre.propTypes = {
    score: PropTypes.number.isRequired,
};

/**
 * Indicateur score numérique — format CE1/CE2.
 *
 * @param {Object} props
 * @param {number} props.score      - Score consécutif courant
 * @param {number} props.scoreTotal - Total de bonnes réponses sur la session
 * @returns {JSX.Element}
 */
function IndicateurNumerique({ score, scoreTotal }) {
    return (
        <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>
                Série :{" "}
                <strong className="text-blue-600 tabular-nums">{score}</strong>
            </span>
            <span className="text-gray-300">|</span>
            <span>
                Total :{" "}
                <strong className="text-gray-800 tabular-nums">
                    {scoreTotal}
                </strong>
            </span>
        </div>
    );
}

IndicateurNumerique.propTypes = {
    score: PropTypes.number.isRequired,
    scoreTotal: PropTypes.number.isRequired,
};

/**
 * Indicateur de progression — sélectionne le format selon le type d'unité.
 *
 * @param {Object} props
 * @param {number} props.score      - Score consécutif courant
 * @param {number} props.scoreTotal - Total de bonnes réponses sur la session
 * @param {string} props.typeUnite  - Type d'unité courant
 * @returns {JSX.Element}
 */
function ProgressIndicator({ score, scoreTotal, typeUnite }) {
    return (
        <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-2">
            {typeUnite === "lettre" && <IndicateurEtoiles score={score} />}
            {typeUnite === "syllabe" && <IndicateurBarre score={score} />}
            {typeUnite === "mot" && (
                <IndicateurNumerique score={score} scoreTotal={scoreTotal} />
            )}
        </div>
    );
}

ProgressIndicator.propTypes = {
    score: PropTypes.number.isRequired,
    scoreTotal: PropTypes.number.isRequired,
    typeUnite: PropTypes.string.isRequired,
};

export default ProgressIndicator;
