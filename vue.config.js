module.exports = {
  // Disable performance hints for library builds
  configureWebpack: {
    performance: {
      hints: false
    },
    // Externalize peer dependencies and runtime dependencies
    externals: {
      vue: {
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue',
        root: 'Vue'
      },
      axios: {
        commonjs: 'axios',
        commonjs2: 'axios',
        amd: 'axios',
        root: 'axios'
      }
    },
    optimization: {
      // Better tree shaking
      usedExports: true,
      sideEffects: false
    }
  },
  css: {
    extract: true
  },
  // Don't transpile to ES5 for modern builds
  transpileDependencies: false
}
