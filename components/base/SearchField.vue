<template>
  <v-text-field
    v-model="search"
    label="Search by order code"
    placeholder="Enter your order code..."
    background-color="white"
    prepend-inner-icon="mdi-magnify"
    type="search"
    clearable
    solo
    flat
    dense
    rounded
    hide-details
  />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    value: {
      type: String as PropType<String>,
      default: null,
    },
  },
  setup(props, { emit }) {
    const search = computed({
      get: () => {
        return props.value
      },
      set: (value) => {
        emit('input', value)
      },
    })

    return {
      search,
    }
  },
})
</script>
