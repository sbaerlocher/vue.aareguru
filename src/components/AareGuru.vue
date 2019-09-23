<template>
  <span v-if="aareguru" class="celsius">{{ aareguru.aare.temperature }}°</span>
</template>

<script>
import axios from "axios";

export default {
  props: {
    city: { type: String, required: false, default: "bern" }
  },
  data() {
    return {
      aareguru: { aare: { temperature: "" } },
      api: "https://aareguru.existenz.ch/v2018/current?app=vue.aareguru"
    };
  },
  mounted() {
    axios
      .get(this.api + "&city=" + this.city.toLowerCase())
      .then(response => (this.aareguru = response.data));
  }
};
</script>
