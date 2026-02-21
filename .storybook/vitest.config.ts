import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import path from "node:path";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue(), storybookTest({ configDir: dirname })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../src", import.meta.url))
    }
  },
  test: {
    name: "storybook",
    include: ["../src/**/*.stories.ts"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }]
    },
    setupFiles: ["./vitest.setup.ts"]
  }
});
