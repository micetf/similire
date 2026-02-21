/**
 * Indicateur de progression de l'élève.
 *
 * Repositionné dans le flux normal (plus de `fixed`) — barre horizontale
 * pleine largeur entre NavbarSpacer et ConfigPanel.
 *
 * Motivations UX :
 * - Zone haute = zone naturelle d'attention enfant (eye-tracking CP/CE1)
 * - Lisible à distance TNI (largeur pleine, pas de coin perdu)
 * - Feedback proximal de l'action (au-dessus du jeu)
 * - Label fluidité textuel → lisible enseignant à 2m vs point de 8px
 *
 * Fluidité exprimée en items/min (référence orthophonie/fluence) plutôt
 * qu'en secondes totales pour 10 items.
 *
 * @module components/progress/ProgressIndicator
 */

import PropTypes from "prop-types";
import { SEUIL_BREVET } from "@constants";

// ─── Utilitaires ─────────────────────────────────────────────────────────────

/**
 * Convertit un temps moyen (ms/item) en débit (items/min), arrondi.
 *
 * @param {number} tempsMoyen - Temps moyen en ms
 * @returns {number}
 */
function tempsEnDebit(tempsMoyen) {
    return Math.round(60000 / tempsMoyen);
}

/**
 * Retourne la catégorie de fluidité selon le temps moyen et le seuil.
 *
 * @param {number|null} tempsMoyen
 * @param {number}      delaiMaxFluidite
 * @returns {'rapide'|'limite'|'lent'|'vide'}
 */
function categorieFluidite(tempsMoyen, delaiMaxFluidite) {
    if (tempsMoyen === null) return "vide";
    if (tempsMoyen < delaiMaxFluidite * 0.8) return "rapide";
    if (tempsMoyen < delaiMaxFluidite) return "limite";
    return "lent";
}

// ─── Sous-composants ─────────────────────────────────────────────────────────

/**
 * Label de fluidité textuel — lisible à distance TNI.
 * Exprimé en items/min, avec icône et couleur sémantique.
 *
 * @param {Object}      props
 * @param {number|null} props.tempsMoyen
 * @param {number}      props.delaiMaxFluidite
 * @param {string}      props.typeUnite
 */
function LabelFluidite({ tempsMoyen, delaiMaxFluidite, typeUnite }) {
    const categorie = categorieFluidite(tempsMoyen, delaiMaxFluidite);

    const LABELS_UNITE = {
        lettre: "l/min",
        syllabe: "syl/min",
        mot: "mots/min",
    };
    const unite = LABELS_UNITE[typeUnite] ?? "items/min";

    if (categorie === "vide") {
        return (
            <span className="text-sm text-gray-400 tabular-nums">
                — {unite}
            </span>
        );
    }

    const debit = tempsEnDebit(tempsMoyen);

    const styles = {
        rapide: {
            icone: "⚡",
            classe: "text-green-600 font-semibold",
            label: `${debit} ${unite}`,
            title: "Fluide",
        },
        limite: {
            icone: "⏱",
            classe: "text-orange-500 font-semibold",
            label: `${debit} ${unite}`,
            title: "Limite de fluidité",
        },
        lent: {
            icone: "🐢",
            classe: "text-red-500 font-semibold",
            label: `${debit} ${unite}`,
            title: "Pas encore fluide",
        },
    };

    const { icone, classe, label, title } = styles[categorie];

    return (
        <span
            className={`flex items-center gap-1 text-sm tabular-nums ${classe}`}
            title={title}
            aria-label={`Fluidité : ${label} — ${title}`}
        >
            <span aria-hidden="true">{icone}</span>
            {label}
        </span>
    );
}

LabelFluidite.propTypes = {
    tempsMoyen: PropTypes.number,
    delaiMaxFluidite: PropTypes.number.isRequired,
    typeUnite: PropTypes.string.isRequired,
};

/**
 * Indicateur étoiles — mode lettre.
 * 5 étoiles, 1 étoile par tranche de 2 réussites.
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

IndicateurEtoiles.propTypes = { score: PropTypes.number.isRequired };

/**
 * Indicateur barre de progression — mode syllabe.
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
            <span className="text-sm font-medium text-gray-600 tabular-nums w-10 shrink-0">
                {score}/{SEUIL_BREVET}
            </span>
        </div>
    );
}

IndicateurBarre.propTypes = { score: PropTypes.number.isRequired };

/**
 * Indicateur numérique série/total — mode mot.
 */
