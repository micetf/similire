/**
 * Hook de gestion des corpus personnalisés.
 *
 * Responsabilités :
 * - CRUD : créer, supprimer, ajouter/supprimer des items
 * - Validation : valeur unique, non vide, limite 50 items
 * - Persistance : toutes les mutations passent par storage.js
 * - Exposition : format CorpusCustomExpose avec items calculés (distracteurs auto)
 *
 * Format stocké (localStorage) :
 *   CorpusCustomStocke[] = { id, nom, typeUnite, valeurs: string[] }
 *
 * Format exposé :
 *   CorpusCustomExpose[] = { id, nom, typeUnite, items: CorpusItem[] }
 *   où chaque CorpusItem.distracteurs = ids de tous les autres items du corpus.
 *
 * @module hooks/useCorpusCustom
 */

import { useState, useCallback } from "react";
import {
    NB_ITEMS_MAX_CORPUS_CUSTOM,
    NB_CORPUS_CUSTOM_MAX,
    NOM_CORPUS_MAX_CHARS,
    TYPES_UNITE,
} from "@constants";
import {
    loadCorpusCustomFromStorage,
    saveCorpusCustomToStorage,
} from "@utils/storage";

// ─── Conversion stocké → exposé ───────────────────────────────────────────────

/**
 * Convertit un corpus stocké (valeurs brutes) en corpus exposé (items calculés).
 * Chaque item reçoit comme distracteurs les ids de tous les autres items.
 *
 * @param {{ id: string, nom: string, typeUnite: string, valeurs: string[] }} stocke
 * @returns {{ id: string, nom: string, typeUnite: string, items: Array<{id:string, valeur:string, distracteurs:string[]}> }}
 */
function stockeVersExpose(stocke) {
    const items = stocke.valeurs.map((v) => ({
        id: v.toLowerCase().trim(),
        valeur: v,
        distracteurs: stocke.valeurs
            .filter((a) => a !== v)
            .map((a) => a.toLowerCase().trim()),
    }));
    return {
        id: stocke.id,
        nom: stocke.nom,
        typeUnite: stocke.typeUnite,
        items,
    };
}

/**
 * Convertit un corpus exposé en corpus stocké (supprime les items calculés).
 *
 * @param {{ id: string, nom: string, typeUnite: string, items: Array<{valeur:string}> }} expose
 * @returns {{ id: string, nom: string, typeUnite: string, valeurs: string[] }}
 */
