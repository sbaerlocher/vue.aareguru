import type { Preview } from "@storybook/vue3-vite";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "gray", value: "#f8fafc" },
        { name: "dark", value: "#0f172a" }
      ]
    },
    a11y: {
      test: "todo"
    },
    layout: "centered",
    docs: {
      toc: true
    }
  },
  decorators: [
    (story) => ({
      components: { story },
      template:
        "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\"><story /></div>"
    })
  ]
};

export default preview;
