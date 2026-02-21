/**
 * Panneau de configuration enseignant.
 *
 * Sprint E : badge "Mode focus" + bouton "Désactiver".
 * Correctif unité fluidité : libellés en items/min.
 * Réorganisation UX : ordre pédagogique → opérationnel
 *   Type d'unité → Nb propositions → Police → Fluidité → TNI → [Focus] → Verrou
 *
 * @module components/config/ConfigPanel
 */

import PropTypes from "prop-types";
import {
    TYPES_UNITE,
    LABELS_TYPES_UNITE,
    NB_PROPOSITIONS_MIN,
    NB_PROPOSITIONS_MAX,
    POLICES_DISPONIBLES,
    DELAIS_FLUIDITE,
    SEUIL_BREVET,
} from "@constants";

// ─── Icônes ──────────────────────────────────────────────────────────────────

function IconeCadenas() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
        >
            <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function IconeCadenasOuvert() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
        >
            <path
                fillRule="evenodd"
                d="M14.5 1A4.5 4.5 0 0010 5.5V9H3a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1.5V5.5a3 3 0 116 0v2.75a.75.75 0 001.5 0V5.5A4.5 4.5 0 0014.5 1z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function IconeEcran() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
        >
            <path
                fillRule="evenodd"
                d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5z"
                clipRule="evenodd"
            />
        </svg>
    );
}

function LabelPolice() {
    return (
        <span className="text-sm font-semibold text-gray-500 select-none">
            Aa
        </span>
    );
}

// ─── Utilitaires ─────────────────────────────────────────────────────────────

/**
 * Labels courts de l'unité pour les boutons de fluidité.
 * Cohérents avec LabelFluidite dans ProgressIndicator et useBrevet.
 */
const LABELS_UNITE_FLUIDITE = {
    lettre: "l/min",
    syllabe: "syl/min",
    mot: "mots/min",
};

/**
 * Convertit un seuil en ms en débit items/min, arrondi.
 * 3000 ms → 20/min | 6000 ms → 10/min | 9000 ms → 7/min
 *
 * @param {number} delaiMs
 * @returns {number}
 */
function delaiEnDebit(delaiMs) {
    return Math.round(60000 / delaiMs);
}

// ─── Séparateur ──────────────────────────────────────────────────────────────

function Separateur() {
    return (
        <div
            className="h-8 w-px bg-gray-200 hidden sm:block"
            aria-hidden="true"
        />
    );
}

// ─── Sous-composants ─────────────────────────────────────────────────────────

/**
 * Badge "Mode focus" — information contextuelle visible en état verrouillé.
 */
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

// ─── Composant principal ──────────────────────────────────────────────────────

