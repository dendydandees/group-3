<template>
  <v-col>
    <v-btn
      v-if="isOnListView"
      :disabled="selectedOrders.length === 0 || loading"
      outlined
      color="primary"
      class="mr-2"
      @click="$emit('doExportOrders')"
    >
      Export Orders
    </v-btn>

    <v-btn
      v-if="isOnListView"
      :disabled="selectedOrders.length === 0 || loading"
      outlined
      color="primary"
      class="mr-2"
      @click="$emit('doDownloadSelectedLabel')"
    >
      Download Labels
    </v-btn>

    <v-btn
      :depressed="isShowFilter"
      :outlined="isShowFilter"
      :disabled="loading"
      color="primary"
      :class="[isOnListView ? 'mr-2' : '']"
      @click="$emit('doShowFilter')"
    >
      Filter
    </v-btn>

    <span v-if="isOnListView" class="subtitle-2 text--secondary">
      {{ selectedOrders.length }} Orders selected
    </span>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { Order } from '~/types/orders'

export default defineComponent({
  props: {
    isOnListView: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
    },
    selectedOrders: {
      type: Array as PropType<Order[]>,
      required: true,
    },
    isShowFilter: {
      type: Boolean,
    },
  },
})
</script>
