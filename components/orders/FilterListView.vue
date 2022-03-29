<template>
  <v-row align="center" class="ma-0">
    <v-col cols="12" md="6">
      <v-text-field
        v-model="filterOrder.orderCode"
        clearable
        outlined
        dense
        rounded
        single-line
        hide-details
        label="Search by order code"
        placeholder="Enter your order code..."
        background-color="white"
        type="search"
        class="input-filter elevation-1"
      />
    </v-col>

    <v-col cols="12" md="6">
      <v-text-field
        v-model="filterOrder.batchId"
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
import { FilterOrders } from '~/types/orders'

export default defineComponent({
  props: {
    value: {
      type: Object as PropType<FilterOrders>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const filterOrder = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })

    return {
      filterOrder,
    }
  },
})
</script>
