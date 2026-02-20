/**
 * Modale d'aide pédagogique SiMiLire.
 * Composant générique — le contenu est entièrement piloté par src/data/aide.js.
 * Ce composant ne change jamais ; seul aide.js évolue à chaque sprint.
 *
 * @module components/help/HelpModal
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { SECTIONS_AIDE } from "@data/aide";

/**
 * Modale d'aide pédagogique.
 *
 * @param {Object}   props
 * @param {boolean}  props.estVisible - Affiche ou masque la modale
 * @param {Function} props.onFermer  - Callback de fermeture
 * @returns {JSX.Element|null}
 */
function HelpModal({ estVisible, onFermer }) {
    const [ongletActif, setOngletActif] = useState(SECTIONS_AIDE[0].id);

    if (!estVisible) return null;

    const section = SECTIONS_AIDE.find((s) => s.id === ongletActif);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
                       bg-black bg-opacity-60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-aide"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl
                            flex flex-col max-h-[90vh]"
            >
                {/* En-tête */}
                <div
                    className="flex items-center justify-between px-6 py-4
                                border-b border-gray-100 shrink-0"
                >
                    <h2
                        id="titre-aide"
                        className="text-xl font-bold text-gray-800"
                    >
                        ❓ Aide pédagogique
                    </h2>
                    <button
                        onClick={onFermer}
                        className="p-2 text-gray-400 hover:text-gray-600
                                   rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Fermer l'aide"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Onglets */}
                <div
                    className="flex border-b border-gray-100 shrink-0 overflow-x-auto"
                    role="tablist"
                    aria-label="Sections d'aide"
                >
                    {SECTIONS_AIDE.map((s) => (
                        <button
                            key={s.id}
                            role="tab"
                            aria-selected={ongletActif === s.id}
                            aria-controls={`panel-${s.id}`}
                            onClick={() => setOngletActif(s.id)}
                            className={`
                                flex items-center gap-2 px-5 py-3
                                text-sm font-medium whitespace-nowrap
                                border-b-2 transition-colors
                                ${
                                    ongletActif === s.id
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                }
                            `}
                        >
                            <span aria-hidden="true">{s.icone}</span>
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Contenu de la section active */}
                <div
                    id={`panel-${section.id}`}
                    role="tabpanel"
                    className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
                >
                    {section.elements.map((el, i) => (
                        <div
                            key={i}
                            className="flex gap-4 p-4 bg-gray-50
                                       rounded-xl border border-gray-100"
                        >
                            {el.icone && (
                                <span
                                    className="text-2xl shrink-0 mt-0.5"
                                    aria-hidden="true"
                                >
                                    {el.icone}
                                </span>
                            )}
                            <div>
                                <p className="font-semibold text-gray-800 mb-1">
                                    {el.titre}
                                </p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {el.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pied de modale */}
                <div className="px-6 py-4 border-t border-gray-100 shrink-0">
                    <button
                        onClick={onFermer}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700
                                   text-white font-semibold rounded-xl
                                   transition-colors duration-150"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}

HelpModal.propTypes = {
    estVisible: PropTypes.bool.isRequired,
    onFermer: PropTypes.func.isRequired,
};

export default HelpModal;
