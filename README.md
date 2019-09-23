# vue: aareguru

[![Build Status](https://github.com/sbaerlocher/vue.aareguru/workflows/publish/badge.svg)](https://github.com/sbaerlocher/vue.aareguru/actions) [![Build Status](https://github.com/sbaerlocher/vue.aareguru/workflows/test/badge.svg)](https://github.com/sbaerlocher/vue.aareguru/actions) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://sbaerlo.ch/licence) [![npm](https://img.shields.io/npm/v/vue.aareguru)](https://www.npmjs.com/package/vue.aareguru)

## Description

Vue componente shows the Aare temperature from [Aareguru](https://aare.guru).

## Installation

### npm

```bash
npm -i vue.aareguru
```

### yarn

```bash
yarn install vue.aareguru
```

## use

### import

```javascript
import AareGuru from 'vue.aareguru';
```

### component

```javascript
  components: {
    AareGuru
  },
```

### template

```html
<AareGuru class="celsius text-xl" city="thun"></AareGuru>
```

#### option

| props | default | option                                    | description                                                      |
| ----- | ------- | ----------------------------------------- | ---------------------------------------------------------------- |
| city  | bern    | brienz,interlaken,thun,hagneck,biel,brugg | Display of the water temparaturn of different cities on the aare |

## Author

- [Simon Bärlocher](https://sbaerlocher.ch)

## License

This project is under the MIT License. See the [LICENSE](https://sbaerlo.ch/licence) file for the full license text.

## Copyright

(c) 2019, Simon Bärlocher
