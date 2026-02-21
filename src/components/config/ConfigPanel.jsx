/**
 * Panneau de configuration enseignant.
 *
 * Sprint F : sélecteur de corpus personnalisé.
 * Quand un corpus custom est actif, les boutons de type sont désactivés
 * (le type est défini par le corpus).
 *
 * @module components/config/ConfigPanel
 */

import PropTypes from "prop-types";
import { Lock, Monitor } from "lucide-react";
import {
    TYPES_UNITE,
    LABELS_TYPES_UNITE,
    POLICES_DISPONIBLES,
    DELAIS_FLUIDITE,
    LABELS_UNITE_FLUIDITE,
} from "@constants";

// ─── Constantes locales ───────────────────────────────────────────────────────

const ICONE_FLUIDITE = { 3000: "⚡", 6000: "⏱", 9000: "🐢" };

function delaiEnDebit(delaiMs) {
    return Math.round(60000 / delaiMs);
}

// ─── Icônes SVG inline ────────────────────────────────────────────────────────

function IconeCadenasOuvert() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
            aria-hidden="true"
        >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 019.9-1" />
        </svg>
    );
}

function IconeCadenas() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
            aria-hidden="true"
        >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
    );
}

// ─── Sous-composants ─────────────────────────────────────────────────────────

function Separateur() {
    return (
        <div
            className="h-8 w-px bg-gray-200 hidden sm:block"
            aria-hidden="true"
        />
    );
}

function BadgeModeFocus() {
    return (
        <span
            className="inline-flex items-center gap-1.5 px-3 py-1
                        bg-orange-100 text-orange-700 border border-orange-300
                        text-sm font-semibold rounded-full select-none"
            title="Mode focus APC actif — corpus ciblé sur les items difficiles"
        >
            <span aria-hidden="true">🎯</span>
            Mode focus
        </span>
    );
}

/**
 * Badge corpus custom actif — affiché dans le sélecteur de type.
 */
function BadgeCorpusCustom({ nom }) {
    return (
        <span
            className="inline-flex items-center gap-1 px-2 py-0.5
                        bg-blue-100 text-blue-700 border border-blue-200
                        text-xs font-medium rounded-full select-none"
            title={`Corpus personnalisé actif : ${nom}`}
        >
            <span aria-hidden="true">✦</span>
            {nom}
        </span>
    );
}

BadgeCorpusCustom.propTypes = { nom: PropTypes.string.isRequired };

// ─── Composant principal ──────────────────────────────────────────────────────

/**
 * @param {Object}   props
 * @param {Object}   props.config
 * @param {Function} props.onTypeUnite
 * @param {Function} props.onNbPropositions
 * @param {Function} props.onToggleModeTni
 * @param {Function} props.onToggleVerrouillage
 * @param {Function} props.onPolice
 * @param {Function} props.onDelaiMaxFluidite
 * @param {Function} props.onDesactiverFocus
 * @param {Array}    props.listeCorpusCustom     - Sprint F
 * @param {Function} props.onActiverCorpusCustom - Sprint F : function(corpus|null)
 */
