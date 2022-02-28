<template>
  <div
    class="custom-border"
  >
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useFetch,
  useStore,
  reactive,
  watch,
  ref,
  useMeta,
  useRouter,
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
  },
  setup(props, {emit}) {
    return {
    }
  },
})
</script>
<style lang="scss">
  .custom-border{
    border: 1px solid grey;
    border-bottom-width: 0;
  }
</style>
