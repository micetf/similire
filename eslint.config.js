import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
    js.configs.recommended,
    {
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
        },
        rules: {
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "react/prop-types": "error",
            "no-unused-vars": "error",
            "no-console": "warn",
            "react/react-in-jsx-scope": "off",
        },
        settings: {
            react: { version: "detect" },
        },
    },
];
