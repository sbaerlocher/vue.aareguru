<template>
  <div id="app">
    <h1>vue.aareguru</h1>
    <p>
      For interactive documentation, run:
      <code>npm run storybook</code>
    </p>
    <hr />
    <h2>Quick Test</h2>
    <AareGuru city="bern" />
  </div>
</template>

<script setup lang="ts">
import AareGuru from "./components/AareGuru.vue";
</script>

<style scoped>
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
}

code {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
}

hr {
  margin: 24px 0;
  border: none;
  border-top: 1px solid #e0e0e0;
}
</style>
