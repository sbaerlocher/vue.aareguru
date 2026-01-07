import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  // Unit tests - run in happy-dom (fast, no browser needed)
  {
    test: {
      name: 'unit',
      include: ['tests/**/*.spec.ts'],
      environment: 'happy-dom',
      globals: true
    }
  },
  // Storybook browser tests - run in real browser with Playwright
  '.storybook/vitest.config.ts'
]);
