/**
 * Message de feedback affiché après une mauvaise réponse.
 * Propose un bouton pour réessayer le même tour.
 *
 * @module components/game/FeedbackMessage
 */

import PropTypes from "prop-types";

/**
 * Message de feedback en cas d'erreur.
 *
 * @param {Object}   props
 * @param {string}   props.statut      - Statut du tour courant
 * @param {boolean}  props.modeTni    - Mode TNI activé
 * @param {Function} props.onReessayer - Callback pour réessayer
 * @returns {JSX.Element|null}
 */
function FeedbackMessage({ statut, modeTni, onReessayer }) {
    if (statut !== "erreur") return null;

    const classeTexte = modeTni ? "text-tni-sm" : "text-lg";

    return (
        <div className="flex flex-col items-center gap-3">
            <p className={`font-bold text-orange-600 ${classeTexte}`}>
                Essaie encore !
            </p>
            <button
                onClick={onReessayer}
                className={`
                    px-6 py-2 bg-orange-500 hover:bg-orange-600
                    text-white font-bold rounded-lg
                    transition-colors duration-150
                    ${modeTni ? "text-tni-sm px-10 py-4" : ""}
                `}
            >
                Réessayer
            </button>
        </div>
    );
}

FeedbackMessage.propTypes = {
    statut: PropTypes.oneOf(["attente", "erreur", "succes"]).isRequired,
    modeTni: PropTypes.bool.isRequired,
    onReessayer: PropTypes.func.isRequired,
};

export default FeedbackMessage;
