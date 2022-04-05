<template>
  <div class="custom-border" />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {},
  setup() {
    return {}
  },
})
</script>
<style lang="scss">
.custom-border {
  border: 1px solid grey;
  border-bottom-width: 0;
}
</style>
