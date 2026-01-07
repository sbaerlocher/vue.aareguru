import AareGuru from './components/AareGuru.vue'

export default AareGuru

// Export composables
export { useCities, useHistory } from './composables'

// Export types
export type {
  AareData,
  AareGuruProps,
  AareGuruEmits,
  AareGuruExposed,
  WeatherForecast,
  WeatherCurrent,
  WeatherToday,
  WeatherPeriod,
  RetryEvent,
  AllowedCity
} from './types'

export type {
  CityData,
  HistoryData,
  HistoryDataPoint,
  HistoryRange
} from './composables'
