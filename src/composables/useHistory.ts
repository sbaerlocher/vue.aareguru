import { ref, readonly } from 'vue'
import axios from 'axios'
import type { AllowedCity } from '../types'

/**
 * Single data point in the history
 */
export interface HistoryDataPoint {
  timestamp: number
  value: number
}

/**
 * Historical data from the Aareguru API
 */
export interface HistoryData {
  status: string
  city: string
  startDate: string
  endDate: string
  temperature: HistoryDataPoint[]
  flow: HistoryDataPoint[]
}

/**
 * Time range options for historical data
 */
export type HistoryRange = 'today' | 'yesterday' | 'week' | 'month'

/**
 * Composable to fetch historical data from the Aareguru API
 *
 * @example
 * ```vue
 * <script setup>
 * import { useHistory } from 'vue.aareguru'
 *
 * const { data, isLoading, error, fetch } = useHistory('bern')
 *
 * // Fetch last 24 hours
 * fetch('yesterday', 'now')
 * </script>
 *
 * <template>
 *   <div v-if="data">
 *     <p>{{ data.temperature.length }} temperature readings</p>
 *   </div>
 * </template>
 * ```
 */
export function useHistory(city: AllowedCity) {
  const data = ref<HistoryData | null>(null)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const API_BASE = 'https://aareguru.existenz.ch/v2018/history'

  async function fetchHistory(
    start: string = 'yesterday',
    end: string = 'now'
  ): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const url = `${API_BASE}?city=${city}&start=${start}&end=${end}&app=vue.aareguru`
      const response = await axios.get(url, { timeout: 10000 })

      if (response.data) {
        const rawData = response.data
        const rawDataData = rawData.data || {}

        // Parse temperature data - format is [[timestamp, value], ...]
        const temperature: HistoryDataPoint[] = []
        if (Array.isArray(rawDataData.temperature)) {
          for (const point of rawDataData.temperature) {
            if (Array.isArray(point) && point.length >= 2) {
              temperature.push({
                timestamp: point[0] as number,
                value: point[1] as number
              })
            }
          }
        }

        // Parse flow data - format is [[timestamp, value], ...]
        const flow: HistoryDataPoint[] = []
        if (Array.isArray(rawDataData.flow)) {
          for (const point of rawDataData.flow) {
            if (Array.isArray(point) && point.length >= 2) {
              flow.push({
                timestamp: point[0] as number,
                value: point[1] as number
              })
            }
          }
        }

        data.value = {
          status: rawData.status || 'success',
          city: rawData.city || city,
          startDate: rawData.start || start,
          endDate: rawData.end || end,
          temperature,
          flow
        }
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err : new Error(String(err))
      data.value = null
    } finally {
      isLoading.value = false
    }
  }

  return {
    data: readonly(data),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetch: fetchHistory
  }
}
