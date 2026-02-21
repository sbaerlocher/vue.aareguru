import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDemo = mode === "demo";

  return {
    plugins: [vue()],

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },

    build: isDemo
      ? {
          // Demo build configuration
          outDir: "dist-demo",
          emptyOutDir: true,
          sourcemap: false
        }
      : {
          // Library build configuration
          lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "VueAareGuru",
            fileName: (format) => {
              if (format === "es") return "vue.aareguru.mjs";
              if (format === "cjs") return "vue.aareguru.cjs";
              return "vue.aareguru.js";
            },
            formats: ["es", "cjs", "umd"]
          },
          rollupOptions: {
            // Externalize peer dependencies
            external: ["vue", "axios"],
            output: {
              exports: "named",
              globals: {
                vue: "Vue",
                axios: "axios"
              },
              assetFileNames: (assetInfo): string => {
                if (Array.isArray(assetInfo.names) && assetInfo.names[0] === "style.css") {
                  return "vue.aareguru.css";
                }
                if (Array.isArray(assetInfo.names) && assetInfo.names.length > 0) {
                  return assetInfo.names[0]!;
                }
                return "assets/[name].[ext]";
              }
            }
          },
          cssCodeSplit: false,
          sourcemap: true,
          emptyOutDir: true
        },

    // For development/demo mode
    server: {
      port: 8080
    }
  };
});
