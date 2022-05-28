<template>
  <v-row class="fill-height" align-content="center" justify="center">
    <v-col class="text-subtitle-1 text-center" cols="12">
      {{ title }}
    </v-col>

    <v-col cols="6">
      <v-progress-linear color="primary" indeterminate rounded height="6" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'LoadingLinear',
  props: {
    title: {
      type: String,
      required: true,
      default: 'Getting data...',
    },
  },
})
</script>
