import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
  { rules: {
    "complexity": ["error",
                    {
                      "max": 7,
                      "variant": "modified"
                    }],
    "no-lonely-if": ["error"],
    "no-global-assign": ["error"],
    "no-shadow-restricted-names": ["error"],
    "no-undefined": ["error"],
    "no-unneeded-ternary": ["error"]
  }}
]);
