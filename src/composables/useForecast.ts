import { ref, readonly } from "vue";
import axios from "axios";
import type { AllowedCity, WeatherForecast, WeatherToday } from "../types";

/**
 * Forecast data from the Aareguru API
 */
export interface ForecastData {
  city: string;
  /**
   * Today's weather split into time periods (vormittag, nachmittag, abend)
   */
  today: WeatherToday | null;
  /**
   * Multi-day weather forecast
   */
  forecast: WeatherForecast[];
}

/**
 * Composable to fetch the weather forecast from the Aareguru API.
 *
 * The Aareguru `current` endpoint returns a `weather.forecast` array with one
 * entry per upcoming day. This composable exposes that forecast (plus the
 * intra-day `today` breakdown) for swim-planner style apps.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useForecast } from 'vue.aareguru'
 *
 * const { data, isLoading, error, fetch } = useForecast('bern')
 *
 * fetch()
 * </script>
 *
 * <template>
 *   <ul v-if="data">
 *     <li v-for="day in data.forecast" :key="day.timestamp">
 *       {{ day.dayshort }}: {{ day.tn }}–{{ day.tx }}°C
 *     </li>
 *   </ul>
 * </template>
 * ```
 */
export function useForecast(city: AllowedCity) {
  const data = ref<ForecastData | null>(null);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const API_BASE = "https://aareguru.existenz.ch/v2018/current";

  async function fetchForecast(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const url = `${API_BASE}?city=${encodeURIComponent(city)}&app=vue.aareguru`;
      const response = await axios.get(url, { timeout: 10000 });

      const weather = response.data?.weather;

      const forecast: WeatherForecast[] = Array.isArray(weather?.forecast) ? weather.forecast : [];

      const today: WeatherToday | null = weather?.today ?? null;

      data.value = {
        city,
        today,
        forecast
      };
    } catch (err: unknown) {
      error.value = err instanceof Error ? err : new Error(String(err));
      data.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    data: readonly(data),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetch: fetchForecast
  };
}
