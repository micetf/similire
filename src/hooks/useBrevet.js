/**
 * Hook de génération du brevet SiMiLire.
 * Orchestre le rendu Canvas et le téléchargement PNG.
 * Délègue tout rendu Canvas à utils/canvas.js.
 *
 * @module hooks/useBrevet
 */

import { useRef, useCallback } from "react";
import { LABELS_TYPES_UNITE } from "@constants";
import {
    dessinerFondBrevet,
    ecrireCentre,
    telechargerCanvasPng,
} from "@utils/canvas";

/** Dimensions du brevet — A5 paysage à 96dpi */
const BREVET_WIDTH = 1587;
const BREVET_HEIGHT = 1122;

/**
 * Labels d'unité pour la mention de fluidité sur le brevet.
 * Cohérents avec ProgressIndicator et ConfigPanel.
 */
const LABELS_UNITE_FLUIDITE = {
    lettre: "l/min",
    syllabe: "syl/min",
    mot: "mots/min",
};

/**
 * @typedef {Object} DonneesBrevet
 * @property {string}      prenom         - Prénom de l'élève
 * @property {string}      typeUnite      - Type d'unité travaillé
 * @property {number}      nbPropositions - Nombre de propositions utilisées
 * @property {number|null} tempsMoyen     - Temps moyen par réponse (ms), null si non mesuré
 */

/**
 * @typedef {Object} UseBrevet
 * @property {React.RefObject} canvasRef      - Ref à attacher au canvas caché
 * @property {Function}        genererBrevet  - Génère le brevet sur le canvas
 * @property {Function}        telecharger    - Déclenche le téléchargement PNG
 */

/**
 * Hook de génération du brevet SiMiLire.
 * Toute donnée personnelle reste côté client — aucun serveur impliqué.
 *
 * @returns {UseBrevet}
 */
export function useBrevet() {
    const canvasRef = useRef(null);

    /**
     * Génère le brevet sur le canvas.
     *
     * @param {DonneesBrevet} donnees
     * @returns {void}
     */
    const genererBrevet = useCallback((donnees) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const { prenom, typeUnite, nbPropositions, tempsMoyen } = donnees;
        const date = new Date().toLocaleDateString("fr-FR");
        const labelType = LABELS_TYPES_UNITE[typeUnite] ?? typeUnite;

        // Fond et cadre
        dessinerFondBrevet(ctx, BREVET_WIDTH, BREVET_HEIGHT);

        // Titre
        ecrireCentre(
            ctx,
            "🎓 Brevet SiMiLire",
            180,
            "bold 72px sans-serif",
            "#1d4ed8"
        );

        // Séparateur haut
        ctx.strokeStyle = "#93c5fd";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(120, 220);
        ctx.lineTo(BREVET_WIDTH - 120, 220);
        ctx.stroke();

        // Prénom
        ecrireCentre(
            ctx,
            prenom || "L'élève",
            340,
            "bold 80px sans-serif",
            "#1e293b"
        );

        // Description
        ecrireCentre(
            ctx,
            "est capable de retrouver rapidement une étiquette",
            460,
            "48px sans-serif",
            "#475569"
        );

        ecrireCentre(
            ctx,
            `de type « ${labelType} » parmi ${nbPropositions} propositions`,
            540,
            "48px sans-serif",
            "#475569"
        );

        // Séparateur bas
        ctx.beginPath();
        ctx.moveTo(120, 620);
        ctx.lineTo(BREVET_WIDTH - 120, 620);
        ctx.stroke();

        // Date
        ecrireCentre(
            ctx,
            `Obtenu le ${date}`,
            710,
            "36px sans-serif",
            "#64748b"
        );

        // Fluidité — exprimée en items/min, cohérente avec ProgressIndicator
        if (tempsMoyen !== null) {
            const debit = Math.round(60000 / tempsMoyen);
            const unite = LABELS_UNITE_FLUIDITE[typeUnite] ?? "items/min";
            ecrireCentre(
                ctx,
                `Fluidité : ${debit} ${unite}`,
                760,
                "36px sans-serif",
                "#64748b"
            );
        }

        // Mention
        ecrireCentre(
            ctx,
            "micetf.fr — SiMiLire",
            800,
            "italic 32px sans-serif",
            "#94a3b8"
        );
    }, []);

    /**
     * Déclenche le téléchargement du canvas au format PNG.
     *
     * @param {string} prenom - Prénom de l'élève (pour le nom du fichier)
     * @returns {void}
     */
    const telecharger = useCallback((prenom) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const nomFichier = `brevet-similire-${prenom || "eleve"}`;
        telechargerCanvasPng(canvas, nomFichier);
    }, []);

    return { canvasRef, genererBrevet, telecharger };
}
