/**
 * Étiquette individuelle cliquable.
 * Gère ses propres états visuels : attente, succès, erreur, guidage.
 * La taille de police s'adapte automatiquement à la longueur du contenu.
 *
 * @module components/game/EtiquetteCard
 */

import { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Calcule les classes de taille de police et largeur minimale
 * selon le nombre de caractères de la valeur affichée.
 *
 * @param {string}  valeur   - Valeur affichée dans l'étiquette
 * @param {boolean} modeTni  - Mode TNI activé
 * @returns {{ texte: string, largeur: string }}
 */
function classesTailleTexte(valeur, modeTni) {
    const n = valeur.length;

    if (modeTni) {
        if (n <= 1) return { texte: "text-6xl", largeur: "min-w-[8rem]" };
        if (n <= 3) return { texte: "text-5xl", largeur: "min-w-[9rem]" };
        if (n <= 5) return { texte: "text-4xl", largeur: "min-w-[10rem]" };
        return { texte: "text-3xl", largeur: "min-w-[11rem]" };
    }

    if (n <= 1) return { texte: "text-4xl", largeur: "min-w-[5rem]" };
    if (n <= 3) return { texte: "text-3xl", largeur: "min-w-[6rem]" };
    if (n <= 5) return { texte: "text-2xl", largeur: "min-w-[7rem]" };
    return { texte: "text-xl", largeur: "min-w-[8rem]" };
}

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
    const [animer, setAnimer] = useState(false);

    useEffect(() => {
        if (estCliquee && statut === "erreur") {
            setAnimer(true);
            const timer = setTimeout(() => setAnimer(false), 400);
            return () => clearTimeout(timer);
        }
    }, [estCliquee, statut]);

    const afficherGuidage = estCorrecte && nbErreursTourCourant >= 2;

    const classesCouleur = () => {
        if (statut === "succes" && estCorrecte)
            return "bg-green-200 border-green-500 text-green-800";
        if (afficherGuidage)
            return "bg-yellow-100 border-yellow-400 text-gray-800";
        if (estCliquee && statut === "erreur")
            return "bg-orange-100 border-orange-400 text-gray-800";
        return "bg-white border-gray-300 text-gray-800 hover:border-blue-400 hover:bg-blue-50";
    };

    const { texte, largeur } = classesTailleTexte(valeur, modeTni);
    const hauteur = modeTni ? "h-28" : "h-16";

    return (
        <button
            onClick={() => onClic(id)}
            disabled={statut === "succes"}
            className={`
                flex items-center justify-center
                ${largeur} ${hauteur} px-3
                font-bold rounded-lg border-2
                transition-colors duration-150
                ${texte}
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
