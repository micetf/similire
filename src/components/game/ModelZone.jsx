/**
 * Zone d'affichage du modèle à retrouver.
 * Visuellement distincte des propositions : fond bleu, taille supérieure.
 *
 * @module components/game/ModelZone
 */

import PropTypes from "prop-types";

/**
 * Zone d'affichage de l'étiquette modèle.
 *
 * @param {Object}  props
 * @param {Object}  props.modele   - Item modèle à afficher
 * @param {boolean} props.modeTni - Mode TNI activé
 * @returns {JSX.Element}
 */
function ModelZone({ modele, modeTni }) {
    const classeTexte = modeTni ? "text-tni-lg" : "text-5xl";

    return (
        <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-blue-700 tracking-wide uppercase">
                Retrouve cette étiquette
            </p>
            <div
                className={`
                    flex items-center justify-center
                    bg-blue-100 border-2 border-blue-500
                    rounded-xl shadow-sm
                    ${modeTni ? "w-48 h-48" : "w-28 h-28"}
                `}
            >
                <span
                    className={`font-bold text-blue-900 tracking-wide ${classeTexte}`}
                >
                    {modele.valeur}
                </span>
            </div>
        </div>
    );
}

ModelZone.propTypes = {
    modele: PropTypes.shape({
        id: PropTypes.string.isRequired,
        valeur: PropTypes.string.isRequired,
    }).isRequired,
    modeTni: PropTypes.bool.isRequired,
};

export default ModelZone;
