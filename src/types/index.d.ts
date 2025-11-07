/**
 * Type definitions for vue.aareguru
 */

/**
 * Weather forecast data point
 */
export interface WeatherForecast {
  day: string;
  dayshort: string;
  timestamp: number;
  sy: string;
  syt: string;
  symt: number;
  tx: number;
  tn: number;
  rr: number;
  rrisk: number;
}

/**
 * Weather time period (vormittag, nachmittag, abend)
 */
export interface WeatherPeriod {
  sy: string;
  syt: string;
  symt: number;
  tt: number;
  rr: number;
  rrisk: number;
}

/**
 * Current weather data
 */
export interface WeatherCurrent {
  tt: number;
  rr: number;
  rrreal: number;
  timestamp: number;
  timestring: string;
}

/**
 * Today's weather by time period
 */
export interface WeatherToday {
  v: WeatherPeriod;  // vormittag
  n: WeatherPeriod;  // nachmittag
  a: WeatherPeriod;  // abend
}

/**
 * Aare data from the API
 */
export interface AareData {
  aare: {
    temperature: number;
    temperature_prec: number;
    temperature_text: string;
    temperature_text_short: string;
    flow: number;
    flow_text: string;
    location: string;
    location_long: string;
    forecast2h: number;
    forecast2h_text: string;
    timestamp: number;
    timestring: string;
  };
  weather: {
    current: WeatherCurrent;
    today: WeatherToday;
    forecast: WeatherForecast[];
  };
}

/**
 * Component props for AareGuru
 */
export interface AareGuruProps {
  /**
   * City for which to fetch Aare data
   * @default 'bern'
   */
  city?: string;

  /**
   * Number of retry attempts on API failure
   * @default 3
   */
  retryAttempts?: number;

  /**
   * Base delay between retries in milliseconds (exponential backoff)
   * @default 1000
   */
  retryDelay?: number;

  /**
   * Temperature unit to display
   * @default 'celsius'
   */
  unit?: 'celsius' | 'fahrenheit';

  /**
   * Cache timeout in milliseconds
   * @default 300000 (5 minutes)
   */
  cacheTimeout?: number;

  /**
   * Enable automatic data refresh
   * @default false
   */
  autoRefresh?: boolean;
}

/**
 * Retry event payload
 */
export interface RetryEvent {
  attempt: number;
  maxAttempts: number;
  error: Error;
}

/**
 * Component emits for AareGuru
 */
export interface AareGuruEmits {
  /**
   * Emitted when data is successfully loaded
   */
  (event: 'loaded', data: AareData): void;

  /**
   * Emitted when an error occurs
   */
  (event: 'error', error: Error): void;

  /**
   * Emitted before each retry attempt
   */
  (event: 'retry', payload: RetryEvent): void;
}

/**
 * Exposed methods from the component
 */
export interface AareGuruExposed {
  /**
   * Manually refresh the data
   */
  refresh: () => Promise<void>;

  /**
   * Clear cached data
   */
  clearCache: () => void;

  /**
   * Current retry attempt count
   */
  attemptCount: number;

  /**
   * List of allowed cities
   */
  ALLOWED_CITIES: readonly string[];
}
