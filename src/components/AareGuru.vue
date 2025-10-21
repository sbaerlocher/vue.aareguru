<template>
  <span
    v-if="aareguru"
    class="celsius"
  >{{ aareguru.aare.temperature }}°</span>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Props
const props = defineProps({
  city: {
    type: String,
    required: false,
    default: 'bern'
  }
})

// State
const aareguru = ref({ aare: { temperature: '' } })
const api = 'https://aareguru.existenz.ch/v2018/current?app=vue.aareguru'

// Fetch data on mount
onMounted(async () => {
  try {
    const response = await axios.get(`${api}&city=${props.city.toLowerCase()}`)
    aareguru.value = response.data
  } catch (error) {
    console.error('Error fetching Aare data:', error)
  }
})
</script>
