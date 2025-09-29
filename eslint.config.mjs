// eslint.config.js
import next from "@next/eslint-plugin-next";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import globals from "globals";

const compat = new FlatCompat();

export default [
  js.configs.recommended,
  ...compat.config({
    extends: [
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
    ],
  }),
  {
    plugins: {
      "@next/next": next,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "warn",
    },
    ignores: [".next/", "node_modules/"],
  },
];
