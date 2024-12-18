import globals from "globals";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    rules: {
      "react/display-name": "off",
      "no-unused-vars": "warn",
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
    },
  },
  {
    languageOptions: { globals: globals.browser },
  },
];
