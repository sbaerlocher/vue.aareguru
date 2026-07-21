import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { playwright } from "@vitest/browser-playwright";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "dist/",
        "dist-demo/",
        "tests/",
        "**/*.spec.ts",
        "**/*.config.*",
        "**/main.ts",
        "**/*.stories.ts"
      ]
    },
    // Two separate projects so the fast happy-dom unit suite and the real
    // browser component suite never share an environment.
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "happy-dom",
          // Unit specs only — keep the browser specs out of this project.
          include: ["tests/unit/**/*.spec.ts"]
        }
      },
      {
        extends: true,
        test: {
          name: "browser",
          // Real-browser component tests that happy-dom cannot cover well
          // (layout, visibility, real reactivity in a DOM).
          include: ["tests/browser/**/*.browser.spec.ts"],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }]
          }
        }
      }
    ]
  }
});
