/* eslint-disable vue/one-component-per-file */
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent, h, ref } from 'vue'
import { useCities } from './useCities'
import { useHistory } from './useHistory'
import AareGuru from '../components/AareGuru.vue'
import type { AllowedCity } from '../types'

// Wrapper component for useCities demo
const CitiesDemo = defineComponent({
  name: 'CitiesDemo',
  setup() {
    const { cities, isLoading, error } = useCities()
    const selectedCity = ref<AllowedCity>('bern')

    return () => h('div', { style: 'font-family: sans-serif;' }, [
      h('h3', 'Dynamic City Selector'),

      isLoading.value
        ? h('p', 'Loading cities...')
        : error.value
          ? h('p', { style: 'color: red;' }, `Error: ${error.value.message}`)
          : h('div', [
            h('select', {
              value: selectedCity.value,
              onChange: (e: Event) => {
                selectedCity.value = (e.target as HTMLSelectElement).value as AllowedCity
              },
              style: 'padding: 8px; font-size: 14px; margin-bottom: 16px;'
            }, cities.value.map(city =>
              h('option', { key: city.city, value: city.city }, `${city.name} (${city.longname})`)
            )),

            h('div', { style: 'margin-top: 16px;' }, [
              h(AareGuru, { city: selectedCity.value })
            ]),

            h('details', { style: 'margin-top: 16px;' }, [
              h('summary', 'Raw City Data'),
              h('pre', {
                style: 'background: #f5f5f5; padding: 12px; border-radius: 4px; font-size: 12px; overflow: auto;'
              }, JSON.stringify(cities.value, null, 2))
            ])
          ])
    ])
  }
})

// Wrapper component for useHistory demo
const HistoryDemo = defineComponent({
  name: 'HistoryDemo',
  setup() {
    const city = ref<AllowedCity>('bern')
    const { data, isLoading, error, fetch } = useHistory(city.value)

    // Fetch on mount
    fetch('yesterday', 'now')

    return () => h('div', { style: 'font-family: sans-serif;' }, [
      h('h3', 'Historical Data (Last 24h)'),
      h('p', { style: 'color: #666; font-size: 14px;' }, `City: ${city.value}`),

      h('button', {
        onClick: () => fetch('yesterday', 'now'),
        style: 'padding: 8px 16px; margin-bottom: 16px; cursor: pointer;'
      }, 'Refresh'),

      isLoading.value
        ? h('p', 'Loading history...')
        : error.value
          ? h('p', { style: 'color: red;' }, `Error: ${error.value.message}`)
          : data.value
            ? h('div', [
              h('div', {
                style: 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px;'
              }, [
                h('div', {
                  style: 'padding: 16px; background: #e3f2fd; border-radius: 8px;'
                }, [
                  h('div', { style: 'font-size: 12px; color: #666;' }, 'Temperature Readings'),
                  h('div', { style: 'font-size: 24px; font-weight: bold; color: #1976d2;' },
                    data.value.temperature.length.toString()
                  )
                ]),
                h('div', {
                  style: 'padding: 16px; background: #e8f5e9; border-radius: 8px;'
                }, [
                  h('div', { style: 'font-size: 12px; color: #666;' }, 'Flow Readings'),
                  h('div', { style: 'font-size: 24px; font-weight: bold; color: #388e3c;' },
                    data.value.flow.length.toString()
                  )
                ])
              ]),

              // Simple chart using CSS
              h('div', { style: 'margin-top: 16px;' }, [
                h('h4', 'Temperature (last 24h)'),
                h('div', {
                  style: 'display: flex; align-items: end; gap: 2px; height: 100px; background: #f5f5f5; padding: 8px; border-radius: 4px;'
                }, data.value.temperature.slice(-50).map((point, i) => {
                  const min = Math.min(...data.value!.temperature.map(p => p.value))
                  const max = Math.max(...data.value!.temperature.map(p => p.value))
                  const height = ((point.value - min) / (max - min)) * 80 + 10
                  return h('div', {
                    key: i,
                    style: `flex: 1; background: #1976d2; height: ${height}px; border-radius: 2px;`,
                    title: `${point.value.toFixed(1)}°C`
                  })
                }))
              ]),

              h('details', { style: 'margin-top: 16px;' }, [
                h('summary', 'Raw Data (first 10 points)'),
                h('pre', {
                  style: 'background: #f5f5f5; padding: 12px; border-radius: 4px; font-size: 12px; overflow: auto;'
                }, JSON.stringify({
                  ...data.value,
                  temperature: data.value.temperature.slice(0, 10),
                  flow: data.value.flow.slice(0, 10)
                }, null, 2))
              ])
            ])
            : h('p', 'No data')
    ])
  }
})

const meta: Meta = {
  title: 'Composables',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Composables

vue.aareguru exports two composables for advanced use cases:

### useCities()
Fetches the list of all available cities from the Aareguru API.

\`\`\`typescript
import { useCities } from 'vue.aareguru'

const { cities, isLoading, error, refresh } = useCities()
\`\`\`

### useHistory(city)
Fetches historical temperature and flow data for a specific city.

\`\`\`typescript
import { useHistory } from 'vue.aareguru'

const { data, isLoading, error, fetch } = useHistory('bern')
fetch('yesterday', 'now') // Fetch last 24 hours
\`\`\`
        `
      }
    }
  }
}

export default meta

type Story = StoryObj

/**
 * Demonstrates the useCities composable for dynamically fetching
 * available cities from the API.
 */
export const DynamicCityList: Story = {
  render: () => ({
    components: { CitiesDemo },
    template: '<CitiesDemo />'
  })
}

/**
 * Demonstrates the useHistory composable for fetching historical
 * temperature and flow data.
 */
export const HistoricalData: Story = {
  render: () => ({
    components: { HistoryDemo },
    template: '<HistoryDemo />'
  })
}
