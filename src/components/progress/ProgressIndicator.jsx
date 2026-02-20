/**
 * Indicateur de progression de l'élève.
 * Le format s'adapte au type d'unité.
 * Un point thermique discret signale l'état de fluidité sur tous les modes.
 *
 * @module components/progress/ProgressIndicator
 */

import PropTypes from "prop-types";
import { SEUIL_BREVET } from "@constants";

/**
 * Calcule la couleur thermique selon le temps moyen et le seuil.
 *
 * - Vert  : tempsMoyen < seuil × 0.8 (clairement fluide)
 * - Orange : tempsMoyen < seuil (borderline)
 * - Rouge  : tempsMoyen >= seuil (pas fluide)
 * - Gris   : pas encore de données
 *
 * @param {number|null} tempsMoyen       - Temps moyen en ms, null si pas de données
 * @param {number}      delaiMaxFluidite - Seuil en ms
 * @returns {string} Classe Tailwind de couleur
 */
function classeCouleurThermique(tempsMoyen, delaiMaxFluidite) {
    if (tempsMoyen === null) return "bg-gray-300";
    if (tempsMoyen < delaiMaxFluidite * 0.8) return "bg-green-500";
    if (tempsMoyen < delaiMaxFluidite) return "bg-orange-400";
    return "bg-red-500";
}

/**
 * Point coloré indiquant l'état de fluidité.
 *
 * @param {Object}      props
 * @param {number|null} props.tempsMoyen       - Temps moyen en ms
 * @param {number}      props.delaiMaxFluidite - Seuil en ms
 * @returns {JSX.Element}
 */
function PointThermique({ tempsMoyen, delaiMaxFluidite }) {
    const couleur = classeCouleurThermique(tempsMoyen, delaiMaxFluidite);
    const label =
        tempsMoyen === null
            ? "Fluidité : pas encore de données"
            : `Fluidité : ${(tempsMoyen / 1000).toFixed(1)}s en moyenne`;

    return (
        <span
            className={`inline-block w-2 h-2 rounded-full shrink-0 ${couleur}`}
            aria-label={label}
            title={label}
        />
    );
}

PointThermique.propTypes = {
    tempsMoyen: PropTypes.number,
    delaiMaxFluidite: PropTypes.number.isRequired,
};

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
 * Indicateur de progression — format adapté au type d'unité
 * + point thermique de fluidité sur tous les modes.
 *
 * @param {Object}      props
 * @param {number}      props.score             - Score consécutif courant
 * @param {number}      props.scoreTotal        - Total de bonnes réponses
 * @param {string}      props.typeUnite         - Type d'unité courant
 * @param {number|null} props.tempsMoyen        - Temps moyen par réponse (ms)
 * @param {number}      props.delaiMaxFluidite  - Seuil de fluidité (ms)
 * @returns {JSX.Element}
 */
function ProgressIndicator({
    score,
    scoreTotal,
    typeUnite,
    tempsMoyen,
    delaiMaxFluidite,
}) {
    return (
        <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-2">
            <div className="flex items-center gap-3">
                {typeUnite === "lettre" && <IndicateurEtoiles score={score} />}
                {typeUnite === "syllabe" && <IndicateurBarre score={score} />}
                {typeUnite === "mot" && (
                    <IndicateurNumerique
                        score={score}
                        scoreTotal={scoreTotal}
                    />
                )}
                <PointThermique
                    tempsMoyen={tempsMoyen}
                    delaiMaxFluidite={delaiMaxFluidite}
                />
            </div>
        </div>
    );
}

ProgressIndicator.propTypes = {
    score: PropTypes.number.isRequired,
    scoreTotal: PropTypes.number.isRequired,
    typeUnite: PropTypes.string.isRequired,
    tempsMoyen: PropTypes.number,
    delaiMaxFluidite: PropTypes.number.isRequired,
};

export default ProgressIndicator;
