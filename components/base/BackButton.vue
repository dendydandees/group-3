<template>
  <v-row align="center">
    <v-col cols="12">
      <v-btn text small @click="$emit('doBackTo')">
        <v-icon left dark tite elevation="0"> mdi-arrow-left-thin </v-icon>
        {{ text }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    text: {
      type: String,
      default: 'Back',
    },
  },
})
</script>
