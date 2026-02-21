/**
 * Formulaire d'ajout d'un item à un corpus personnalisé.
 *
 * Responsabilités : saisie, soumission, affichage d'erreur.
 * Aucune logique de validation — délégué au hook via onAjouter.
 *
 * @module components/corpus/ItemForm
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { Plus } from "lucide-react";
import { NB_ITEMS_MAX_CORPUS_CUSTOM } from "@constants";

const PLACEHOLDERS = {
    lettre: "ex : b, d, p…",
    syllabe: "ex : ba, da, on…",
    mot: "ex : son, main, les…",
};

/**
 * @param {Object}   props
 * @param {string}   props.typeUnite      - Type du corpus (lettre/syllabe/mot)
 * @param {number}   props.nbItems        - Nombre d'items actuels dans le corpus
 * @param {function(string): string|null} props.onAjouter - Retourne erreur ou null
 */
function ItemForm({ typeUnite, nbItems, onAjouter }) {
    const [valeur, setValeur] = useState("");
    const [erreur, setErreur] = useState(null);

    const estPlein = nbItems >= NB_ITEMS_MAX_CORPUS_CUSTOM;

    const handleSubmit = () => {
        if (!valeur.trim() || estPlein) return;
        const err = onAjouter(valeur.trim());
        if (err) {
            setErreur(err);
        } else {
            setValeur("");
            setErreur(null);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSubmit();
    };

    const handleChange = (e) => {
        setValeur(e.target.value);
        if (erreur) setErreur(null);
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={valeur}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={PLACEHOLDERS[typeUnite] ?? "Nouvelle valeur…"}
                    disabled={estPlein}
                    className={`
                        flex-1 px-3 py-2 rounded-lg border text-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${erreur ? "border-red-400 bg-red-50" : "border-gray-300"}
                    `}
                    aria-label="Valeur du nouvel item"
                    aria-invalid={!!erreur}
                    aria-describedby={erreur ? "item-form-error" : undefined}
                    maxLength={30}
                />
                <button
                    onClick={handleSubmit}
                    disabled={!valeur.trim() || estPlein}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg
                               bg-blue-600 text-white text-sm font-medium
                               hover:bg-blue-700 transition-colors
                               disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Ajouter cet item au corpus"
                >
                    <Plus size={16} aria-hidden="true" />
                    Ajouter
                </button>
            </div>
            {erreur && (
                <p
                    id="item-form-error"
                    role="alert"
                    className="text-xs text-red-600"
                >
                    {erreur}
                </p>
            )}
            {estPlein && (
                <p className="text-xs text-amber-600">
                    Limite de {NB_ITEMS_MAX_CORPUS_CUSTOM} items atteinte.
                </p>
            )}
        </div>
    );
}

ItemForm.propTypes = {
    typeUnite: PropTypes.string.isRequired,
    nbItems: PropTypes.number.isRequired,
    onAjouter: PropTypes.func.isRequired,
};

export default ItemForm;
