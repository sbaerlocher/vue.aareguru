import type { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["msw-storybook-addon"],
  framework: {
    name: "@storybook/vue3-vite",
    options: {}
  },
  typescript: {
    check: false
  },
  core: {
    disableTelemetry: true
  },
  staticDirs: ["../public"]
};
export default config;
