<template>
  <v-row align="center">
    <v-col cols="12" sm="8" md="6">
      <h1 class="display-1 font-weight-bold text-capitalize">
        {{ title }}
        <slot name="addition" />
      </h1>

      <v-subheader v-if="subtitle" class="pa-0 subtitle-1">
        {{ subtitle }}
      </v-subheader>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    title: {
      type: String as PropType<String>,
      required: true,
    },
    subtitle: {
      type: String as PropType<String>,
      default: '',
    },
  },
})
</script>
