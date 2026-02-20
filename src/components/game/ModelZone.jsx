/**
 * Zone d'affichage du modèle à retrouver.
 * La taille de police s'adapte à la longueur du contenu.
 *
 * @module components/game/ModelZone
 */

import PropTypes from "prop-types";

/**
 * Calcule les classes de taille de police selon la longueur du contenu.
 *
 * @param {string}  valeur  - Valeur affichée
 * @param {boolean} modeTni - Mode TNI activé
 * @returns {string}
 */
function classeTexteModele(valeur, modeTni) {
    const n = valeur.length;

    if (modeTni) {
        if (n <= 1) return "text-8xl";
        if (n <= 3) return "text-7xl";
        if (n <= 5) return "text-6xl";
        return "text-5xl";
    }

    if (n <= 1) return "text-6xl";
    if (n <= 3) return "text-5xl";
    if (n <= 5) return "text-4xl";
    return "text-3xl";
}

/**
 * Zone d'affichage de l'étiquette modèle.
 *
 * @param {Object}  props
 * @param {Object}  props.modele   - Item modèle à afficher
 * @param {boolean} props.modeTni - Mode TNI activé
 * @returns {JSX.Element}
 */
function ModelZone({ modele, modeTni }) {
    const classeTexte = classeTexteModele(modele.valeur, modeTni);
    const tailleBoite = modeTni
        ? "min-w-[12rem] min-h-[12rem]"
        : "min-w-[8rem] min-h-[8rem]";

    return (
        <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-blue-700 tracking-wide uppercase">
                Retrouve cette étiquette
            </p>
            <div
                className={`
                    flex items-center justify-center px-4
                    bg-blue-100 border-2 border-blue-500
                    rounded-xl shadow-sm
                    ${tailleBoite}
                `}
            >
                <span
                    className={`
                        font-bold text-blue-900 tracking-wide
                        ${classeTexte}
                    `}
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
