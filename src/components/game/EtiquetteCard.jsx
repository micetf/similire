/**
 * Étiquette individuelle cliquable.
 * Gère ses propres états visuels : attente, succès, erreur, guidage.
 *
 * @module components/game/EtiquetteCard
 */

import { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Étiquette individuelle cliquable du jeu SiMiLire.
 *
 * @param {Object}   props
 * @param {string}   props.valeur               - Valeur affichée
 * @param {string}   props.id                   - Identifiant de l'item
 * @param {boolean}  props.estCorrecte           - Cet item est la bonne réponse
 * @param {boolean}  props.estCliquee            - Cet item vient d'être cliqué
 * @param {string}   props.statut               - Statut du tour courant
 * @param {number}   props.nbErreursTourCourant  - Nombre d'erreurs sur ce tour
 * @param {boolean}  props.modeTni              - Mode TNI activé
 * @param {Function} props.onClic               - Callback au clic
 * @returns {JSX.Element}
 */
function EtiquetteCard({
    valeur,
    id,
    estCorrecte,
    estCliquee,
    statut,
    nbErreursTourCourant,
    modeTni,
    onClic,
}) {
    // État local pour déclencher et réinitialiser l'animation shake
    const [animer, setAnimer] = useState(false);

    // Déclenche l'animation shake quand cette étiquette est cliquée en erreur
    useEffect(() => {
        if (estCliquee && statut === "erreur") {
            setAnimer(true);
            const timer = setTimeout(() => setAnimer(false), 400);
            return () => clearTimeout(timer);
        }
    }, [estCliquee, statut]);

    // Guidage discret : halo jaune sur la bonne réponse au 2e échec
    const afficherGuidage = estCorrecte && nbErreursTourCourant >= 2;

    // Classes de couleur selon l'état
    const classesCouleur = () => {
        if (statut === "succes" && estCorrecte) {
            return "bg-green-200 border-green-500 text-green-800";
        }
        if (afficherGuidage) {
            return "bg-yellow-100 border-yellow-400 text-gray-800";
        }
        if (estCliquee && statut === "erreur") {
            return "bg-orange-100 border-orange-400 text-gray-800";
        }
        return "bg-white border-gray-300 text-gray-800 hover:border-blue-400 hover:bg-blue-50";
    };

    // Tailles selon le mode TNI
    const classesTaille = modeTni
        ? "w-32 h-32 text-tni-md"
        : "w-20 h-20 text-3xl";

    return (
        <button
            onClick={() => onClic(id)}
            disabled={statut === "succes"}
            className={`
                flex items-center justify-center
                ${classesTaille}
                font-bold rounded-lg border-2
                transition-colors duration-150
                ${classesCouleur()}
                ${animer ? "animate-shake" : ""}
            `}
        >
            {valeur}
        </button>
    );
}

EtiquetteCard.propTypes = {
    valeur: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    estCorrecte: PropTypes.bool.isRequired,
    estCliquee: PropTypes.bool.isRequired,
    statut: PropTypes.oneOf(["attente", "erreur", "succes"]).isRequired,
    nbErreursTourCourant: PropTypes.number.isRequired,
    modeTni: PropTypes.bool.isRequired,
    onClic: PropTypes.func.isRequired,
};

export default EtiquetteCard;
