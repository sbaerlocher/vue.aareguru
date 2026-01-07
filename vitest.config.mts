import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['tests/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: ['node_modules/', 'dist/', 'dist-demo/', 'tests/', '**/*.spec.ts', '**/*.config.*', '**/main.js', '**/*.stories.ts']
    },
    // Storybook browser tests (requires Playwright)
    browser: {
      enabled: true,
      headless: true,
      provider: 'playwright',
      instances: [{ browser: 'chromium' }]
    },
    setupFiles: ['.storybook/vitest.setup.ts']
  },
  // Storybook plugin for story testing
  projects: [
    {
      extends: true,
      plugins: [
        storybookTest({ configDir: path.join(dirname, '.storybook') })
      ],
      test: {
        name: 'storybook',
        include: ['src/**/*.stories.ts']
      }
    }
  ]
});
