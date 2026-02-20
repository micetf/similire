/**
 * Grille des étiquettes proposées à l'élève.
 * Disposition responsive selon le nombre de propositions.
 *
 * @module components/game/ProposalGrid
 */

import PropTypes from "prop-types";
import EtiquetteCard from "./EtiquetteCard";

/**
 * Grille des étiquettes proposées.
 *
 * @param {Object}   props
 * @param {Array}    props.propositions          - Liste des items proposés
 * @param {string}   props.idModele              - Id de la bonne réponse
 * @param {string}   props.idClique              - Id de l'étiquette cliquée
 * @param {string}   props.statut               - Statut du tour courant
 * @param {number}   props.nbErreursTourCourant  - Nombre d'erreurs sur ce tour
 * @param {boolean}  props.modeTni              - Mode TNI activé
 * @param {Function} props.onRepondre           - Callback de réponse
 * @returns {JSX.Element}
 */
function ProposalGrid({
    propositions,
    idModele,
    idClique,
    statut,
    nbErreursTourCourant,
    modeTni,
    onRepondre,
}) {
    // Nombre de colonnes adapté au nombre de propositions
    const nbCols = Math.min(propositions.length, 4);
    const classeGrille = `grid grid-cols-${nbCols} gap-3 justify-items-center`;

    return (
        <div className={classeGrille}>
            {propositions.map((item) => (
                <EtiquetteCard
                    key={item.id}
                    valeur={item.valeur}
                    id={item.id}
                    estCorrecte={item.id === idModele}
                    estCliquee={item.id === idClique}
                    statut={statut}
                    nbErreursTourCourant={nbErreursTourCourant}
                    modeTni={modeTni}
                    onClic={onRepondre}
                />
            ))}
        </div>
    );
}

ProposalGrid.propTypes = {
    propositions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            valeur: PropTypes.string.isRequired,
        })
    ).isRequired,
    idModele: PropTypes.string.isRequired,
    idClique: PropTypes.string,
    statut: PropTypes.oneOf(["attente", "erreur", "succes"]).isRequired,
    nbErreursTourCourant: PropTypes.number.isRequired,
    modeTni: PropTypes.bool.isRequired,
    onRepondre: PropTypes.func.isRequired,
};

ProposalGrid.defaultProps = {
    idClique: null,
};

export default ProposalGrid;
