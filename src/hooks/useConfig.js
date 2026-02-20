/**
 * Hook de gestion de la configuration enseignant.
 * Persiste typeUnite et nbPropositions dans localStorage via storage.js.
 * modeTni et verrouille sont des états de session uniquement (non persistés).
 *
 * @module hooks/useConfig
 */

import { useState } from "react";
import { NB_PROPOSITIONS_MIN, NB_PROPOSITIONS_MAX } from "@constants";
import { loadConfigFromStorage, saveConfigToStorage } from "@utils/storage";

/**
 * @typedef {Object} Config
 * @property {string}  typeUnite      - Type d'unité linguistique sélectionné
 * @property {number}  nbPropositions - Nombre d'étiquettes proposées (2–8)
 * @property {boolean} modeTni        - Mode TNI activé (non persisté)
 * @property {boolean} verrouille     - Configuration verrouillée (non persisté)
 */

/**
 * @typedef {Object} UseConfigReturn
 * @property {Config}   config                - Configuration courante
 * @property {Function} setTypeUnite          - Change le type d'unité
 * @property {Function} setNbPropositions     - Change le nombre de propositions
 * @property {Function} toggleModeTni         - Bascule le mode TNI
 * @property {Function} toggleVerrouillage    - Bascule le verrouillage
 */

/**
 * Hook de gestion de la configuration enseignant.
 * Initialisation lazy depuis localStorage — aucun useEffect.
 *
 * @returns {UseConfigReturn}
 */
export function useConfig() {
    const [config, setConfig] = useState(() => ({
        ...loadConfigFromStorage(),
        modeTni: false,
        verrouille: false,
    }));

    /**
     * Change le type d'unité et persiste le changement.
     *
     * @param {string} typeUnite - Nouveau type d'unité
     * @returns {void}
     */
    const setTypeUnite = (typeUnite) => {
        const next = { ...config, typeUnite };
        setConfig(next);
        saveConfigToStorage({ typeUnite, nbPropositions: next.nbPropositions });
    };

    /**
     * Change le nombre de propositions en respectant les bornes,
     * et persiste le changement.
     *
     * @param {number} nbPropositions - Nouveau nombre de propositions
     * @returns {void}
     */
    const setNbPropositions = (nbPropositions) => {
        const valeur = Math.min(
            NB_PROPOSITIONS_MAX,
            Math.max(NB_PROPOSITIONS_MIN, nbPropositions)
        );
        const next = { ...config, nbPropositions: valeur };
        setConfig(next);
        saveConfigToStorage({
            typeUnite: next.typeUnite,
            nbPropositions: valeur,
        });
    };

    /**
     * Bascule le mode TNI (non persisté).
     *
     * @returns {void}
     */
    const toggleModeTni = () => {
        setConfig((prev) => ({ ...prev, modeTni: !prev.modeTni }));
    };

    /**
     * Bascule le verrouillage de la configuration (non persisté).
     *
     * @returns {void}
     */
    const toggleVerrouillage = () => {
        setConfig((prev) => ({ ...prev, verrouille: !prev.verrouille }));
    };

    return {
        config,
        setTypeUnite,
        setNbPropositions,
        toggleModeTni,
        toggleVerrouillage,
    };
}
