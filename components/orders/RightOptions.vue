<template>
  <v-col
    cols="12"
    md="auto"
    class="d-flex flex-column flex-md-row align-start align-md-center"
  >
    <slot name="viewSettings" />

    <slot name="toggleView" />

    <v-btn :disabled="loading" color="primary" nuxt to="/orders/upload">
      Upload Orders
    </v-btn>
  </v-col>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
    },
  },
})
</script>
