import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");

export default defineConfig(({ mode }) => {
    const isProd = mode === "production";

    return {
        plugins: [react()],

        base: isProd ? "/similire/" : "/",

        resolve: {
            alias: {
                "@": resolve(__dirname, "./src"),
                "@data": resolve(__dirname, "./src/data"),
                "@hooks": resolve(__dirname, "./src/hooks"),
                "@utils": resolve(__dirname, "./src/utils"),
                "@constants": resolve(__dirname, "./src/constants.js"),
            },
        },

        build: {
            outDir: "dist",
            assetsDir: "assets",
        },

        server: {
            port: 3001,
            open: true,
        },
    };
});
