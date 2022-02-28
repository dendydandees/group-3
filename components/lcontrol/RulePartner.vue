<template>
  <div
    class="custom-rule"
  >
    <div>
      Primary
    </div>
    <div>
      <div></div>
      <div>
        <LcontrolDropdownCustom
          :title="'tes'"
          :placeholder="'Country'"
          :data="[]"
          class="pb-3"
        />
      </div>
    </div>
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
  .custom-rule{

  }
</style>
