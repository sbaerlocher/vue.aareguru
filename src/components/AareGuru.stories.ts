import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AareGuru from './AareGuru.vue'

const meta: Meta<typeof AareGuru> = {
  title: 'Components/AareGuru',
  component: AareGuru,
  tags: ['autodocs'],
  argTypes: {
    city: {
      control: 'select',
      options: ['bern', 'thun', 'brienz', 'interlaken', 'biel', 'hagneck', 'olten', 'brugg'],
      description: 'City for which to display Aare temperature',
      table: {
        defaultValue: { summary: 'bern' }
      }
    },
    unit: {
      control: 'radio',
      options: ['celsius', 'fahrenheit'],
      description: 'Temperature unit',
      table: {
        defaultValue: { summary: 'celsius' }
      }
    },
    retryAttempts: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Number of retry attempts on API failure',
      table: {
        defaultValue: { summary: '3' }
      }
    },
    retryDelay: {
      control: { type: 'number', min: 0, step: 500 },
      description: 'Base delay between retries in milliseconds',
      table: {
        defaultValue: { summary: '1000' }
      }
    },
    cacheTimeout: {
      control: { type: 'number', min: 0, step: 60000 },
      description: 'Cache timeout in milliseconds',
      table: {
        defaultValue: { summary: '300000' }
      }
    },
    autoRefresh: {
      control: 'boolean',
      description: 'Enable automatic data refresh',
      table: {
        defaultValue: { summary: 'false' }
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
}

export default meta
type Story = StoryObj<typeof AareGuru>

/**
 * Basic usage with default settings (Bern, Celsius)
 */
export const Default: Story = {
  args: {
    city: 'bern'
  }
}

/**
 * Display temperature for Thun
 */
export const Thun: Story = {
  args: {
    city: 'thun'
  }
}

/**
 * Display temperature for Interlaken
 */
export const Interlaken: Story = {
  args: {
    city: 'interlaken'
  }
}

/**
 * Display temperature in Fahrenheit
 */
export const Fahrenheit: Story = {
  args: {
    city: 'bern',
    unit: 'fahrenheit'
  }
}

/**
 * Auto-refresh every 10 seconds
 */
export const AutoRefresh: Story = {
  args: {
    city: 'bern',
    autoRefresh: true,
    cacheTimeout: 10000
  },
  parameters: {
    docs: {
      description: {
        story: 'The component will automatically refresh the data every 10 seconds.'
      }
    }
  }
}

/**
 * Custom retry configuration with 5 attempts and 2 second delay
 */
export const CustomRetry: Story = {
  args: {
    city: 'bern',
    retryAttempts: 5,
    retryDelay: 2000
  },
  parameters: {
    docs: {
      description: {
        story: 'Configured with 5 retry attempts and 2 second base delay (exponential backoff).'
      }
    }
  }
}

/**
 * Custom loading slot
 */
export const CustomLoadingSlot: Story = {
  args: {
    city: 'bern'
  },
  render: (args) => ({
    components: { AareGuru },
    setup() {
      return { args }
    },
    template: `
      <AareGuru v-bind="args">
        <template #loading>
          <span style="color: #667eea; font-style: italic;">
            🌊 Loading Aare temperature...
          </span>
        </template>
      </AareGuru>
    `
  })
}

/**
 * Custom default slot with detailed data display
 */
export const CustomDefaultSlot: Story = {
  args: {
    city: 'bern'
  },
  render: (args) => ({
    components: { AareGuru },
    setup() {
      return { args }
    },
    template: `
      <AareGuru v-bind="args">
        <template #default="{ data }">
          <div style="padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white;">
            <div style="font-size: 2em; font-weight: bold;">
              {{ data.aare.temperature }}°C
            </div>
            <div style="margin-top: 8px; opacity: 0.9;">
              📍 {{ data.aare.location_long }}
            </div>
            <div style="margin-top: 4px; opacity: 0.8; font-size: 0.9em;">
              💧 Flow: {{ data.aare.flow }} m³/s
            </div>
            <div style="margin-top: 4px; opacity: 0.8; font-size: 0.9em;">
              🔮 2h Forecast: {{ data.aare.forecast2h }}°C
            </div>
          </div>
        </template>
      </AareGuru>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Using the default slot to create a custom card-style display with additional data.'
      }
    }
  }
}

/**
 * All cities comparison
 */
export const AllCities: Story = {
  render: () => ({
    components: { AareGuru },
    template: `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
        <div v-for="city in ['bern', 'thun', 'brienz', 'interlaken', 'biel', 'hagneck', 'olten', 'brugg']" :key="city"
             style="padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; text-align: center;">
          <div style="font-weight: bold; margin-bottom: 8px; text-transform: capitalize;">{{ city }}</div>
          <AareGuru :city="city" />
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of temperatures across all 8 supported cities along the Aare river.'
      }
    }
  }
}
