// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import pluginVue from 'eslint-plugin-vue'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

export default [{
  ignores: [
    'dist/',
    'dist-demo/',
    'coverage/',
    'node_modules/',
    '**/*.config.js',
    '**/*.config.ts',
    '**/*.config.mts',
    'tests/',
    '**/*.spec.ts',
    '**/*.test.ts',
    '**/*.d.ts',
    '.vite/',
    '.cache/'
  ]
}, ...pluginVue.configs['flat/recommended'], {
  files: ['**/*.vue', '**/*.ts', '**/*.js'],
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    globals: {
      node: true,
      es2020: true
    }
  },
  plugins: {
    '@typescript-eslint': tseslint
  },
  rules: {}
}, ...storybook.configs["flat/recommended"]];
