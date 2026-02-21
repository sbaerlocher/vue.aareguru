import { ref, readonly } from "vue";
import axios from "axios";

/**
 * City data from the Aareguru API
 */
export interface CityData {
  city: string;
  name: string;
  longname: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  aare: number;
  aare_prec: number;
  forecast: boolean;
}

/**
 * Composable to fetch available cities from the Aareguru API
 *
 * @example
 * ```vue
 * <script setup>
 * import { useCities } from 'vue.aareguru'
 *
 * const { cities, isLoading, error, refresh } = useCities()
 * </script>
 *
 * <template>
 *   <select v-if="!isLoading">
 *     <option v-for="city in cities" :key="city.city" :value="city.city">
 *       {{ city.name }} ({{ city.longname }})
 *     </option>
 *   </select>
 * </template>
 * ```
 */
export function useCities() {
  const cities = ref<CityData[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const API_URL = "https://aareguru.existenz.ch/v2018/cities?app=vue.aareguru";

  async function fetchCities(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await axios.get(API_URL, { timeout: 5000 });

      if (Array.isArray(response.data)) {
        cities.value = response.data.map((city: Record<string, unknown>) => {
          const coords = city["coordinates"] as { lat: number; lon: number } | undefined;
          return {
            city: city["city"] as string,
            name: city["name"] as string,
            longname: city["longname"] as string,
            coordinates: {
              lat: coords?.lat ?? 0,
              lon: coords?.lon ?? 0
            },
            aare: city["aare"] as number,
            aare_prec: city["aare_prec"] as number,
            forecast: city["forecast"] as boolean
          };
        });
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err : new Error(String(err));
    } finally {
      isLoading.value = false;
    }
  }

  // Fetch cities on first use
  fetchCities();

  return {
    cities: readonly(cities),
    isLoading: readonly(isLoading),
    error: readonly(error),
    refresh: fetchCities
  };
}
