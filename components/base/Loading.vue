<template>
  <div class="d-flex justify-center my-6">
    <v-progress-circular indeterminate :color="color" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'LoadingProgress',
  props: {
    color: {
      type: String as PropType<String>,
      default: 'primary',
    },
  },
})
</script>
