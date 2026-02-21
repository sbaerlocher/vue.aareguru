// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import pluginVue from "eslint-plugin-vue";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";

export default [
  {
    ignores: [
      "dist/",
      "dist-demo/",
      "coverage/",
      "node_modules/",
      "**/*.config.js",
      "**/*.config.ts",
      "**/*.config.mts",
      "**/*.d.ts",
      ".vite/",
      ".cache/"
    ]
  },
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue", "**/*.ts", "**/*.js"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module"
      },
      globals: {
        node: true,
        es2020: true
      }
    },
    plugins: {
      "@typescript-eslint": tseslint
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "warn",
      "no-debugger": "error"
    }
  },
  {
    files: ["tests/**/*.ts", "**/*.spec.ts", "**/*.test.ts"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module"
      },
      globals: {
        node: true,
        es2020: true,
        describe: true,
        it: true,
        expect: true,
        vi: true,
        beforeEach: true,
        afterEach: true
      }
    },
    plugins: {
      "@typescript-eslint": tseslint
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "no-console": "off"
    }
  },
  ...(storybook.configs?.["flat/recommended"] || [])
];
