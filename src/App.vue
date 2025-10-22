<template>
  <div id="app">
    <header>
      <h1>🌊 vue.aareguru Demo</h1>
      <p>Live testing of the Aare temperature component</p>
    </header>

    <main>
      <!-- Basic Example -->
      <section class="example">
        <h2>1. Basic Usage (Bern)</h2>
        <AareGuru city="bern" />
      </section>

      <!-- With Different City -->
      <section class="example">
        <h2>2. Different City (Thun)</h2>
        <AareGuru city="thun" />
      </section>

      <!-- With Fahrenheit -->
      <section class="example">
        <h2>3. Fahrenheit Unit</h2>
        <AareGuru
          city="bern"
          unit="fahrenheit"
        />
      </section>

      <!-- With Events -->
      <section class="example">
        <h2>4. With Events</h2>
        <AareGuru
          city="interlaken"
          @loaded="handleLoaded"
          @error="handleError"
          @retry="handleRetry"
        />
        <div
          v-if="eventLog.length"
          class="event-log"
        >
          <h3>Event Log:</h3>
          <ul>
            <li
              v-for="(event, index) in eventLog"
              :key="index"
            >
              <strong>{{ event.type }}:</strong> {{ event.message }}
            </li>
          </ul>
        </div>
      </section>

      <!-- With Custom Slots -->
      <section class="example">
        <h2>5. Custom Slots</h2>
        <AareGuru city="bern">
          <template #loading>
            <span class="custom-loading">⏳ Loading Aare data...</span>
          </template>

          <template #error="{ error }">
            <span class="custom-error">❌ Error: {{ error.message }}</span>
          </template>

          <template #default="{ data }">
            <div class="custom-temp">
              <div class="temp-main">
                {{ data.aare.temperature }}°C
              </div>
              <div class="temp-details">
                <span>Flow: {{ data.aare.flow }} m³/s</span>
                <span>Forecast: {{ data.aare.temperature_prognose }}°C</span>
              </div>
            </div>
          </template>
        </AareGuru>
      </section>

      <!-- With Ref Access -->
      <section class="example">
        <h2>6. With Ref Access (Manual Control)</h2>
        <AareGuru
          ref="aareguru"
          city="biel"
        />
        <div class="controls">
          <button @click="refreshData">
            🔄 Refresh
          </button>
          <button @click="clearCache">
            🗑️ Clear Cache
          </button>
        </div>
      </section>

      <!-- With Auto-Refresh -->
      <section class="example">
        <h2>7. Auto-Refresh (every 10s)</h2>
        <AareGuru
          city="hagneck"
          :auto-refresh="true"
          :cache-timeout="10000"
        />
        <p class="info">
          This will automatically refresh every 10 seconds
        </p>
      </section>

      <!-- With Retry Logic -->
      <section class="example">
        <h2>8. Retry Configuration</h2>
        <AareGuru
          city="brienz"
          :retry-attempts="5"
          :retry-delay="2000"
        />
        <p class="info">
          Configured with 5 retry attempts and 2s delay
        </p>
      </section>

      <!-- City Selector -->
      <section class="example">
        <h2>9. Interactive City Selector</h2>
        <select
          v-model="selectedCity"
          class="city-select"
        >
          <option value="bern">
            Bern
          </option>
          <option value="thun">
            Thun
          </option>
          <option value="brienz">
            Brienz
          </option>
          <option value="interlaken">
            Interlaken
          </option>
          <option value="biel">
            Biel
          </option>
          <option value="hagneck">
            Hagneck
          </option>
        </select>
        <AareGuru :city="selectedCity" />
      </section>
    </main>

    <footer>
      <p>
        Data from <a
          href="https://aare.guru"
          target="_blank"
        >Aareguru API</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AareGuru from './components/AareGuru.vue'

const aareguru = ref(null)
const selectedCity = ref('bern')
const eventLog = ref([])

function handleLoaded(data) {
  console.log('Loaded:', data)
  eventLog.value.push({
    type: 'loaded',
    message: `Temperature: ${data.aare.temperature}°C`
  })
}

function handleError(error) {
  console.error('Error:', error)
  eventLog.value.push({
    type: 'error',
    message: error.message
  })
}

function handleRetry({ attempt, maxAttempts }) {
  console.log(`Retry ${attempt}/${maxAttempts}`)
  eventLog.value.push({
    type: 'retry',
    message: `Attempt ${attempt}/${maxAttempts}`
  })
}

function refreshData() {
  if (aareguru.value) {
    aareguru.value.refresh()
    alert('Data refreshed!')
  }
}

function clearCache() {
  if (aareguru.value) {
    aareguru.value.clearCache()
    alert('Cache cleared!')
  }
}
</script>

<style scoped>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
}

header h1 {
  margin: 0;
  font-size: 2.5em;
}

header p {
  margin: 10px 0 0;
  opacity: 0.9;
}

main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.example {
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.example h2 {
  margin-top: 0;
  font-size: 1.2em;
  color: #333;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.controls {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

button:hover {
  background: #5568d3;
}

button:active {
  transform: scale(0.98);
}

.city-select {
  padding: 8px 12px;
  margin-bottom: 10px;
  border: 2px solid #667eea;
  border-radius: 5px;
  font-size: 14px;
  width: 100%;
  cursor: pointer;
}

.event-log {
  margin-top: 15px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
}

.event-log h3 {
  margin: 0 0 10px;
  font-size: 0.9em;
  color: #666;
}

.event-log ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.event-log li {
  padding: 5px 0;
  font-size: 0.85em;
  border-bottom: 1px solid #ddd;
}

.event-log li:last-child {
  border-bottom: none;
}

.info {
  margin-top: 10px;
  font-size: 0.85em;
  color: #666;
  font-style: italic;
}

.custom-loading {
  color: #999;
  font-style: italic;
}

.custom-error {
  color: #d32f2f;
}

.custom-temp {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.temp-main {
  font-size: 2em;
  font-weight: bold;
  color: #1976d2;
}

.temp-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85em;
  color: #666;
}

footer {
  text-align: center;
  padding: 20px;
  color: #666;
  border-top: 1px solid #e0e0e0;
}

footer a {
  color: #667eea;
  text-decoration: none;
}

footer a:hover {
  text-decoration: underline;
}

/* Component Styling Override */
:deep(.aareguru-widget) {
  display: block;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
  text-align: center;
}

:deep(.aareguru-temperature) {
  font-size: 1.5em;
  font-weight: bold;
  color: #1976d2;
}

:deep(.aareguru-loading) {
  color: #999;
  font-style: italic;
}

:deep(.aareguru-error) {
  color: #d32f2f;
}
</style>
