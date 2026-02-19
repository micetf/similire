/**
 * Fonctions utilitaires de rendu Canvas.
 * SEULE source de logique Canvas dans l'application.
 * Utilisé exclusivement par le hook useBrevet.
 *
 * @module utils/canvas
 */

/**
 * Dessine le fond et le cadre décoratif du brevet sur le canvas.
 *
 * @param {CanvasRenderingContext2D} ctx    - Contexte 2D du canvas
 * @param {number}                   width  - Largeur du canvas en px
 * @param {number}                   height - Hauteur du canvas en px
 * @returns {void}
 */
export function dessinerFondBrevet(ctx, width, height) {
    // Fond blanc
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Bordure décorative extérieure
    ctx.strokeStyle = "#1d4ed8";
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Bordure décorative intérieure
    ctx.strokeStyle = "#93c5fd";
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, width - 72, height - 72);
}

/**
 * Écrit un texte centré horizontalement sur le canvas.
 *
 * @param {CanvasRenderingContext2D} ctx     - Contexte 2D du canvas
 * @param {string}                   texte   - Texte à écrire
 * @param {number}                   y       - Position verticale en px
 * @param {string}                   fonte   - Fonte CSS canvas (ex. "bold 48px sans-serif")
 * @param {string}                   couleur - Couleur CSS
 * @returns {void}
 */
export function ecrireCentre(ctx, texte, y, fonte, couleur) {
    ctx.font = fonte;
    ctx.fillStyle = couleur;
    ctx.textAlign = "center";
    ctx.fillText(texte, ctx.canvas.width / 2, y);
}

/**
 * Déclenche le téléchargement d'un canvas au format PNG.
 * Utilise le pattern blob + attribut download pour la compatibilité Safari iOS.
 *
 * @param {HTMLCanvasElement} canvas     - Le canvas à exporter
 * @param {string}            nomFichier - Nom du fichier téléchargé (sans extension)
 * @returns {void}
 */
export function telechargerCanvasPng(canvas, nomFichier) {
    canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const lien = document.createElement("a");
        lien.href = url;
        lien.download = `${nomFichier}.png`;
        lien.click();
        URL.revokeObjectURL(url);
    }, "image/png");
}
