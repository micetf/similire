/**
 * Éditeur de corpus personnalisés.
 *
 * Interface modale à 3 vues :
 *   - 'liste'  : catalogue des corpus existants
 *   - 'nouveau': formulaire de création (nom + type)
 *   - 'editer' : gestion des items d'un corpus
 *
 * Aucune logique de validation inline — tout délégué via les callbacks.
 *
 * @module components/corpus/CorpusEditor
 */

import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
    X,
    ArrowLeft,
    Plus,
    Trash2,
    BookOpen,
    CheckCircle,
} from "lucide-react";
import ItemForm from "./ItemForm";
import {
    NB_CORPUS_CUSTOM_MAX,
    TYPES_UNITE,
    LABELS_TYPES_UNITE,
} from "@constants";

// ─── Badges ───────────────────────────────────────────────────────────────────

const COULEURS_TYPE = {
    lettre: "bg-blue-100 text-blue-700",
    syllabe: "bg-purple-100 text-purple-700",
    mot: "bg-green-100 text-green-700",
};

function BadgeType({ typeUnite }) {
    return (
        <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium
                        ${COULEURS_TYPE[typeUnite] ?? "bg-gray-100 text-gray-600"}`}
        >
            {LABELS_TYPES_UNITE[typeUnite] ?? typeUnite}
        </span>
    );
}

BadgeType.propTypes = { typeUnite: PropTypes.string.isRequired };

// ─── Vue liste ────────────────────────────────────────────────────────────────

function VueListe({
    liste,
    idCorpusActif,
    nbPropositions,
    onCreer,
    onEditer,
    onSupprimer,
    onActiverCorpusCustom,
}) {
    const [idAConfirmer, setIdAConfirmer] = useState(null);
    const limite = liste.length >= NB_CORPUS_CUSTOM_MAX;

    const handleSupprimer = (id) => {
        if (idAConfirmer === id) {
            if (idCorpusActif === id) onActiverCorpusCustom(null);
            onSupprimer(id);
            setIdAConfirmer(null);
        } else {
            setIdAConfirmer(id);
        }
    };

    return (
        <div className="space-y-4">
            {/* Compteur */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                    {liste.length} / {NB_CORPUS_CUSTOM_MAX} corpus
                </span>
                {limite && (
                    <span className="text-amber-600 font-medium">
                        Limite atteinte — supprimez un corpus pour en créer un
                        nouveau.
                    </span>
                )}
            </div>

            {/* Liste */}
            {liste.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-sm">
                    <BookOpen
                        size={36}
                        className="mx-auto mb-3 opacity-40"
                        aria-hidden="true"
                    />
                    Aucun corpus personnalisé.
                    <br />
                    Créez-en un pour commencer.
                </div>
            ) : (
                <ul className="space-y-2">
                    {liste.map((cc) => {
                        const estActif = idCorpusActif === cc.id;
                        const trop_peu = cc.items.length < nbPropositions;
                        return (
                            <li
                                key={cc.id}
                                className={`rounded-xl border p-3 transition-colors
                                    ${
                                        estActif
                                            ? "border-blue-400 bg-blue-50"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Infos */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-medium text-sm text-gray-800 truncate">
                                                {cc.nom}
                                            </span>
                                            <BadgeType
                                                typeUnite={cc.typeUnite}
                                            />
                                            {estActif && (
                                                <span
                                                    className="inline-flex items-center gap-1
                                                                   text-xs text-blue-600 font-medium"
                                                >
                                                    <CheckCircle
                                                        size={12}
                                                        aria-hidden="true"
                                                    />
                                                    En cours
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                                            <span>
                                                {cc.items.length} item
                                                {cc.items.length > 1 ? "s" : ""}
                                            </span>
                                            {trop_peu && (
                                                <span className="text-amber-600">
                                                    ⚠ moins de {nbPropositions}{" "}
                                                    items — peu de diversité
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 shrink-0">
                                        {/* Utiliser / Désactiver */}
                                        <button
                                            onClick={() =>
                                                onActiverCorpusCustom(
                                                    estActif ? null : cc
                                                )
                                            }
                                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium
                                                        transition-colors
                                                        ${
                                                            estActif
                                                                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                            title={
                                                estActif
                                                    ? "Revenir au corpus natif"
                                                    : "Utiliser ce corpus"
                                            }
                                        >
                                            {estActif
                                                ? "Désactiver"
                                                : "Utiliser"}
                                        </button>

                                        {/* Modifier */}
                                        <button
                                            onClick={() => onEditer(cc.id)}
                                            className="p-1.5 rounded-lg text-gray-500
                                                       hover:bg-gray-100 transition-colors"
                                            title="Modifier les items"
                                            aria-label={`Modifier ${cc.nom}`}
                                        >
                                            <Plus
                                                size={15}
                                                aria-hidden="true"
                                            />
                                        </button>

                                        {/* Supprimer */}
                                        <button
                                            onClick={() =>
                                                handleSupprimer(cc.id)
                                            }
                                            className={`p-1.5 rounded-lg transition-colors
                                                        ${
                                                            idAConfirmer ===
                                                            cc.id
                                                                ? "bg-red-100 text-red-600"
                                                                : "text-gray-400 hover:bg-gray-100 hover:text-red-500"
                                                        }`}
                                            title={
                                                idAConfirmer === cc.id
                                                    ? "Confirmer la suppression"
                                                    : "Supprimer ce corpus"
                                            }
                                            aria-label={`Supprimer ${cc.nom}`}
                                        >
                                            <Trash2
                                                size={15}
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* Bouton créer */}
            <button
                onClick={onCreer}
                disabled={limite}
                className="w-full flex items-center justify-center gap-2 py-2.5
                           rounded-xl border-2 border-dashed border-gray-300
                           text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600
                           transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <Plus size={16} aria-hidden="true" />
                Nouveau corpus
            </button>
        </div>
    );
}

VueListe.propTypes = {
    liste: PropTypes.array.isRequired,
    idCorpusActif: PropTypes.string,
    nbPropositions: PropTypes.number.isRequired,
    onCreer: PropTypes.func.isRequired,
    onEditer: PropTypes.func.isRequired,
    onSupprimer: PropTypes.func.isRequired,
    onActiverCorpusCustom: PropTypes.func.isRequired,
};

// ─── Vue nouveau corpus ───────────────────────────────────────────────────────

function VueNouveau({ onCreer, validerNom }) {
    const [nom, setNom] = useState("");
    const [typeUnite, setTypeUnite] = useState("syllabe");
    const [erreur, setErreur] = useState(null);

    const handleCreer = () => {
        const err = validerNom(nom);
        if (err) {
            setErreur(err);
            return;
        }
        onCreer(nom.trim(), typeUnite);
    };

    const handleNomChange = (e) => {
        setNom(e.target.value);
        if (erreur) setErreur(null);
    };

    return (
        <div className="space-y-5">
            {/* Nom */}
            <div className="space-y-1.5">
                <label
                    htmlFor="corpus-nom"
                    className="block text-sm font-medium text-gray-700"
                >
                    Nom du corpus
                    <span className="ml-1 text-xs text-gray-400 font-normal">
                        (obligatoire)
                    </span>
                </label>
                <input
                    id="corpus-nom"
                    type="text"
                    value={nom}
                    onChange={handleNomChange}
                    placeholder="ex : Syllabes semaine 4, Mots de la famille…"
                    maxLength={40}
                    className={`w-full px-3 py-2 rounded-lg border text-sm
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                                ${erreur ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                    aria-invalid={!!erreur}
                    aria-describedby={erreur ? "nom-error" : undefined}
                    autoFocus
                />
                <div className="flex justify-between">
                    {erreur ? (
                        <p
                            id="nom-error"
                            role="alert"
                            className="text-xs text-red-600"
                        >
                            {erreur}
                        </p>
                    ) : (
                        <span />
                    )}
                    <span className="text-xs text-gray-400">
                        {nom.length}/40
                    </span>
                </div>
            </div>

            {/* Type d'unité */}
            <div className="space-y-1.5">
                <span className="block text-sm font-medium text-gray-700">
                    Type d&apos;unité
                    <span className="ml-1 text-xs text-gray-400 font-normal">
                        (fixé à la création)
                    </span>
                </span>
                <div
                    className="flex rounded-lg border border-gray-300 overflow-hidden"
                    role="group"
                    aria-label="Type d'unité"
                >
                    {TYPES_UNITE.map((type) => (
                        <button
                            key={type}
                            onClick={() => setTypeUnite(type)}
                            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors
                                        ${
                                            typeUnite === type
                                                ? "bg-blue-600 text-white"
                                                : "bg-white text-gray-600 hover:bg-gray-50"
                                        }`}
                            aria-pressed={typeUnite === type}
                        >
                            {LABELS_TYPES_UNITE[type]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Info distracteurs */}
            <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                ℹ️ Les distracteurs sont calculés automatiquement à partir des
                autres items du corpus. Ajoutez au moins{" "}
                <strong>autant d&apos;items que de propositions</strong> pour un
                fonctionnement optimal.
            </p>

            <button
                onClick={handleCreer}
                disabled={!nom.trim()}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm
                           font-semibold hover:bg-blue-700 transition-colors
                           disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Créer et ajouter des items →
            </button>
        </div>
    );
}

VueNouveau.propTypes = {
    onCreer: PropTypes.func.isRequired,
    validerNom: PropTypes.func.isRequired,
};

// ─── Vue édition items ────────────────────────────────────────────────────────

function VueEditer({ corpus, nbPropositions, onAjouter, onSupprimer }) {
    const trop_peu = corpus.items.length < nbPropositions;

    return (
        <div className="space-y-4">
            {/* En-tête corpus */}
            <div className="flex items-center gap-2">
                <BadgeType typeUnite={corpus.typeUnite} />
                <span className="text-sm text-gray-500">
                    {corpus.items.length} item
                    {corpus.items.length > 1 ? "s" : ""}
                </span>
                {trop_peu && corpus.items.length > 0 && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        ⚠ &lt; {nbPropositions} items
                    </span>
                )}
            </div>

            {/* Formulaire ajout */}
            <ItemForm
                typeUnite={corpus.typeUnite}
                nbItems={corpus.items.length}
                onAjouter={(valeur) => onAjouter(corpus.id, valeur)}
            />

            {/* Liste items */}
            {corpus.items.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-6">
                    Ajoutez le premier item ci-dessus.
                </p>
            ) : (
                <ul className="flex flex-wrap gap-2">
                    {corpus.items.map((item) => (
                        <li
                            key={item.id}
                            className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1
                                       rounded-full border border-gray-200 bg-gray-50
                                       text-sm text-gray-700"
                        >
                            <span
                                style={{
                                    fontFamily: "var(--font-jeu, system-ui)",
                                }}
                            >
                                {item.valeur}
                            </span>
                            <button
                                onClick={() => onSupprimer(corpus.id, item.id)}
                                className="p-0.5 rounded-full text-gray-400
                                           hover:text-red-500 hover:bg-red-50
                                           transition-colors"
                                aria-label={`Supprimer l'item ${item.valeur}`}
                            >
                                <X size={13} aria-hidden="true" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

VueEditer.propTypes = {
    corpus: PropTypes.object.isRequired,
    nbPropositions: PropTypes.number.isRequired,
    onAjouter: PropTypes.func.isRequired,
    onSupprimer: PropTypes.func.isRequired,
};

// ─── Composant principal ──────────────────────────────────────────────────────

/**
 * @param {Object}   props
 * @param {Array}    props.liste              - Corpus custom exposés
 * @param {string|null} props.idCorpusActif   - Id du corpus actif (ou null)
 * @param {number}   props.nbPropositions     - Pour les avertissements
 * @param {Function} props.onFermer
 * @param {Function} props.onCreerCorpus
 * @param {Function} props.onSupprimerCorpus
 * @param {Function} props.onAjouterItem
 * @param {Function} props.onSupprimerItem
 * @param {Function} props.validerNom
 * @param {Function} props.onActiverCorpusCustom
 */
function CorpusEditor({
    liste,
    idCorpusActif,
    nbPropositions,
    onFermer,
    onCreerCorpus,
    onSupprimerCorpus,
    onAjouterItem,
    onSupprimerItem,
    validerNom,
    onActiverCorpusCustom,
}) {
    const [vue, setVue] = useState("liste");
    const [idEnEdition, setIdEnEdition] = useState(null);

    const corpusEnEdition = idEnEdition
        ? (liste.find((cc) => cc.id === idEnEdition) ?? null)
        : null;

    const handleCreer = useCallback(
        (nom, typeUnite) => {
            const id = onCreerCorpus(nom, typeUnite);
            setIdEnEdition(id);
            setVue("editer");
        },
        [onCreerCorpus]
    );

    const handleRetour = () => {
        setVue("liste");
        setIdEnEdition(null);
    };

    // Titre et navigation selon la vue
    const renderHeader = () => {
        if (vue === "liste") {
            return (
                <>
                    <div className="flex items-center gap-2">
                        <BookOpen
                            size={18}
                            className="text-blue-600"
                            aria-hidden="true"
                        />
                        <h2 className="text-base font-semibold text-gray-800">
                            Mes corpus
                        </h2>
                    </div>
                    <button
                        onClick={onFermer}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100
                                   hover:text-gray-600 transition-colors"
                        aria-label="Fermer l'éditeur de corpus"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </>
            );
        }
        if (vue === "nouveau") {
            return (
                <>
                    <button
                        onClick={handleRetour}
                        className="flex items-center gap-1.5 text-sm text-gray-500
                                   hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft size={16} aria-hidden="true" />
                        Retour
                    </button>
                    <h2 className="text-base font-semibold text-gray-800">
                        Nouveau corpus
                    </h2>
                    <div className="w-16" />
                </>
            );
        }
        // vue === 'editer'
        return (
            <>
                <button
                    onClick={handleRetour}
                    className="flex items-center gap-1.5 text-sm text-gray-500
                               hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Retour
                </button>
                <h2
                    className="text-base font-semibold text-gray-800 truncate max-w-[200px]"
                    title={corpusEnEdition?.nom}
                >
                    {corpusEnEdition?.nom ?? "Corpus"}
                </h2>
                <div className="w-16" />
            </>
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Éditeur de corpus personnalisés"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg
                            max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between p-4
                                border-b border-gray-200 shrink-0"
                >
                    {renderHeader()}
                </div>

                {/* Contenu scrollable */}
                <div className="flex-1 overflow-y-auto p-4">
                    {vue === "liste" && (
                        <VueListe
                            liste={liste}
                            idCorpusActif={idCorpusActif}
                            nbPropositions={nbPropositions}
                            onCreer={() => setVue("nouveau")}
                            onEditer={(id) => {
                                setIdEnEdition(id);
                                setVue("editer");
                            }}
                            onSupprimer={onSupprimerCorpus}
                            onActiverCorpusCustom={onActiverCorpusCustom}
                        />
                    )}
                    {vue === "nouveau" && (
                        <VueNouveau
                            onCreer={handleCreer}
                            validerNom={validerNom}
                        />
                    )}
                    {vue === "editer" && corpusEnEdition && (
                        <VueEditer
                            corpus={corpusEnEdition}
                            nbPropositions={nbPropositions}
                            onAjouter={onAjouterItem}
                            onSupprimer={onSupprimerItem}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

CorpusEditor.propTypes = {
    liste: PropTypes.array.isRequired,
    idCorpusActif: PropTypes.string,
    nbPropositions: PropTypes.number.isRequired,
    onFermer: PropTypes.func.isRequired,
    onCreerCorpus: PropTypes.func.isRequired,
    onSupprimerCorpus: PropTypes.func.isRequired,
    onAjouterItem: PropTypes.func.isRequired,
    onSupprimerItem: PropTypes.func.isRequired,
    validerNom: PropTypes.func.isRequired,
    onActiverCorpusCustom: PropTypes.func.isRequired,
};

CorpusEditor.defaultProps = {
    idCorpusActif: null,
};

export default CorpusEditor;
