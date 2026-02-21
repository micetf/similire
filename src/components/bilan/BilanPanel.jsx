/**
 * Panneau de bilan enseignant.
 * Affiche les items les plus échoués sur la session.
 * Accessible uniquement quand la configuration est déverrouillée.
 *
 * Sprint E : bouton "Travailler les points durs" pour activer le mode focus APC.
 *
 * @module components/bilan/BilanPanel
 */

import PropTypes from "prop-types";
import { X, Target } from "lucide-react";

/**
 * Barre de taux d'erreur colorée.
 *
 * @param {Object} props
 * @param {number} props.taux - Taux d'erreur entre 0 et 1
 * @returns {JSX.Element}
 */
function BarreTaux({ taux }) {
    const pct = Math.round(taux * 100);
    const couleur =
        pct >= 60 ? "bg-red-500" : pct >= 30 ? "bg-orange-400" : "bg-green-500";

    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${couleur}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-xs font-medium text-gray-500 tabular-nums w-8 text-right">
                {pct}%
            </span>
        </div>
    );
}

BarreTaux.propTypes = {
    taux: PropTypes.number.isRequired,
};

/**
 * Panneau de bilan enseignant.
 *
 * @param {Object}     props
 * @param {boolean}    props.estVisible              - Affiche ou masque le panneau
 * @param {Object[]}   props.itemsLesPlusEchoues     - Top 5 items échoués
 * @param {number}     props.totalTentatives         - Total tentatives session
 * @param {number}     props.totalErreurs            - Total erreurs session
 * @param {boolean}    props.hasDonnees              - true si données disponibles
 * @param {boolean}    props.modeFocusActif          - true si le mode focus est déjà actif
 * @param {Function}   props.onReinitialiser         - Callback réinitialisation
 * @param {Function}   props.onFermer                - Callback fermeture
 * @param {Function}   props.onTravaillerPointsDurs  - Callback activation mode focus
 * @returns {JSX.Element|null}
 */
function BilanPanel({
    estVisible,
    itemsLesPlusEchoues,
    totalTentatives,
    totalErreurs,
    hasDonnees,
    modeFocusActif,
    onReinitialiser,
    onFermer,
    onTravaillerPointsDurs,
}) {
    if (!estVisible) return null;

    const tauxGlobal =
        totalTentatives > 0
            ? Math.round((totalErreurs / totalTentatives) * 100)
            : 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
                        bg-black/40 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Tableau de bord enseignant"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md
                            flex flex-col max-h-[90vh]"
            >
                {/* En-tête */}
                <div
                    className="flex items-center justify-between px-6 py-4
                                border-b border-gray-100 shrink-0"
                >
                    <h2 className="text-lg font-bold text-gray-800">
                        Tableau de bord
                    </h2>
                    <button
                        onClick={onFermer}
                        className="p-1 text-gray-400 hover:text-gray-600
                                   rounded-lg transition-colors"
                        aria-label="Fermer le tableau de bord"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Corps */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {!hasDonnees ? (
                        <p className="text-center text-gray-400 py-8">
                            Aucune donnée disponible.
                            <br />
                            <span className="text-sm">
                                Les statistiques apparaîtront après la première
                                session.
                            </span>
                        </p>
                    ) : (
                        <>
                            {/* Synthèse globale */}
                            <div
                                className="flex items-center justify-around
                                            bg-gray-50 rounded-xl p-4 mb-5"
                            >
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">
                                        {totalTentatives}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        tentative
                                        {totalTentatives > 1 ? "s" : ""}
                                    </p>
                                </div>
                                <div className="h-8 w-px bg-gray-200" />
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-red-500">
                                        {totalErreurs}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        erreur{totalErreurs > 1 ? "s" : ""}
                                    </p>
                                </div>
                                <div className="h-8 w-px bg-gray-200" />
                                <div className="text-center">
                                    <p
                                        className={`text-2xl font-bold ${
                                            tauxGlobal >= 60
                                                ? "text-red-500"
                                                : tauxGlobal >= 30
                                                  ? "text-orange-400"
                                                  : "text-green-500"
                                        }`}
                                    >
                                        {tauxGlobal}%
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        taux d'erreur
                                    </p>
                                </div>
                            </div>

                            {/* Top 5 items difficiles */}
                            <h3 className="text-sm font-semibold text-gray-600 mb-3">
                                Items les plus difficiles
                            </h3>

                            {itemsLesPlusEchoues.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-4">
                                    Aucun item avec des erreurs.
                                </p>
                            ) : (
                                <ul className="space-y-3">
                                    {itemsLesPlusEchoues.map((item) => (
                                        <li key={item.id}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span
                                                    className="font-semibold text-gray-800
                                                               text-base leading-none"
                                                    style={{
                                                        fontFamily:
                                                            "var(--font-jeu)",
                                                    }}
                                                >
                                                    {item.valeur}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {item.erreurs} erreur
                                                    {item.erreurs > 1
                                                        ? "s"
                                                        : ""}{" "}
                                                    / {item.tentatives}{" "}
                                                    tentative
                                                    {item.tentatives > 1
                                                        ? "s"
                                                        : ""}
                                                </span>
                                            </div>
                                            <BarreTaux taux={item.tauxErreur} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>

                {/* Pied de panneau */}
                <div
                    className="px-6 py-4 border-t border-gray-100 shrink-0
                                flex flex-col gap-3"
                >
                    {/* Bouton mode focus — visible seulement si données disponibles
                        et mode focus pas déjà actif */}
                    {hasDonnees && !modeFocusActif && (
                        <button
                            onClick={onTravaillerPointsDurs}
                            className="w-full flex items-center justify-center gap-2
                                       py-2.5 bg-orange-500 hover:bg-orange-600
                                       text-white font-semibold rounded-xl
                                       transition-colors shadow-sm"
                        >
                            <Target className="w-4 h-4" aria-hidden="true" />
                            Travailler les points durs
                        </button>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onReinitialiser}
                            className="flex-1 py-2 border border-red-300
                                       text-red-500 hover:bg-red-50
                                       font-medium rounded-xl transition-colors"
                        >
                            Réinitialiser le bilan
                        </button>
                        <button
                            onClick={onFermer}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700
                                       text-white font-semibold rounded-xl
                                       transition-colors"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

BilanPanel.propTypes = {
    estVisible: PropTypes.bool.isRequired,
    itemsLesPlusEchoues: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            valeur: PropTypes.string.isRequired,
            tentatives: PropTypes.number.isRequired,
            erreurs: PropTypes.number.isRequired,
            tauxErreur: PropTypes.number.isRequired,
        })
    ).isRequired,
    totalTentatives: PropTypes.number.isRequired,
    totalErreurs: PropTypes.number.isRequired,
    hasDonnees: PropTypes.bool.isRequired,
    modeFocusActif: PropTypes.bool.isRequired,
    onReinitialiser: PropTypes.func.isRequired,
    onFermer: PropTypes.func.isRequired,
    onTravaillerPointsDurs: PropTypes.func.isRequired,
};

export default BilanPanel;
