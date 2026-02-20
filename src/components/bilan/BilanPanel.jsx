/**
 * Panneau de bilan enseignant.
 * Affiche les items les plus échoués sur la session.
 * Accessible uniquement quand la configuration est déverrouillée.
 *
 * @module components/bilan/BilanPanel
 */

import PropTypes from "prop-types";
import { X } from "lucide-react";

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
 * @param {boolean}    props.estVisible           - Affiche ou masque le panneau
 * @param {Object[]}   props.itemsLesPlusEchoues  - Top 5 items échoués
 * @param {number}     props.totalTentatives      - Total tentatives session
 * @param {number}     props.totalErreurs         - Total erreurs session
 * @param {boolean}    props.hasDonnees           - true si données disponibles
 * @param {Function}   props.onReinitialiser      - Callback réinitialisation
 * @param {Function}   props.onFermer             - Callback fermeture
 * @returns {JSX.Element|null}
 */
function BilanPanel({
    estVisible,
    itemsLesPlusEchoues,
    totalTentatives,
    totalErreurs,
    hasDonnees,
    onReinitialiser,
    onFermer,
}) {
    if (!estVisible) return null;

    const tauxGlobal =
        totalTentatives > 0
            ? Math.round((totalErreurs / totalTentatives) * 100)
            : 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
                       bg-black bg-opacity-60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-bilan"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg
                            flex flex-col max-h-[90vh]"
            >
                {/* En-tête */}
                <div
                    className="flex items-center justify-between px-6 py-4
                                border-b border-gray-100 shrink-0"
                >
                    <h2
                        id="titre-bilan"
                        className="text-xl font-bold text-gray-800"
                    >
                        📊 Bilan de session
                    </h2>
                    <button
                        onClick={onFermer}
                        className="p-2 text-gray-400 hover:text-gray-600
                                   rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Fermer le bilan"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Contenu */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    {!hasDonnees ? (
                        <p className="text-center text-gray-400 py-8">
                            Aucune donnée — la session n'a pas encore démarré.
                        </p>
                    ) : (
                        <>
                            {/* Synthèse globale */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-blue-50 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-bold text-blue-700 tabular-nums">
                                        {totalTentatives}
                                    </p>
                                    <p className="text-xs text-blue-500 mt-1">
                                        tentatives
                                    </p>
                                </div>
                                <div className="bg-orange-50 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-bold text-orange-600 tabular-nums">
                                        {totalErreurs}
                                    </p>
                                    <p className="text-xs text-orange-400 mt-1">
                                        erreurs
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-bold text-gray-700 tabular-nums">
                                        {tauxGlobal}%
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        taux d'erreur
                                    </p>
                                </div>
                            </div>

                            {/* Top 5 items difficiles */}
                            <div>
                                <h3
                                    className="text-sm font-semibold text-gray-500
                                               uppercase tracking-wide mb-3"
                                >
                                    Items les plus difficiles
                                </h3>
                                {itemsLesPlusEchoues.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic">
                                        Pas encore assez de données (2
                                        tentatives minimum par item).
                                    </p>
                                ) : (
                                    <ul className="space-y-3">
                                        {itemsLesPlusEchoues.map((item) => (
                                            <li
                                                key={item.id}
                                                className="flex flex-col gap-1"
                                            >
                                                <div
                                                    className="flex items-center
                                                                justify-between"
                                                >
                                                    <span
                                                        className="font-medium text-gray-800
                                                                   font-mono text-lg"
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
                                                <BarreTaux
                                                    taux={item.tauxErreur}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Pied de panneau */}
                <div
                    className="px-6 py-4 border-t border-gray-100 shrink-0
                                flex flex-col sm:flex-row gap-3"
                >
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
    onReinitialiser: PropTypes.func.isRequired,
    onFermer: PropTypes.func.isRequired,
};

export default BilanPanel;
