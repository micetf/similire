/**
 * Fonctions utilitaires pour la génération aléatoire.
 * SEULE source de Math.random() dans l'application.
 * Toutes les fonctions retournent de nouveaux tableaux sans muter l'original.
 *
 * @module utils/random
 */

/**
 * Mélange un tableau de façon aléatoire (algorithme Fisher-Yates).
 * Ne mute pas le tableau original.
 *
 * @template T
 * @param {T[]} tableau - Le tableau à mélanger
 * @returns {T[]} Nouveau tableau mélangé
 */
export function melangerTableau(tableau) {
    const copie = [...tableau];
    for (let i = copie.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copie[i], copie[j]] = [copie[j], copie[i]];
    }
    return copie;
}

/**
 * Tire un élément aléatoire dans un tableau.
 *
 * @template T
 * @param {T[]} tableau - Le tableau source (non vide)
 * @returns {T} Un élément aléatoire du tableau
 */
export function tirerAleatoire(tableau) {
    return tableau[Math.floor(Math.random() * tableau.length)];
}

/**
 * Insère un élément à une position aléatoire dans un tableau.
 * Ne mute pas le tableau original.
 *
 * @template T
 * @param {T[]} tableau - Le tableau de base
 * @param {T}   element - L'élément à insérer
 * @returns {T[]} Nouveau tableau avec l'élément inséré aléatoirement
 */
export function insererAleatoirement(tableau, element) {
    const copie = [...tableau];
    const position = Math.floor(Math.random() * (copie.length + 1));
    copie.splice(position, 0, element);
    return copie;
}
