import type { Meta, StoryObj } from "@storybook/vue3-vite";
import AareGuru from "./AareGuru.vue";

const meta: Meta<typeof AareGuru> = {
  title: "Components/AareGuru",
  component: AareGuru,
  tags: ["autodocs"],
  argTypes: {
    city: {
      control: "select",
      options: ["bern", "thun", "brienz", "interlaken", "biel", "hagneck", "olten", "brugg"],
      description: "City for which to display Aare temperature",
      table: {
        defaultValue: { summary: "bern" }
      }
    },
    unit: {
      control: "radio",
      options: ["celsius", "fahrenheit"],
      description: "Temperature unit",
      table: {
        defaultValue: { summary: "celsius" }
      }
    },
    retryAttempts: {
      control: { type: "number", min: 0, max: 10 },
      description: "Number of retry attempts on API failure",
      table: {
        defaultValue: { summary: "3" }
      }
    },
    retryDelay: {
      control: { type: "number", min: 0, step: 500 },
      description: "Base delay between retries in milliseconds",
      table: {
        defaultValue: { summary: "1000" }
      }
    },
    cacheTimeout: {
      control: { type: "number", min: 0, step: 60000 },
      description: "Cache timeout in milliseconds",
      table: {
        defaultValue: { summary: "300000" }
      }
    },
    autoRefresh: {
      control: "boolean",
      description: "Enable automatic data refresh",
      table: {
        defaultValue: { summary: "false" }
      }
    }
  },
  parameters: {
    docs: {
      description: {
        component: `
A Vue 3 component that displays the current Aare river temperature from the [Aareguru API](https://aare.guru).

## Features
- Real-time temperature data from Aareguru API
- Support for multiple cities along the Aare river
- Celsius and Fahrenheit units
- Automatic retry with exponential backoff
- Caching to reduce API calls
- Auto-refresh functionality
- Custom slots for loading, error, and default states
- Full TypeScript support
- Accessibility (ARIA attributes)
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof AareGuru>;

/**
 * Basic usage with default settings (Bern, Celsius)
 */
export const Default: Story = {
  args: {
    city: "bern"
  }
};

/**
 * Display temperature for Thun
 */
export const Thun: Story = {
  args: {
    city: "thun"
  }
};

/**
 * Display temperature for Interlaken
 */
export const Interlaken: Story = {
  args: {
    city: "interlaken"
  }
};

/**
 * Display temperature in Fahrenheit
 */
export const Fahrenheit: Story = {
  args: {
    city: "bern",
    unit: "fahrenheit"
  }
};

/**
 * Auto-refresh every 10 seconds
 */
export const AutoRefresh: Story = {
  args: {
    city: "bern",
    autoRefresh: true,
    cacheTimeout: 10000
  },
  parameters: {
    docs: {
      description: {
        story: "The component will automatically refresh the data every 10 seconds."
      }
    }
  }
};

/**
 * Custom retry configuration with 5 attempts and 2 second delay
 */
export const CustomRetry: Story = {
  args: {
    city: "bern",
    retryAttempts: 5,
    retryDelay: 2000
  },
  parameters: {
    docs: {
      description: {
        story: "Configured with 5 retry attempts and 2 second base delay (exponential backoff)."
      }
    }
  }
};

/**
 * Custom loading slot with modern design
 */
export const CustomLoadingSlot: Story = {
  args: {
    city: "bern"
  },
  render: (args) => ({
    components: { AareGuru },
    setup() {
      return { args };
    },
    template: `
      <AareGuru v-bind="args">
        <template #loading>
          <div style="display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 14px; font-weight: 500;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 0 20" opacity="0.75">
                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
              </path>
            </svg>
            <span>Loading temperature...</span>
          </div>
        </template>
      </AareGuru>
    `
  })
};

/**
 * Modern card design with gradient
 */
export const ModernCard: Story = {
  args: {
    city: "bern"
  },
  render: (args) => ({
    components: { AareGuru },
    setup() {
      return { args };
    },
    template: `
      <AareGuru v-bind="args">
        <template #default="{ data }">
          <div style="
            padding: 24px;
            background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
            border-radius: 16px;
            color: white;
            box-shadow: 0 10px 30px rgba(14, 165, 233, 0.2);
            max-width: 300px;
          ">
            <div style="font-size: 14px; font-weight: 500; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
              {{ data.aare.location_long }}
            </div>
            <div style="font-size: 56px; font-weight: 700; line-height: 1; margin-bottom: 16px;">
              {{ data.aare.temperature }}°
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.2);">
              <div>
                <div style="font-size: 11px; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Flow</div>
                <div style="font-size: 18px; font-weight: 600;">{{ data.aare.flow }} m³/s</div>
              </div>
              <div>
                <div style="font-size: 11px; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Forecast</div>
                <div style="font-size: 18px; font-weight: 600;">{{ data.aare.forecast2h }}°C</div>
              </div>
            </div>
          </div>
        </template>
      </AareGuru>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "Modern card design with gradient background and clean typography."
      }
    }
  }
};

/**
 * Minimalist design
 */
export const Minimalist: Story = {
  args: {
    city: "bern"
  },
  render: (args) => ({
    components: { AareGuru },
    setup() {
      return { args };
    },
    template: `
      <AareGuru v-bind="args">
        <template #default="{ data }">
          <div style="
            display: inline-flex;
            align-items: baseline;
            gap: 8px;
            padding: 12px 20px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          ">
            <span style="font-size: 32px; font-weight: 700; color: #0f172a;">
              {{ data.aare.temperature }}°
            </span>
            <span style="font-size: 14px; font-weight: 500; color: #64748b;">
              {{ data.aare.location_long }}
            </span>
          </div>
        </template>
      </AareGuru>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "Clean, minimalist design focused on the temperature."
      }
    }
  }
};

/**
 * All cities comparison
 */
export const AllCities: Story = {
  render: () => ({
    components: { AareGuru },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; max-width: 1200px;">
        <div v-for="city in ['bern', 'thun', 'brienz', 'interlaken', 'biel', 'hagneck', 'olten', 'brugg']" :key="city">
          <AareGuru :city="city">
            <template #default="{ data }">
              <div style="
                padding: 20px;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                transition: all 0.2s;
                cursor: default;
              " @mouseenter="e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'" @mouseleave="e => e.currentTarget.style.boxShadow = 'none'">
                <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                  {{ city }}
                </div>
                <div style="font-size: 36px; font-weight: 700; color: #0f172a;">
                  {{ data.aare.temperature }}°
                </div>
                <div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">
                  {{ data.aare.flow }} m³/s
                </div>
              </div>
            </template>
          </AareGuru>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: "Modern card grid showing all 8 cities along the Aare river."
      }
    }
  }
};