/**
 * Panneau de configuration enseignant.
 *
 * Ordre des contrôles — logique pédagogique → opérationnelle :
 *   1. Type d'unité      — "Qu'est-ce qu'on travaille ?"
 *   2. Nb propositions   — "À quel niveau de difficulté ?"
 *   3. Police            — "Avec quelle typographie ?"
 *   4. Fluidité          — "Avec quel critère de réussite ?"
 *   5. TNI               — "Dans quel contexte matériel ?"
 *   6. Mode focus        — état contextuel actif (si activé)
 *   7. Verrouillage      — action finale invariable
 *
 * @param {Object}   props
 * @param {Object}   props.config               - Configuration courante
 * @param {Function} props.onTypeUnite          - Change le type d'unité
 * @param {Function} props.onNbPropositions     - Change le nombre de propositions
 * @param {Function} props.onToggleModeTni      - Bascule le mode TNI
 * @param {Function} props.onToggleVerrouillage - Bascule le verrouillage
 * @param {Function} props.onPolice             - Change la police d'apprentissage
 * @param {Function} props.onDelaiMaxFluidite   - Change le seuil de fluidité
 * @param {Function} props.onDesactiverFocus    - Désactive le mode focus APC
 * @returns {JSX.Element}
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
}) {
    const {
        typeUnite,
        nbPropositions,
        modeTni,
        verrouille,
        police,
        delaiMaxFluidite,
        modeFocus,
    } = config;

    const uniteFluidite = LABELS_UNITE_FLUIDITE[typeUnite] ?? "items/min";

    // ── Mode verrouillé ──────────────────────────────────────────────────────
    // Seuls le cadenas et le badge mode focus sont visibles.
    // Le bouton "Désactiver" est masqué : l'élève ne doit pas pouvoir
    // sortir du mode focus activé par l'enseignant.
    if (verrouille) {
        return (
            <div className="flex items-center justify-end w-full px-4 gap-3 py-1">
                {modeFocus && <BadgeModeFocus />}
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
                {/* 1. Type d'unité */}
                <div
                    className="flex rounded-lg border border-gray-300 overflow-hidden"
                    role="group"
                    aria-label="Type d'unité"
                >
                    {TYPES_UNITE.map((type) => (
                        <button
                            key={type}
                            onClick={() => onTypeUnite(type)}
                            className={`
                                px-4 py-2 text-sm font-medium transition-colors
                                ${
                                    typeUnite === type
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-50"
                                }
                            `}
                            aria-pressed={typeUnite === type}
                        >
                            {LABELS_TYPES_UNITE[type]}
                        </button>
                    ))}
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
                        disabled={nbPropositions <= NB_PROPOSITIONS_MIN}
                        className="w-8 h-8 flex items-center justify-center rounded-lg
                                   border border-gray-300 text-gray-600
                                   hover:bg-gray-50 disabled:opacity-40
                                   disabled:cursor-not-allowed transition-colors
                                   text-lg font-medium"
                        aria-label="Diminuer le nombre de propositions"
                    >
                        −
                    </button>
                    <input
                        type="number"
                        value={nbPropositions}
                        min={NB_PROPOSITIONS_MIN}
                        max={NB_PROPOSITIONS_MAX}
                        onChange={(e) =>
                            onNbPropositions(parseInt(e.target.value, 10))
                        }
                        className="w-12 text-center text-sm font-semibold
                                   border border-gray-300 rounded-lg py-1.5
                                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Nombre de propositions"
                    />
                    <button
                        onClick={() => onNbPropositions(nbPropositions + 1)}
                        disabled={nbPropositions >= NB_PROPOSITIONS_MAX}
                        className="w-8 h-8 flex items-center justify-center rounded-lg
                                   border border-gray-300 text-gray-600
                                   hover:bg-gray-50 disabled:opacity-40
                                   disabled:cursor-not-allowed transition-colors
                                   text-lg font-medium"
                        aria-label="Augmenter le nombre de propositions"
                    >
                        +
                    </button>
                </div>

                <Separateur />

                {/* 3. Police d'apprentissage */}
                <div className="flex items-center gap-2">
                    <LabelPolice />
                    <select
                        value={police}
                        onChange={(e) => onPolice(e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg
                                   py-1.5 px-2 focus:outline-none
                                   focus:ring-2 focus:ring-blue-500 bg-white"
                        aria-label="Police d'apprentissage"
                    >
                        {Object.entries(POLICES_DISPONIBLES).map(
                            ([id, def]) => (
                                <option key={id} value={id}>
                                    {def.label}
                                </option>
                            )
                        )}
                    </select>
                </div>

                <Separateur />

                {/* 4. Seuil de fluidité — en items/min (référence fluence lecture)
                    Ordre : du plus accessible (7/min) au plus exigeant (20/min)
                    correspondant à 90s → 60s → 30s pour 10 réponses */}
                <div
                    className="flex rounded-lg border border-gray-300 overflow-hidden"
                    role="group"
                    aria-label={`Seuil de fluidité en ${uniteFluidite}`}
                >
                    {DELAIS_FLUIDITE.slice()
                        .sort((a, b) => b - a)
                        .map((delai) => {
                            const debit = delaiEnDebit(delai);
                            const secondesTotales =
                                (delai / 1000) * SEUIL_BREVET;
                            return (
                                <button
                                    key={delai}
                                    onClick={() => onDelaiMaxFluidite(delai)}
                                    className={`
                                        px-3 py-2 text-sm font-medium transition-colors
                                        ${
                                            delaiMaxFluidite === delai
                                                ? "bg-blue-600 text-white"
                                                : "bg-white text-gray-600 hover:bg-gray-50"
                                        }
                                    `}
                                    aria-pressed={delaiMaxFluidite === delai}
                                    title={`${debit} ${uniteFluidite} — 10 réponses en moins de ${secondesTotales}s`}
                                >
                                    {debit} {uniteFluidite}
                                </button>
                            );
                        })}
                </div>

                <Separateur />

                {/* 5. Mode TNI */}
                <button
                    onClick={onToggleModeTni}
                    className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                        border transition-colors
                        ${
                            modeTni
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }
                    `}
                    aria-pressed={modeTni}
                    title="Agrandir pour le tableau numérique interactif"
                >
                    <IconeEcran />
                    <span>TNI</span>
                </button>

                {/* 6. Mode focus (si actif) — état contextuel, côté droit avant verrou */}
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

                {/* 7. Verrouillage — toujours en dernier */}
                <button
                    onClick={onToggleVerrouillage}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                               bg-white text-gray-700 border border-gray-300 hover:bg-gray-50
                               transition-colors"
                    title="Verrouiller la configuration (masquer ce panneau)"
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
    }).isRequired,
    onTypeUnite: PropTypes.func.isRequired,
    onNbPropositions: PropTypes.func.isRequired,
    onToggleModeTni: PropTypes.func.isRequired,
    onToggleVerrouillage: PropTypes.func.isRequired,
    onPolice: PropTypes.func.isRequired,
    onDelaiMaxFluidite: PropTypes.func.isRequired,
    onDesactiverFocus: PropTypes.func.isRequired,
};

export default ConfigPanel;
