/**
 * Hook de génération du brevet SiMiLire (Canvas PNG).
 *
 * Sprint F : DonneesBrevet accepte sourceCorpus et nomCorpusCustom.
 * Quand sourceCorpus === 'custom', le libellé du brevet décrit le défi
 * plutôt qu'une compétence générique — intégrité pédagogique préservée.
 *
 * @module hooks/useBrevet
 */

import { useRef, useCallback } from "react";
import { LABELS_TYPES_UNITE, LABELS_UNITE_FLUIDITE } from "@constants";
import {
    dessinerFondBrevet,
    ecrireCentre,
    telechargerCanvasPng,
} from "@utils/canvas";

const BREVET_WIDTH = 1587;
const BREVET_HEIGHT = 1122;

/**
 * @typedef {Object} DonneesBrevet
 * @property {string}           prenom
 * @property {string}           typeUnite
 * @property {number}           nbPropositions
 * @property {number|null}      tempsMoyen
 * @property {'natif'|'custom'} [sourceCorpus]    - Sprint F
 * @property {string}           [nomCorpusCustom] - Sprint F
 */

/**
 * @typedef {Object} UseBrevet
 * @property {React.RefObject<HTMLCanvasElement>} canvasRef
 * @property {function(DonneesBrevet): void}       genererBrevet
 * @property {function(string): void}              telecharger
 */

/** @returns {UseBrevet} */
export function useBrevet() {
    const canvasRef = useRef(null);

    const genererBrevet = useCallback((donnees) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const {
            prenom,
            typeUnite,
            nbPropositions,
            tempsMoyen,
            sourceCorpus = "natif",
            nomCorpusCustom,
        } = donnees;
        const date = new Date().toLocaleDateString("fr-FR");
        const labelType = LABELS_TYPES_UNITE[typeUnite] ?? typeUnite;

        dessinerFondBrevet(ctx, BREVET_WIDTH, BREVET_HEIGHT);

        ecrireCentre(
            ctx,
            "🎓 Brevet SiMiLire",
            180,
            "bold 72px sans-serif",
            "#1d4ed8"
        );

        ctx.strokeStyle = "#93c5fd";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(120, 220);
        ctx.lineTo(BREVET_WIDTH - 120, 220);
        ctx.stroke();

        ecrireCentre(
            ctx,
            prenom || "L'élève",
            340,
            "bold 80px sans-serif",
            "#1e293b"
        );

        // ── Libellé selon la source du corpus ────────────────────────────────
        if (sourceCorpus === "custom" && nomCorpusCustom) {
            ecrireCentre(
                ctx,
                "a relevé le défi",
                460,
                "48px sans-serif",
                "#475569"
            );
            ecrireCentre(
                ctx,
                `« ${nomCorpusCustom} »`,
                540,
                "bold 52px sans-serif",
                "#1d4ed8"
            );
        } else {
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
        }

        ctx.beginPath();
        ctx.moveTo(120, 620);
        ctx.lineTo(BREVET_WIDTH - 120, 620);
        ctx.stroke();

        ecrireCentre(
            ctx,
            `Obtenu le ${date}`,
            710,
            "36px sans-serif",
            "#64748b"
        );

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

        ecrireCentre(
            ctx,
            "micetf.fr — SiMiLire",
            800,
            "italic 32px sans-serif",
            "#94a3b8"
        );
    }, []);

    const telecharger = useCallback((prenom) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        telechargerCanvasPng(canvas, `brevet-similire-${prenom || "eleve"}`);
    }, []);

    return { canvasRef, genererBrevet, telecharger };
}
