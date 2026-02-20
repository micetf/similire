/**
 * Modale de génération et téléchargement du brevet SiMiLire.
 * Affiche un aperçu du brevet et permet le téléchargement PNG.
 * Toutes les données restent côté client.
 *
 * @module components/brevet/BrevetModal
 */

import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useBrevet } from "@hooks/useBrevet";

/** Dimensions du canvas brevet — A5 paysage */
const BREVET_WIDTH = 1587;
const BREVET_HEIGHT = 1122;

/**
 * Modale du brevet SiMiLire.
 *
 * @param {Object}   props
 * @param {boolean}  props.estVisible      - Affiche ou masque la modale
 * @param {string}   props.typeUnite       - Type d'unité travaillé
 * @param {number}   props.nbPropositions  - Nombre de propositions utilisées
 * @param {Function} props.onFermer        - Callback de fermeture
 * @param {Function} props.onRecommencer   - Callback de recommencement
 * @returns {JSX.Element|null}
 */
function BrevetModal({
    estVisible,
    typeUnite,
    nbPropositions,
    tempsMoyen,
    onFermer,
    onRecommencer,
}) {
    const [prenom, setPrenom] = useState("");
    const { canvasRef, genererBrevet, telecharger } = useBrevet();
    const inputRef = useRef(null);

    // Génère le brevet à chaque changement de prénom ou d'ouverture
    useEffect(() => {
        if (estVisible) {
            genererBrevet({ prenom, typeUnite, nbPropositions, tempsMoyen });
        }
    }, [estVisible, prenom, typeUnite, nbPropositions, genererBrevet]);

    // Focus sur le champ prénom à l'ouverture
    useEffect(() => {
        if (estVisible && inputRef.current) {
            inputRef.current.focus();
        }
    }, [estVisible]);

    if (!estVisible) return null;

    const handleTelecharger = () => {
        telecharger(prenom);
    };

    const handleRecommencer = () => {
        setPrenom("");
        onRecommencer();
        onFermer();
    };

    return (
        /* Fond semi-transparent */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
                       bg-black bg-opacity-60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-brevet"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl
                            flex flex-col gap-6 p-6 max-h-screen overflow-y-auto"
            >
                {/* En-tête */}
                <div className="text-center">
                    <h2
                        id="titre-brevet"
                        className="text-2xl font-bold text-blue-700"
                    >
                        🎓 Brevet SiMiLire
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Félicitations ! Saisis ton prénom pour personnaliser le
                        brevet.
                    </p>
                </div>

                {/* Champ prénom */}
                <div
                    className="flex items-center gap-3 border border-gray-300
                                rounded-xl px-4 py-3"
                >
                    <span className="text-2xl" aria-hidden="true">
                        ✏️
                    </span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        placeholder="Ton prénom"
                        maxLength={30}
                        className="flex-1 text-xl font-medium text-gray-800
                                   placeholder-gray-300 outline-none"
                        aria-label="Ton prénom"
                    />
                </div>

                {/* Aperçu du brevet */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        width={BREVET_WIDTH}
                        height={BREVET_HEIGHT}
                        className="w-full h-auto"
                        aria-label="Aperçu du brevet"
                    />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleTelecharger}
                        className="flex-1 flex items-center justify-center gap-2
                                   px-6 py-3 bg-blue-600 hover:bg-blue-700
                                   text-white font-bold rounded-xl
                                   transition-colors duration-150"
                    >
                        <span aria-hidden="true">⬇️</span>
                        Télécharger le brevet
                    </button>
                    <button
                        onClick={handleRecommencer}
                        className="flex-1 flex items-center justify-center gap-2
                                   px-6 py-3 bg-green-600 hover:bg-green-700
                                   text-white font-bold rounded-xl
                                   transition-colors duration-150"
                    >
                        <span aria-hidden="true">🔄</span>
                        Recommencer
                    </button>
                    <button
                        onClick={onFermer}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200
                                   text-gray-700 font-medium rounded-xl
                                   transition-colors duration-150"
                        aria-label="Fermer la modale"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}

BrevetModal.propTypes = {
    estVisible: PropTypes.bool.isRequired,
    typeUnite: PropTypes.string.isRequired,
    nbPropositions: PropTypes.number.isRequired,
    tempsMoyen: PropTypes.number.isRequired,
    onFermer: PropTypes.func.isRequired,
    onRecommencer: PropTypes.func.isRequired,
};

export default BrevetModal;
