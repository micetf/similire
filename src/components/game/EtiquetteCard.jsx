/**
 * Carte étiquette cliquable — brique de base du jeu de discrimination.
 * Gère ses propres états visuels (repos, survol, succès, erreur, guidage).
 * Complète les feedbacks couleur par des icônes pour les utilisateurs
 * daltoniens (deutéranopie rouge-vert).
 *
 * @module components/game/EtiquetteCard
 */

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Check, X, ArrowRight } from "lucide-react";

/**
 * Calcule les classes de taille de texte et largeur minimale
 * selon la longueur du contenu et le mode TNI.
 *
 * @param {string}  valeur  - Valeur affichée
 * @param {boolean} modeTni - Mode TNI activé
 * @returns {{ texte: string, largeur: string }}
 */
function classesTailleTexte(valeur, modeTni) {
    const n = valeur.length;

    if (modeTni) {
        if (n <= 1) return { texte: "text-tni-lg", largeur: "min-w-[7rem]" };
        if (n <= 3) return { texte: "text-tni-md", largeur: "min-w-[8rem]" };
        if (n <= 5) return { texte: "text-tni-sm", largeur: "min-w-[10rem]" };
        return { texte: "text-2xl", largeur: "min-w-[12rem]" };
    }

    if (n <= 1) return { texte: "text-4xl", largeur: "min-w-[4rem]" };
    if (n <= 3) return { texte: "text-2xl", largeur: "min-w-[5rem]" };
    if (n <= 5) return { texte: "text-xl", largeur: "min-w-[6rem]" };
    return { texte: "text-base", largeur: "min-w-[7rem]" };
}

/**
 * Carte étiquette cliquable avec feedback visuel multicanal.
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
    const afficherSucces = statut === "succes" && estCorrecte;
    const afficherErreur = estCliquee && statut === "erreur";

    // Taille des icônes proportionnelle au mode TNI
    const tailleIcone = modeTni ? 24 : 16;

    /**
     * Détermine l'icône de badge à afficher selon l'état de la carte.
     * Retourne null si aucune icône n'est nécessaire.
     *
     * @returns {JSX.Element|null}
     */
    function Badge() {
        if (afficherSucces) {
            return (
                <span
                    aria-hidden="true"
                    className="absolute top-1 right-1 text-green-700"
                >
                    <Check size={tailleIcone} strokeWidth={3} />
                </span>
            );
        }
        if (afficherErreur) {
            return (
                <span
                    aria-hidden="true"
                    className="absolute top-1 right-1 text-orange-700"
                >
                    <X size={tailleIcone} strokeWidth={3} />
                </span>
            );
        }
        if (afficherGuidage) {
            return (
                <span
                    aria-hidden="true"
                    className="absolute top-1 right-1 text-yellow-600"
                >
                    <ArrowRight size={tailleIcone} strokeWidth={3} />
                </span>
            );
        }
        return null;
    }

    const classesCouleur = () => {
        if (afficherSucces)
            return "bg-green-200 border-green-500 text-green-800";
        if (afficherGuidage)
            return "bg-yellow-100 border-yellow-400 text-gray-800";
        if (afficherErreur)
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
                relative
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
            <Badge />
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