function ConfigPanel({
    config,
    onTypeUnite,
    onNbPropositions,
    onToggleModeTni,
    onToggleVerrouillage,
    onPolice,
    onDelaiMaxFluidite,
    onDesactiverFocus,
    listeCorpusCustom,
    onActiverCorpusCustom,
}) {
    const {
        typeUnite,
        nbPropositions,
        modeTni,
        verrouille,
        police,
        delaiMaxFluidite,
        modeFocus,
        idCorpusCustom,
    } = config;

    const uniteFluidite = LABELS_UNITE_FLUIDITE[typeUnite] ?? "items/min";
    const corpusActifNom = idCorpusCustom
        ? (listeCorpusCustom.find((c) => c.id === idCorpusCustom)?.nom ?? null)
        : null;

    // ── Mode verrouillé ──────────────────────────────────────────────────────
    if (verrouille) {
        return (
            <div className="flex items-center justify-end w-full px-4 gap-3 py-1">
                {modeFocus && <BadgeModeFocus />}
                {corpusActifNom && <BadgeCorpusCustom nom={corpusActifNom} />}
                <button
                    onClick={onToggleVerrouillage}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Déverrouiller la configuration"
                    aria-label="Déverrouiller la configuration"
                >
                    <IconeCadenas />
                </button>
            </div>
        );
    }

    // ── Mode non verrouillé ──────────────────────────────────────────────────
    return (
        <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-4">
            <div className="flex flex-wrap items-center gap-3 justify-center">
                {/* 1. Type d'unité — désactivé si corpus custom actif */}
                <div className="flex flex-col items-center gap-1">
                    <div
                        className="flex rounded-lg border border-gray-300 overflow-hidden"
                        role="group"
                        aria-label="Type d'unité"
                    >
                        {TYPES_UNITE.map((type) => (
                            <button
                                key={type}
                                onClick={() => {
                                    if (!idCorpusCustom) onTypeUnite(type);
                                }}
                                disabled={!!idCorpusCustom}
                                className={`
                                    px-4 py-2 text-sm font-medium transition-colors
                                    ${
                                        typeUnite === type
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-50"
                                    }
                                    ${idCorpusCustom ? "opacity-50 cursor-not-allowed" : ""}
                                `}
                                aria-pressed={typeUnite === type}
                                title={
                                    idCorpusCustom
                                        ? "Type défini par le corpus personnalisé actif"
                                        : undefined
                                }
                            >
                                {LABELS_TYPES_UNITE[type]}
                            </button>
                        ))}
                    </div>
                    {/* Badge corpus custom sous les boutons de type */}
                    {corpusActifNom && (
                        <BadgeCorpusCustom nom={corpusActifNom} />
                    )}
                </div>

                <Separateur />

                {/* 2. Nombre de propositions */}
                <div
                    className="flex items-center gap-1"
                    role="group"
                    aria-label="Nombre de propositions"
                >
                    <button
                        onClick={() => onNbPropositions(nbPropositions - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg
                                   border border-gray-300 bg-white text-gray-600
                                   hover:bg-gray-50 transition-colors text-lg font-bold
                                   disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={nbPropositions <= 2}
                        aria-label="Moins de propositions"
                    >
                        −
                    </button>
                    <input
                        type="number"
                        value={nbPropositions}
                        onChange={(e) =>
                            onNbPropositions(parseInt(e.target.value, 10))
                        }
                        min={2}
                        max={8}
                        className="w-12 text-center text-sm font-semibold border border-gray-300
                                   rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Nombre de propositions"
                    />
                    <button
                        onClick={() => onNbPropositions(nbPropositions + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg
                                   border border-gray-300 bg-white text-gray-600
                                   hover:bg-gray-50 transition-colors text-lg font-bold
                                   disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={nbPropositions >= 8}
                        aria-label="Plus de propositions"
                    >
                        +
                    </button>
                </div>

                <Separateur />

                {/* 3. Police */}
                <select
                    value={police}
                    onChange={(e) => onPolice(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg
                               bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Police d'apprentissage"
                    title="Choisir la police d'apprentissage"
                >
                    {Object.entries(POLICES_DISPONIBLES).map(([id, def]) => (
                        <option key={id} value={id}>
                            Aa {def.label}
                        </option>
                    ))}
                </select>

                <Separateur />

                {/* 4. Fluidité */}
                <div
                    className="flex rounded-lg border border-gray-300 overflow-hidden"
                    role="group"
                    aria-label="Seuil de fluidité"
                >
                    {DELAIS_FLUIDITE.map((delai) => {
                        const debit = delaiEnDebit(delai);
                        return (
                            <button
                                key={delai}
                                onClick={() => onDelaiMaxFluidite(delai)}
                                className={`px-3 py-2 text-xs font-medium transition-colors
                                    ${
                                        delaiMaxFluidite === delai
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-50"
                                    }`}
                                aria-pressed={delaiMaxFluidite === delai}
                                title={`Seuil : ${debit} ${uniteFluidite}`}
                            >
                                {ICONE_FLUIDITE[delai]} {debit}
                            </button>
                        );
                    })}
                </div>

                <Separateur />

                {/* 5. Corpus personnalisé — Sprint F */}
                {listeCorpusCustom.length > 0 && (
                    <>
                        <select
                            value={idCorpusCustom ?? ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (!val) {
                                    onActiverCorpusCustom(null);
                                } else {
                                    const cc = listeCorpusCustom.find(
                                        (c) => c.id === val
                                    );
                                    if (cc) onActiverCorpusCustom(cc);
                                }
                            }}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg
                                       bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
                                       max-w-[180px]"
                            aria-label="Corpus personnalisé"
                            title="Sélectionner un corpus personnalisé"
                        >
                            <option value="">📚 Corpus natif</option>
                            {listeCorpusCustom.map((cc) => (
                                <option key={cc.id} value={cc.id}>
                                    ✦ {cc.nom}
                                </option>
                            ))}
                        </select>
                        <Separateur />
                    </>
                )}

                {/* 6. Mode TNI */}
                <button
                    onClick={onToggleModeTni}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                                border transition-colors
                                ${
                                    modeTni
                                        ? "bg-indigo-600 text-white border-indigo-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                }`}
                    aria-pressed={modeTni}
                    title="Agrandir pour le tableau numérique interactif"
                >
                    <Monitor size={16} aria-hidden="true" />
                    <span>TNI</span>
                </button>

                {/* 7. Mode focus APC */}
                {modeFocus && (
                    <>
                        <Separateur />
                        <BadgeModeFocus />
                        <button
                            onClick={onDesactiverFocus}
                            className="px-3 py-2 text-sm font-medium rounded-lg
                                       border border-orange-300 text-orange-600
                                       hover:bg-orange-50 transition-colors"
                            title="Revenir au corpus complet"
                        >
                            Désactiver
                        </button>
                    </>
                )}

                {/* 8. Verrouillage */}
                <button
                    onClick={onToggleVerrouillage}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                               bg-white text-gray-700 border border-gray-300 hover:bg-gray-50
                               transition-colors"
                    title="Verrouiller la configuration"
                    aria-label="Verrouiller la configuration"
                >
                    <IconeCadenasOuvert />
                </button>
            </div>
        </div>
    );
}

ConfigPanel.propTypes = {
    config: PropTypes.shape({
        typeUnite: PropTypes.string.isRequired,
        nbPropositions: PropTypes.number.isRequired,
        modeTni: PropTypes.bool.isRequired,
        verrouille: PropTypes.bool.isRequired,
        police: PropTypes.string.isRequired,
        delaiMaxFluidite: PropTypes.number.isRequired,
        modeFocus: PropTypes.bool.isRequired,
        idCorpusCustom: PropTypes.string,
    }).isRequired,
    onTypeUnite: PropTypes.func.isRequired,
    onNbPropositions: PropTypes.func.isRequired,
    onToggleModeTni: PropTypes.func.isRequired,
    onToggleVerrouillage: PropTypes.func.isRequired,
    onPolice: PropTypes.func.isRequired,
    onDelaiMaxFluidite: PropTypes.func.isRequired,
    onDesactiverFocus: PropTypes.func.isRequired,
    listeCorpusCustom: PropTypes.array.isRequired, // Sprint F
    onActiverCorpusCustom: PropTypes.func.isRequired, // Sprint F
};

export default ConfigPanel;