function IndicateurNumerique({ score, scoreTotal }) {
    return (
        <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>
                Série :{" "}
                <strong className="text-blue-600 tabular-nums">{score}</strong>
            </span>
            <span className="text-gray-300" aria-hidden="true">
                |
            </span>
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
 * Badge brevet cliquable — rouvre la modale si fermée sans action.
 */
function BadgeBrevet({ onOuvrirBrevet }) {
    return (
        <button
            onClick={onOuvrirBrevet}
            className="flex items-center gap-1.5 px-3 py-1
                       bg-yellow-400 hover:bg-yellow-300
                       text-yellow-900 font-semibold text-sm
                       rounded-full shadow-sm transition-colors
                       animate-pulse"
            title="Ton brevet est prêt ! Clique pour l'afficher."
            aria-label="Brevet disponible — cliquer pour ouvrir"
        >
            <span aria-hidden="true">🎓</span>
            Brevet !
        </button>
    );
}

BadgeBrevet.propTypes = {
    onOuvrirBrevet: PropTypes.func.isRequired,
};

// ─── Composant principal ──────────────────────────────────────────────────────

/**
 * Barre de progression horizontale pleine largeur.
 * Positionnée dans le flux normal, entre NavbarSpacer et ConfigPanel.
 *
 * @param {Object}      props
 * @param {number}      props.score              - Score consécutif courant
 * @param {number}      props.scoreTotal         - Total de bonnes réponses
 * @param {string}      props.typeUnite          - Type d'unité courant
 * @param {number|null} props.tempsMoyen         - Temps moyen par réponse (ms)
 * @param {number}      props.delaiMaxFluidite   - Seuil de fluidité (ms)
 * @param {boolean}     props.modeFocus          - Mode focus APC actif
 * @param {boolean}     props.brevetDisponible   - Brevet débloqué, modale fermée
 * @param {Function}    props.onOuvrirBrevet     - Rouvre la modale brevet
 * @returns {JSX.Element}
 */
function ProgressIndicator({
    score,
    scoreTotal,
    typeUnite,
    tempsMoyen,
    delaiMaxFluidite,
    modeFocus,
    brevetDisponible,
    onOuvrirBrevet,
}) {
    return (
        <div
            className="w-full bg-white border border-gray-200 rounded-xl
                        shadow-sm px-4 py-2"
        >
            <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Gauche — indicateur de score selon le type d'unité */}
                <div className="flex items-center gap-3">
                    {typeUnite === "lettre" && (
                        <IndicateurEtoiles score={score} />
                    )}
                    {typeUnite === "syllabe" && (
                        <IndicateurBarre score={score} />
                    )}
                    {typeUnite === "mot" && (
                        <IndicateurNumerique
                            score={score}
                            scoreTotal={scoreTotal}
                        />
                    )}
                </div>

                {/* Droite — fluidité + badges contextuels */}
                <div className="flex items-center gap-3 ml-auto">
                    <LabelFluidite
                        tempsMoyen={tempsMoyen}
                        delaiMaxFluidite={delaiMaxFluidite}
                        typeUnite={typeUnite}
                    />

                    {/* Séparateur */}
                    {(brevetDisponible || modeFocus) && (
                        <div
                            className="h-5 w-px bg-gray-200"
                            aria-hidden="true"
                        />
                    )}

                    {/* Badge brevet — visible si brevet disponible et modale fermée */}
                    {brevetDisponible && (
                        <BadgeBrevet onOuvrirBrevet={onOuvrirBrevet} />
                    )}

                    {/* Badge mode focus */}
                    {modeFocus && (
                        <span
                            className="inline-flex items-center gap-1 text-sm
                                       text-orange-600 font-semibold"
                            title="Mode focus actif — corpus ciblé sur les items difficiles"
                            aria-label="Mode focus actif"
                        >
                            <span aria-hidden="true">🎯</span>
                            Focus
                        </span>
                    )}
                </div>
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
    modeFocus: PropTypes.bool.isRequired,
    brevetDisponible: PropTypes.bool.isRequired,
    onOuvrirBrevet: PropTypes.func.isRequired,
};

export default ProgressIndicator;
