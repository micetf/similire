/**
 * Hook de gestion de la configuration enseignant.
 *
 * Ce qui est persisté    : typeUnite, nbPropositions, police, delaiMaxFluidite
 * Ce qui ne l'est pas    : modeTni, verrouille, modeFocus, idCorpusCustom
 *
 * @module hooks/useConfig
 */

import { useState } from "react";
import {
    NB_PROPOSITIONS_MIN,
    NB_PROPOSITIONS_MAX,
    POLICES_DISPONIBLES,
    DELAIS_FLUIDITE,
} from "@constants";
import { loadConfigFromStorage, saveConfigToStorage } from "@utils/storage";

/**
 * @typedef {Object} Config
 * @property {string}      typeUnite        - Type d'unité linguistique
 * @property {number}      nbPropositions   - Nombre d'étiquettes (2–8)
 * @property {boolean}     modeTni          - Mode TNI (non persisté)
 * @property {boolean}     verrouille       - Configuration verrouillée (non persisté)
 * @property {string}      police           - Police d'apprentissage (persisté)
 * @property {number}      delaiMaxFluidite - Seuil fluidité ms (persisté)
 * @property {boolean}     modeFocus        - Mode focus APC (non persisté)
 * @property {string|null} idCorpusCustom   - Id corpus actif (non persisté, Sprint F)
 */

export function useConfig() {
    const [config, setConfig] = useState(() => loadConfigFromStorage());

    const setTypeUnite = (type) => {
        const next = { ...config, typeUnite: type };
        setConfig(next);
        saveConfigToStorage(next);
    };

    const setNbPropositions = (nb) => {
        const clamped = Math.max(
            NB_PROPOSITIONS_MIN,
            Math.min(NB_PROPOSITIONS_MAX, nb)
        );
        const next = { ...config, nbPropositions: clamped };
        setConfig(next);
        saveConfigToStorage(next);
    };

    const toggleModeTni = () => {
        setConfig((prev) => ({ ...prev, modeTni: !prev.modeTni }));
    };

    const toggleVerrouillage = () => {
        setConfig((prev) => ({ ...prev, verrouille: !prev.verrouille }));
    };

    const setPolice = (idPolice) => {
        if (!POLICES_DISPONIBLES[idPolice]) return;
        const next = { ...config, police: idPolice };
        setConfig(next);
        saveConfigToStorage(next);
    };

    const setDelaiMaxFluidite = (delai) => {
        if (!DELAIS_FLUIDITE.includes(delai)) return;
        const next = { ...config, delaiMaxFluidite: delai };
        setConfig(next);
        saveConfigToStorage(next);
    };

    const setModeFocus = (actif) => {
        setConfig((prev) => ({ ...prev, modeFocus: actif }));
    };

    /**
     * Active ou désactive un corpus personnalisé.
     * Non persisté — état de session uniquement.
     * À appeler depuis App.jsx combiné avec setTypeUnite.
     *
     * @param {string|null} id - Id du corpus custom ou null pour désactiver
     */
    const setIdCorpusCustom = (id) => {
        setConfig((prev) => ({ ...prev, idCorpusCustom: id ?? null }));
    };

    /**
     * Active un corpus personnalisé : met à jour typeUnite ET idCorpusCustom
     * en un seul appel setState atomique pour éviter les stale closures.
     * typeUnite est persisté ; idCorpusCustom reste en session uniquement.
     *
     * @param {{ id: string, typeUnite: string }|null} corpus
     */
    const activerCorpusCustom = (corpus) => {
        setConfig((prev) => {
            const next = {
                ...prev,
                typeUnite: corpus ? corpus.typeUnite : prev.typeUnite,
                idCorpusCustom: corpus ? corpus.id : null,
            };
            if (corpus) saveConfigToStorage(next); // persiste typeUnite si changement
            return next;
        });
    };

    return {
        config,
        setTypeUnite,
        setNbPropositions,
        toggleModeTni,
        toggleVerrouillage,
        setPolice,
        setDelaiMaxFluidite,
        setModeFocus,
        setIdCorpusCustom, // Sprint F
        activerCorpusCustom,
    };
}
