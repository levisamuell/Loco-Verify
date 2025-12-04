import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import nextPlugin from "@next/eslint-plugin-next";
import prettierPlugin from "eslint-plugin-prettier";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "out/**",
    ],

    files: ["**/*.{js,jsx,ts,tsx}"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json",
      },
      globals: {
        React: "readonly",
        console: "readonly",
        process: "readonly", // ✅ fixes 'process is not defined'
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
      "@next/next": nextPlugin,
      prettier: prettierPlugin,
    },

    rules: {
      // ✅ JS base
      ...js.configs.recommended.rules,

      // ✅ TypeScript rules
      ...tsPlugin.configs.recommended.rules,

      // ✅ React + Hooks
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // ✅ Next.js best practices
      ...nextPlugin.configs["core-web-vitals"].rules,

      // ✅ Prettier
      ...prettierPlugin.configs.recommended.rules,

      // ✅ Custom rules
      "no-console": "warn",
      semi: ["error", "always"],
      quotes: ["error", "double"],
    },
  },
];
