<template>
  <div class="aareguru-widget">
    <!-- Loading State -->
    <span
      v-if="isLoading"
      class="aareguru-loading"
      role="status"
      aria-live="polite"
    >
      <slot name="loading">Loading...</slot>
    </span>

    <!-- Error State -->
    <span
      v-else-if="error"
      class="aareguru-error"
      role="alert"
      aria-live="assertive"
    >
      <slot
        name="error"
        :error="error"
      >
        Error loading data
      </slot>
    </span>

    <!-- Success State -->
    <span
      v-else-if="aareguru"
      class="aareguru-temperature"
      :class="unit"
      role="text"
    >
      <slot :data="aareguru">
        {{ convertedTemperature }}{{ unitSymbol }}
      </slot>
    </span>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'

// Allowed cities for the Aareguru API
const ALLOWED_CITIES = [
  'bern',
  'thun',
  'brienz',
  'interlaken',
  'biel',
  'hagneck'
]

// Props with defaults
const props = defineProps({
  city: {
    type: String,
    default: 'bern',
    validator: (value) => {
      // Define allowed cities inline because the validator runs during component definition,
      // before ALLOWED_CITIES is available in this scope
      const allowedCities = ['bern', 'thun', 'brienz', 'interlaken', 'biel', 'hagneck']
      const isValid = allowedCities.includes(value.toLowerCase())
      if (!isValid) {
        console.warn(
          `[AareGuru] Invalid city "${value}". Allowed cities: ${allowedCities.join(', ')}`
        )
      }
      return isValid
    }
  },
  retryAttempts: {
    type: Number,
    default: 3,
    validator: (value) => value >= 0 && value <= 10
  },
  retryDelay: {
    type: Number,
    default: 1000,
    validator: (value) => value >= 0
  },
  unit: {
    type: String,
    default: 'celsius',
    validator: (value) => ['celsius', 'fahrenheit'].includes(value)
  },
  cacheTimeout: {
    type: Number,
    default: 300000
  },
  autoRefresh: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['loaded', 'error', 'retry'])

// State
const aareguru = ref(null)
const isLoading = ref(true)
const error = ref(null)
const attemptCount = ref(0)
const lastFetchTime = ref(null)
let refreshInterval = null

// API Configuration
const API_BASE = 'https://aareguru.existenz.ch/v2018/current'
const API_PARAMS = 'app=vue.aareguru'
const REQUEST_TIMEOUT = 5000 // 5 seconds

// Temperature conversion constants
const CELSIUS_TO_FAHRENHEIT_MULTIPLIER = 9 / 5
const CELSIUS_TO_FAHRENHEIT_OFFSET = 32

// Computed properties
const normalizedCity = computed(() => props.city.toLowerCase())

const shouldRefetch = computed(() => {
  if (!lastFetchTime.value) return true
  const elapsed = Date.now() - lastFetchTime.value
  return elapsed >= props.cacheTimeout
})

const convertedTemperature = computed(() => {
  if (!aareguru.value?.aare?.temperature) return null

  const celsius = aareguru.value.aare.temperature

  if (props.unit === 'fahrenheit') {
    return (celsius * CELSIUS_TO_FAHRENHEIT_MULTIPLIER + CELSIUS_TO_FAHRENHEIT_OFFSET).toFixed(1)
  }

  return celsius.toFixed(1)
})

const unitSymbol = computed(() => {
  return props.unit === 'fahrenheit' ? '°F' : '°C'
})

// Helper function for delays
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Fetch data with retry logic
async function fetchDataWithRetry() {
  // Check if we should use cached data
  if (!shouldRefetch.value && aareguru.value) {
    console.log('[AareGuru] Using cached data')
    return
  }

  let lastError = null

  for (let attempt = 0; attempt <= props.retryAttempts; attempt++) {
    attemptCount.value = attempt

    try {
      isLoading.value = true
      error.value = null

      const response = await axios.get(
        `${API_BASE}?${API_PARAMS}&city=${normalizedCity.value}`,
        { timeout: REQUEST_TIMEOUT }
      )

      // Validate response structure
      if (!response.data) {
        throw new Error('API response is empty')
      }
      if (!response.data.aare) {
        throw new Error('API response missing "aare" data')
      }
      if (typeof response.data.aare.temperature !== 'number') {
        throw new Error('API response missing or invalid "temperature" field')
      }

      aareguru.value = response.data
      lastFetchTime.value = Date.now()
      isLoading.value = false
      emit('loaded', response.data)
      return // Success - exit retry loop
    } catch (err) {
      lastError = err

      // Don't retry on 4xx errors (client errors)
      if (err.response?.status && err.response.status >= 400 && err.response.status < 500) {
        break
      }

      // If more retries available, wait and emit retry event
      if (attempt < props.retryAttempts) {
        const retryDelay = props.retryDelay * (attempt + 1) // Exponential backoff
        emit('retry', {
          attempt: attempt + 1,
          maxAttempts: props.retryAttempts,
          error: err
        })
        await sleep(retryDelay)
      }
    }
  }

  // All retries failed
  error.value = lastError
  if (lastError) {
    emit('error', lastError)
    console.error('[AareGuru] Error fetching Aare data after retries:', lastError)
  }
  isLoading.value = false
}

// Public method to refresh data
async function refresh() {
  attemptCount.value = 0
  lastFetchTime.value = null // Force refetch
  await fetchDataWithRetry()
}

// Public method to clear cache
function clearCache() {
  aareguru.value = null
  lastFetchTime.value = null
  error.value = null
}

// Watch for city changes
watch(() => props.city, async (newCity, oldCity) => {
  if (newCity !== oldCity) {
    // Clear cache when city changes
    lastFetchTime.value = null
    await fetchDataWithRetry()
  }
})

// Lifecycle hooks
onMounted(async () => {
  await fetchDataWithRetry()

  // Setup auto-refresh if enabled
  if (props.autoRefresh && props.cacheTimeout > 0) {
    refreshInterval = setInterval(() => {
      fetchDataWithRetry()
    }, props.cacheTimeout)
  }
})

onBeforeUnmount(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

// Expose methods for parent components
defineExpose({
  refresh,
  clearCache,
  attemptCount,
  ALLOWED_CITIES
})
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