function exposeVersStocke(expose) {
    return {
        id: expose.id,
        nom: expose.nom,
        typeUnite: expose.typeUnite,
        valeurs: expose.items.map((i) => i.valeur),
    };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * @typedef {{ id: string, nom: string, typeUnite: string, items: Array<{id:string, valeur:string, distracteurs:string[]}> }} CorpusCustomExpose
 */

/**
 * Hook de gestion des corpus personnalisés.
 *
 * @returns {{
 *   liste: CorpusCustomExpose[],
 *   creerCorpus: function(string, string): string,
 *   supprimerCorpus: function(string): void,
 *   ajouterItem: function(string, string): string|null,
 *   supprimerItem: function(string, string): void,
 *   validerNom: function(string): string|null,
 *   validerValeur: function(string, string): string|null,
 * }}
 */
export function useCorpusCustom() {
    const [liste, setListe] = useState(() =>
        loadCorpusCustomFromStorage().map(stockeVersExpose)
    );

    // ── Mutations ────────────────────────────────────────────────────────────

    /**
     * Crée un nouveau corpus vide et le persiste.
     * Retourne l'id du corpus créé.
     *
     * @param {string} nom - Nom du corpus (max NOM_CORPUS_MAX_CHARS chars)
     * @param {string} typeUnite - Type d'unité ('lettre'|'syllabe'|'mot')
     * @returns {string} Id du nouveau corpus
     */
    const creerCorpus = useCallback(
        (nom, typeUnite) => {
            const id = String(Date.now());
            if (!TYPES_UNITE.includes(typeUnite)) return "";
            const nouveau = { id, nom: nom.trim(), typeUnite, items: [] };
            const nouvelleListe = [...liste, nouveau];
            setListe(nouvelleListe);
            saveCorpusCustomToStorage(nouvelleListe.map(exposeVersStocke));
            return id;
        },
        [liste]
    );

    /**
     * Supprime un corpus par son id.
     *
     * @param {string} idCorpus
     */
    const supprimerCorpus = useCallback(
        (idCorpus) => {
            const nouvelleListe = liste.filter((cc) => cc.id !== idCorpus);
            setListe(nouvelleListe);
            saveCorpusCustomToStorage(nouvelleListe.map(exposeVersStocke));
        },
        [liste]
    );

    /**
     * Ajoute un item à un corpus existant.
     * Retourne un message d'erreur si la valeur est invalide, null sinon.
     *
     * @param {string} idCorpus
     * @param {string} valeur
     * @returns {string|null} Message d'erreur ou null si OK
     */
    const ajouterItem = useCallback(
        (idCorpus, valeur) => {
            const erreur = validerValeur(valeur, idCorpus);
            if (erreur) return erreur;

            const nouvelleListe = liste.map((cc) => {
                if (cc.id !== idCorpus) return cc;
                const nouvelItem = {
                    id: valeur.toLowerCase().trim(),
                    valeur: valeur.trim(),
                    distracteurs: cc.items.map((i) => i.id),
                };
                // Mise à jour des distracteurs des items existants
                const itemsMisAJour = cc.items.map((item) => ({
                    ...item,
                    distracteurs: [...item.distracteurs, nouvelItem.id],
                }));
                return { ...cc, items: [...itemsMisAJour, nouvelItem] };
            });
            setListe(nouvelleListe);
            saveCorpusCustomToStorage(nouvelleListe.map(exposeVersStocke));
            return null;
        },
        [liste] // eslint-disable-line react-hooks/exhaustive-deps
    );

    /**
     * Supprime un item d'un corpus existant.
     *
     * @param {string} idCorpus
     * @param {string} idItem
     */
    const supprimerItem = useCallback(
        (idCorpus, idItem) => {
            const nouvelleListe = liste.map((cc) => {
                if (cc.id !== idCorpus) return cc;
                const itemsFiltres = cc.items
                    .filter((i) => i.id !== idItem)
                    .map((item) => ({
                        ...item,
                        distracteurs: item.distracteurs.filter(
                            (d) => d !== idItem
                        ),
                    }));
                return { ...cc, items: itemsFiltres };
            });
            setListe(nouvelleListe);
            saveCorpusCustomToStorage(nouvelleListe.map(exposeVersStocke));
        },
        [liste]
    );

    // ── Validation ───────────────────────────────────────────────────────────

    /**
     * Valide le nom d'un nouveau corpus.
     * Retourne un message d'erreur ou null si valide.
     *
     * @param {string} nom
     * @returns {string|null}
     */
    const validerNom = useCallback(
        (nom) => {
            const trimmed = nom.trim();
            if (!trimmed) return "Le nom est obligatoire.";
            if (trimmed.length > NOM_CORPUS_MAX_CHARS)
                return `Le nom ne peut pas dépasser ${NOM_CORPUS_MAX_CHARS} caractères.`;
            if (liste.length >= NB_CORPUS_CUSTOM_MAX)
                return `Vous avez atteint la limite de ${NB_CORPUS_CUSTOM_MAX} corpus.`;
            return null;
        },
        [liste.length]
    );

    /**
     * Valide la valeur d'un item avant ajout.
     * Retourne un message d'erreur ou null si valide.
     *
     * @param {string} valeur - Valeur saisie
     * @param {string} idCorpus - Id du corpus cible
     * @returns {string|null}
     */
    const validerValeur = useCallback(
        (valeur, idCorpus) => {
            const trimmed = valeur.trim();
            if (!trimmed) return "La valeur ne peut pas être vide.";
            const corpus = liste.find((cc) => cc.id === idCorpus);
            if (!corpus) return "Corpus introuvable.";
            if (corpus.items.length >= NB_ITEMS_MAX_CORPUS_CUSTOM)
                return `Ce corpus a atteint la limite de ${NB_ITEMS_MAX_CORPUS_CUSTOM} items.`;
            const doublon = corpus.items.some(
                (i) => i.valeur.toLowerCase() === trimmed.toLowerCase()
            );
            if (doublon) return `"${trimmed}" est déjà dans ce corpus.`;
            return null;
        },
        [liste]
    );

    return {
        liste,
        creerCorpus,
        supprimerCorpus,
        ajouterItem,
        supprimerItem,
        validerNom,
        validerValeur,
    };
}
