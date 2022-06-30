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
      :disabled="
        selectedOrders.length === 0 || loading || !isLabelExistOnSelected
      "
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
      :disabled="loading || (currentRoute === 'bagging' && !isOnBagsTab.filter)"
      color="primary"
      class="mr-2"
      @click="$emit('doShowFilter')"
    >
      Filter
    </v-btn>

    <span v-if="isOnListView" class="subtitle-2 text--secondary">
      {{ selectedOrders.length }} Orders selected
    </span>

    <span v-if="isOnBagsTab.text" class="subtitle-2 text--secondary">
      {{ selectedOrders.length }} {{ isUnbagged ? 'Unbagged' : 'Bag' }} selected
    </span>
  </v-col>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  useRoute,
  computed,
} from '@nuxtjs/composition-api'
import { Order } from '~/types/orders'

export default defineComponent({
  props: {
    isOnListView: {
      type: Boolean,
    },
    isOnBagsTab: {
      type: Object,
      default: () => ({
        text: false,
        filter: false,
      }),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    selectedOrders: {
      type: Array as PropType<Order[]>,
      required: true,
    },
    isShowFilter: {
      type: Boolean,
    },
    isLabelExistOnSelected: {
      type: Boolean,
      default: false,
    },
    isUnbagged: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    // manage route
    const route = useRoute()
    const currentRoute = computed(() => route.value.name)

    return {
      currentRoute,
    }
  },
})
</script>
