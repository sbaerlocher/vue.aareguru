# vue.aareguru

[![Test Status](https://github.com/sbaerlocher/vue.aareguru/workflows/test/badge.svg)](https://github.com/sbaerlocher/vue.aareguru/actions) [![Release Status](https://github.com/sbaerlocher/vue.aareguru/workflows/release/badge.svg)](https://github.com/sbaerlocher/vue.aareguru/actions) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://sbaerlo.ch/licence) [![npm](https://img.shields.io/npm/v/vue.aareguru)](https://www.npmjs.com/package/vue.aareguru)

## Description

A Vue 3 component that displays the current Aare river temperature from [Aareguru](https://aare.guru).

Built with Vue 3.5+ Composition API, TypeScript, and modern best practices.

## Requirements

- Vue 3.3.0 or higher
- axios 1.0.0 or higher

## Installation

### npm

```bash
npm install vue.aareguru
```

### yarn

```bash
yarn add vue.aareguru
```

### pnpm

```bash
pnpm add vue.aareguru
```

## Usage

### Basic Usage

```vue
<script setup>
import AareGuru from "vue.aareguru";
</script>

<template>
  <AareGuru city="bern" />
</template>
```

### With Temperature Unit

```vue
<template>
  <AareGuru city="thun" unit="fahrenheit" />
</template>
```

### With Events

```vue
<script setup>
import AareGuru from "vue.aareguru";

function handleLoaded(data) {
  console.log("Temperature loaded:", data.aare.temperature);
}

function handleError(error) {
  console.error("Failed to load temperature:", error);
}
</script>

<template>
  <AareGuru city="bern" @loaded="handleLoaded" @error="handleError" />
</template>
```

### With Custom Slots

```vue
<template>
  <AareGuru city="bern">
    <!-- Custom loading state -->
    <template #loading>
      <span>🌊 Loading Aare temperature...</span>
    </template>

    <!-- Custom error state -->
    <template #error="{ error }">
      <span>❌ Failed: {{ error.message }}</span>
    </template>

    <!-- Custom temperature display -->
    <template #default="{ data }">
      <div>
        <strong>{{ data.aare.temperature }}°C</strong>
        <span>Flow: {{ data.aare.flow }} m³/s</span>
      </div>
    </template>
  </AareGuru>
</template>
```

### With Retry Logic

```vue
<template>
  <AareGuru city="bern" :retry-attempts="5" :retry-delay="2000" @retry="handleRetry" />
</template>

<script setup>
function handleRetry({ attempt, maxAttempts }) {
  console.log(`Retry ${attempt}/${maxAttempts}`);
}
</script>
```

### With Auto-Refresh

```vue
<template>
  <AareGuru city="bern" :auto-refresh="true" :cache-timeout="300000" />
</template>
```

### With Ref Access

```vue
<script setup>
import { ref } from "vue";
import AareGuru from "vue.aareguru";

const aareguru = ref(null);

function refreshData() {
  aareguru.value?.refresh();
}

function clearCache() {
  aareguru.value?.clearCache();
}
</script>

<template>
  <div>
    <AareGuru ref="aareguru" city="bern" />
    <button @click="refreshData">Refresh</button>
    <button @click="clearCache">Clear Cache</button>
  </div>
</template>
```

### Options API

```vue
<script>
import AareGuru from "vue.aareguru";

export default {
  components: {
    AareGuru
  }
};
</script>

<template>
  <AareGuru city="thun" />
</template>
```

### Nuxt 3

`AareGuru` fetches its data client-side (in `onMounted`), so it renders
nothing on the server and hydrates on the client — there is no server-side
data fetching to wire up. Wrap it in `<ClientOnly>` to skip the empty SSR
pass and any hydration mismatch warning:

```vue
<script setup>
import AareGuru from "vue.aareguru";
</script>

<template>
  <ClientOnly>
    <AareGuru city="bern" />
    <template #fallback>Lade Aare-Daten…</template>
  </ClientOnly>
</template>
```

A dedicated SSR/Nuxt module (server-side prefetch, `useFetch` integration)
is intentionally **not** provided: this is a self-contained client widget,
and `<ClientOnly>` covers the SSR story without shipping a Nuxt-specific
build. Use the [`useCities`](#composables) / `useHistory` composables
directly if you need data during SSR.

## Props

| Prop            | Type      | Default     | Description                                                                                                                      |
| --------------- | --------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `city`          | `String`  | `'bern'`    | City for which to display Aare temperature. Options: `bern`, `thun`, `brienz`, `interlaken`, `biel`, `hagneck`, `olten`, `brugg` |
| `retryAttempts` | `Number`  | `3`         | Number of retry attempts on API failure (0-10)                                                                                   |
| `retryDelay`    | `Number`  | `1000`      | Base delay between retries in milliseconds (exponential backoff)                                                                 |
| `unit`          | `String`  | `'celsius'` | Temperature unit. Options: `celsius`, `fahrenheit`                                                                               |
| `cacheTimeout`  | `Number`  | `300000`    | Cache timeout in milliseconds (5 minutes)                                                                                        |
| `autoRefresh`   | `Boolean` | `false`     | Enable automatic data refresh                                                                                                    |

## Events

| Event     | Payload                           | Description                              |
| --------- | --------------------------------- | ---------------------------------------- |
| `@loaded` | `AareData`                        | Emitted when data is successfully loaded |
| `@error`  | `Error`                           | Emitted when an error occurs             |
| `@retry`  | `{ attempt, maxAttempts, error }` | Emitted before each retry attempt        |

## Slots

| Slot      | Props                | Description                          |
| --------- | -------------------- | ------------------------------------ |
| `default` | `{ data: AareData }` | Custom rendering of temperature data |
| `loading` | -                    | Custom loading state                 |
| `error`   | `{ error: Error }`   | Custom error state                   |

## Exposed Methods

Access these methods using a template ref:

| Method         | Description               |
| -------------- | ------------------------- |
| `refresh()`    | Manually refresh the data |
| `clearCache()` | Clear cached data         |

## TypeScript

This component is fully typed. Import types:

```typescript
import type { AareData, AareGuruProps, AareGuruEmits } from "vue.aareguru/types";
```

### Available Types

```typescript
interface WeatherCurrent {
  tt: number; // Temperature
  rr: number; // Rain
  rrreal: number;
  timestamp: number;
  timestring: string;
}

interface WeatherPeriod {
  sy: string; // Symbol
  syt: string; // Symbol text
  symt: number; // Symbol type
  tt: number; // Temperature
  rr: number; // Rain
  rrisk: number; // Rain risk
}

interface WeatherToday {
  v: WeatherPeriod; // Vormittag (morning)
  n: WeatherPeriod; // Nachmittag (afternoon)
  a: WeatherPeriod; // Abend (evening)
}

interface WeatherForecast {
  day: string;
  dayshort: string;
  timestamp: number;
  sy: string;
  syt: string;
  symt: number;
  tx: number; // Max temperature
  tn: number; // Min temperature
  rr: number;
  rrisk: number;
}

interface AareData {
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
```

## Features

- ✅ **TypeScript Support** - Full type definitions included
- ✅ **Loading & Error States** - Visual feedback for all states
- ✅ **Retry Logic** - Automatic retries with exponential backoff
- ✅ **Input Validation** - City parameter validation
- ✅ **Caching** - Configurable cache timeout
- ✅ **Auto-Refresh** - Automatic data updates
- ✅ **Temperature Units** - Celsius and Fahrenheit support
- ✅ **Slots** - Customizable rendering
- ✅ **Events** - React to data loading and errors
- ✅ **Accessibility** - ARIA attributes for screen readers
- ✅ **Vue 3 Composition API** - Modern `<script setup>` syntax
- ✅ **Lightweight** - Minimal dependencies
- ✅ **Well-Tested** - 100% test coverage

## Development

### Setup

```bash
git clone https://github.com/sbaerlocher/vue.aareguru.git
cd vue.aareguru
pnpm install
```

### Development Server (Storybook)

```bash
pnpm dev
```

Opens Storybook at `http://localhost:6006` with interactive component documentation.

### Testing

```bash
pnpm test              # Run tests
pnpm test:ui           # Open test UI
pnpm test:coverage     # Generate coverage report
```

### Type Checking

```bash
pnpm typecheck
```

### Build

```bash
pnpm build
```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Documentation

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[AGENTS.md](AGENTS.md)** - AI reference documentation

## API Reference

The component uses the [Aareguru API](https://aareguru.existenz.ch/):

- **Endpoint:** `https://aareguru.existenz.ch/v2018/current`
- **Supported Cities:** bern, thun, brienz, interlaken, biel, hagneck, olten, brugg

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Supports all browsers that Vue 3 supports

## Storybook

Interactive component documentation is available via Storybook:

```bash
pnpm dev          # or: pnpm storybook
```

This opens Storybook at `http://localhost:6006` with:

- Live component playground
- Auto-generated props documentation
- All 8 city variations along the Aare river
- Custom slot examples
- Accessibility testing

Build static Storybook for deployment:

```bash
pnpm build:storybook
```

## Composables

### useCities()

Fetch all available cities dynamically from the API:

```typescript
import { useCities } from "vue.aareguru";

const { cities, isLoading, error, refresh } = useCities();
```

### useHistory(city)

Fetch historical temperature and flow data:

```typescript
import { useHistory } from "vue.aareguru";

const { data, isLoading, error, fetch } = useHistory("bern");

// Fetch last 24 hours
fetch("yesterday", "now");

// Access data
console.log(data.value?.temperature); // Array of { timestamp, value }
console.log(data.value?.flow); // Array of { timestamp, value }
```

### useForecast(city)

Fetch the multi-day weather forecast (and today's intra-day breakdown). Useful
for swim-planner style apps that need more than the current temperature:

```typescript
import { useForecast } from "vue.aareguru";

const { data, isLoading, error, fetch } = useForecast("bern");

await fetch();

// Multi-day forecast: Array of WeatherForecast ({ day, dayshort, tn, tx, ... })
console.log(data.value?.forecast);

// Today split into periods (v = vormittag, n = nachmittag, a = abend)
console.log(data.value?.today?.n.tt);
```

## Roadmap

- [ ] E2E tests with Playwright
- [x] Nuxt usage documented (client-only widget via `<ClientOnly>`; no SSR module by design)

## License

This project is under the MIT License. See the [LICENSE](https://sbaerlo.ch/licence) file for the full license text.

## Author

- [Simon Bärlocher](https://sbaerlocher.ch)

## Copyright

(c) 2019-2025, Simon Bärlocher

## Acknowledgments

- Data provided by [Aareguru](https://aare.guru)
- Built with [Vue 3](https://vuejs.org)
