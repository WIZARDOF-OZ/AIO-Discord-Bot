import js from "@eslint/js";
import globals from "globals";

export default [
    {
        ignores: [
            "node_modules/**",
            "coverage/**",
            "dist/**",
            "build/**",
        ],
    },

    js.configs.recommended,

    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",

            globals: {
                ...globals.node,
            },
        },

        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
            "eqeqeq": "error",
            "curly": "error",
            "no-var": "error",
            "prefer-const": "warn",
        },
    },
];