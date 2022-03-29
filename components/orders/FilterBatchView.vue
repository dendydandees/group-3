<template>
  <v-row align="center" class="ma-0">
    <v-col cols="12" md="6">
      <v-text-field
        v-model="filterBatch.batchId"
        clearable
        outlined
        dense
        rounded
        single-line
        hide-details
        label="Search by batch code"
        placeholder="Enter your batch code..."
        background-color="white"
        type="search"
        class="input-filter elevation-1"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@nuxtjs/composition-api'
import { FilterBatch } from '~/types/orders'

export default defineComponent({
  props: {
    value: {
      type: Object as PropType<FilterBatch>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const filterBatch = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })

    return {
      filterBatch,
    }
  },
})
</script>
