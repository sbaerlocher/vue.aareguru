<template>
  <div class="aareguru-widget">
    <!-- Loading State -->
    <span v-if="isLoading" class="aareguru-loading" role="status" aria-live="polite">
      <slot name="loading">Loading...</slot>
    </span>

    <!-- Error State -->
    <span v-else-if="error" class="aareguru-error" role="alert" aria-live="assertive">
      <slot name="error" :error="error"> Error loading data </slot>
    </span>

    <!-- Success State -->
    <span v-else-if="aareguru" class="aareguru-temperature" :class="unit" role="text">
      <slot :data="aareguru"> {{ convertedTemperature }}{{ unitSymbol }} </slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import type { AareData, RetryEvent } from "../types";

// Allowed cities for the Aareguru API
const ALLOWED_CITIES = [
  "bern",
  "thun",
  "brienz",
  "interlaken",
  "biel",
  "hagneck",
  "olten",
  "brugg"
] as const;

type AllowedCity = (typeof ALLOWED_CITIES)[number];

// Props with defaults
const props = withDefaults(
  defineProps<{
    city?: AllowedCity;
    retryAttempts?: number;
    retryDelay?: number;
    unit?: "celsius" | "fahrenheit";
    cacheTimeout?: number;
    autoRefresh?: boolean;
  }>(),
  {
    city: "bern",
    retryAttempts: 3,
    retryDelay: 1000,
    unit: "celsius",
    cacheTimeout: 300000,
    autoRefresh: false
  }
);

// Emits
const emit = defineEmits<{
  loaded: [data: AareData];
  error: [error: Error];
  retry: [payload: RetryEvent];
}>();

// State
const aareguru = ref<AareData | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<Error | null>(null);
const attemptCount = ref<number>(0);
const lastFetchTime = ref<number | null>(null);
const refreshInterval = ref<ReturnType<typeof setInterval> | null>(null);

// API Configuration
const API_BASE = "https://aareguru.existenz.ch/v2018/current";
const API_PARAMS = "app=vue.aareguru";
const REQUEST_TIMEOUT = 5000; // 5 seconds

// Temperature conversion constants
const CELSIUS_TO_FAHRENHEIT_MULTIPLIER = 9 / 5;
const CELSIUS_TO_FAHRENHEIT_OFFSET = 32;

// Computed properties
const normalizedCity = computed(() => props.city.toLowerCase());

const shouldRefetch = computed(() => {
  if (!lastFetchTime.value) return true;
  const elapsed = Date.now() - lastFetchTime.value;
  return elapsed >= props.cacheTimeout;
});

const convertedTemperature = computed(() => {
  if (!aareguru.value?.aare?.temperature) return null;

  const celsius = aareguru.value.aare.temperature;

  if (props.unit === "fahrenheit") {
    return (celsius * CELSIUS_TO_FAHRENHEIT_MULTIPLIER + CELSIUS_TO_FAHRENHEIT_OFFSET).toFixed(1);
  }

  return celsius.toFixed(1);
});

const unitSymbol = computed(() => {
  return props.unit === "fahrenheit" ? "°F" : "°C";
});

// Helper function for delays
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fetch data with retry logic
async function fetchDataWithRetry(): Promise<void> {
  // Check if we should use cached data
  if (!shouldRefetch.value && aareguru.value) {
    return;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= props.retryAttempts; attempt++) {
    attemptCount.value = attempt;

    try {
      isLoading.value = true;
      error.value = null;

      const response = await axios.get(`${API_BASE}?${API_PARAMS}&city=${normalizedCity.value}`, {
        timeout: REQUEST_TIMEOUT
      });

      // Validate response structure
      if (!response.data) {
        throw new Error("API response is empty");
      }
      if (!response.data.aare) {
        throw new Error('API response missing "aare" data');
      }
      if (typeof response.data.aare.temperature !== "number") {
        throw new Error('API response missing or invalid "temperature" field');
      }

      aareguru.value = response.data;
      lastFetchTime.value = Date.now();
      isLoading.value = false;
      emit("loaded", response.data);
      return; // Success - exit retry loop
    } catch (err: unknown) {
      // Convert unknown error to Error instance
      const errorInstance = err instanceof Error ? err : new Error(String(err));
      lastError = errorInstance;

      // Don't retry on 4xx errors (client errors)
      const axiosError = err as { response?: { status?: number } };
      if (
        axiosError.response?.status &&
        axiosError.response.status >= 400 &&
        axiosError.response.status < 500
      ) {
        break;
      }

      // If more retries available, wait and emit retry event
      if (attempt < props.retryAttempts) {
        const retryDelay = props.retryDelay * (attempt + 1); // Exponential backoff
        emit("retry", {
          attempt: attempt + 1,
          maxAttempts: props.retryAttempts,
          error: errorInstance
        });
        await sleep(retryDelay);
      }
    }
  }

  // All retries failed
  error.value = lastError;
  if (lastError) {
    emit("error", lastError);
  }
  isLoading.value = false;
}

// Public method to refresh data
async function refresh(): Promise<void> {
  attemptCount.value = 0;
  lastFetchTime.value = null; // Force refetch
  await fetchDataWithRetry();
}

// Public method to clear cache
function clearCache(): void {
  aareguru.value = null;
  lastFetchTime.value = null;
  error.value = null;
}

// Helper to setup auto-refresh interval
function setupAutoRefresh(): void {
  clearAutoRefresh();
  if (props.autoRefresh && props.cacheTimeout > 0) {
    refreshInterval.value = setInterval(() => {
      fetchDataWithRetry();
    }, props.cacheTimeout);
  }
}

// Helper to clear auto-refresh interval
function clearAutoRefresh(): void {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
    refreshInterval.value = null;
  }
}

// Watch for city changes
watch(
  () => props.city,
  async (newCity, oldCity) => {
    if (newCity !== oldCity) {
      // Clear cache when city changes
      lastFetchTime.value = null;
      await fetchDataWithRetry();
    }
  }
);

// Watch for autoRefresh changes
watch(
  () => props.autoRefresh,
  () => {
    setupAutoRefresh();
  }
);

// Watch for cacheTimeout changes (affects auto-refresh interval)
watch(
  () => props.cacheTimeout,
  () => {
    if (props.autoRefresh) {
      setupAutoRefresh();
    }
  }
);

// Lifecycle hooks
onMounted(async () => {
  await fetchDataWithRetry();
  setupAutoRefresh();
});

onBeforeUnmount(() => {
  clearAutoRefresh();
});

// Expose methods for parent components
defineExpose({
  refresh,
  clearCache,
  attemptCount,
  ALLOWED_CITIES
});
</script>

<style scoped>
.aareguru-widget {
  display: inline-block;
}

.aareguru-loading {
  color: #999;
  font-style: italic;
}

.aareguru-error {
  color: #d32f2f;
}

.aareguru-temperature {
  font-weight: bold;
  color: #1976d2;
}

.aareguru-temperature.celsius {
  color: #1976d2;
}

.aareguru-temperature.fahrenheit {
  color: #f57c00;
}
</style>
