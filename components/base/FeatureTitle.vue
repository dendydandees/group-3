<template>
  <div>
    <h2 class="mb-2 title font-weight-medium text-capitalize">
      {{ title }}
    </h2>

    <v-subheader v-if="subtitle" class="pa-0 subtitle-1">
      {{ subtitle }}
    </v-subheader>
  </div>
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
