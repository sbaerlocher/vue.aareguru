# vue.aareguru

[![Build Status](https://github.com/sbaerlocher/vue.aareguru/workflows/publish/badge.svg)](https://github.com/sbaerlocher/vue.aareguru/actions) [![Build Status](https://github.com/sbaerlocher/vue.aareguru/workflows/test/badge.svg)](https://github.com/sbaerlocher/vue.aareguru/actions) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://sbaerlo.ch/licence) [![npm](https://img.shields.io/npm/v/vue.aareguru)](https://www.npmjs.com/package/vue.aareguru)

## Description

A Vue 3 component that displays the current Aare river temperature from [Aareguru](https://aare.guru).

Built with Vue 3.5+ Composition API and modern best practices.

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

### Vue 3 (Composition API with `<script setup>`)

```vue
<script setup>
import AareGuru from 'vue.aareguru'
</script>

<template>
  <AareGuru class="celsius text-xl" city="thun" />
</template>
```

### Vue 3 (Options API)

```vue
<script>
import AareGuru from 'vue.aareguru'

export default {
  components: {
    AareGuru
  }
}
</script>

<template>
  <AareGuru class="celsius text-xl" city="thun" />
</template>
```

### Nuxt 3

```vue
<script setup>
import AareGuru from 'vue.aareguru'
</script>

<template>
  <AareGuru city="bern" />
</template>
```

## Props

| Prop | Type   | Default | Options                                   | Description                                                    |
| ---- | ------ | ------- | ----------------------------------------- | -------------------------------------------------------------- |
| city | String | `bern`  | brienz, interlaken, thun, hagneck, biel, brugg | Display the water temperature of different cities on the Aare  |

## Features

- Built with Vue 3.5+ Composition API
- Modern `<script setup>` syntax
- Async/await for better error handling
- Compatible with Vue 3 and Nuxt 3
- TypeScript ready
- Lightweight and fast

## Author

- [Simon Bärlocher](https://sbaerlocher.ch)

## License

This project is under the MIT License. See the [LICENSE](https://sbaerlo.ch/licence) file for the full license text.

## Copyright

(c) 2019, Simon Bärlocher
