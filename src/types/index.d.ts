/**
 * Type definitions for vue.aareguru
 */

/**
 * Weather forecast data point
 */
export interface WeatherForecast {
  date: string
  sy: number
  tn: number
  tx: number
}

/**
 * Aare data from the API
 */
export interface AareData {
  aare: {
    temperature: number
    temperature_prognose: number
    flow: number
    flow_prognose: number
  }
  weather: {
    current: number
    today: number
    forecast: WeatherForecast[]
  }
  text: string
  timestamp: number
}

/**
 * Component props for AareGuru
 */
export interface AareGuruProps {
  /**
   * City for which to fetch Aare data
   * @default 'bern'
   */
  city?: string

  /**
   * Number of retry attempts on API failure
   * @default 3
   */
  retryAttempts?: number

  /**
   * Base delay between retries in milliseconds (exponential backoff)
   * @default 1000
   */
  retryDelay?: number

  /**
   * Temperature unit to display
   * @default 'celsius'
   */
  unit?: 'celsius' | 'fahrenheit'

  /**
   * Cache timeout in milliseconds
   * @default 300000 (5 minutes)
   */
  cacheTimeout?: number

  /**
   * Enable automatic data refresh
   * @default false
   */
  autoRefresh?: boolean
}

/**
 * Retry event payload
 */
export interface RetryEvent {
  attempt: number
  maxAttempts: number
  error: Error
}

/**
 * Component emits for AareGuru
 */
export interface AareGuruEmits {
  /**
   * Emitted when data is successfully loaded
   */
  (event: 'loaded', data: AareData): void

  /**
   * Emitted when an error occurs
   */
  (event: 'error', error: Error): void

  /**
   * Emitted before each retry attempt
   */
  (event: 'retry', payload: RetryEvent): void
}

/**
 * Exposed methods from the component
 */
export interface AareGuruExposed {
  /**
   * Manually refresh the data
   */
  refresh: () => Promise<void>

  /**
   * Clear cached data
   */
  clearCache: () => void

  /**
   * Current retry attempt count
   */
  attemptCount: number

  /**
   * List of allowed cities
   */
  ALLOWED_CITIES: readonly string[]
}
