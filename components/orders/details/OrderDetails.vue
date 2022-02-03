<template>
  <v-card dark tile color="primary" elevation="0" :loading="fetchState.pending">
    <template slot="progress">
      <v-progress-linear color="info" height="8" indeterminate />
    </template>

    <v-card-text class="body-1 white--text">
      <h2 class="font-weight-bold title">Order Details</h2>

      <v-divider class="grey lighten-4 my-4" />

      <BaseLoading v-if="fetchState.pending" color="white" />

      <v-expand-transition>
        <div v-if="!fetchState.pending">
          <h3 class="font-weight-medium subtitle-1">
            {{ order.orderCode }}
          </h3>

          <p class="mb-4">
            {{ order.length }} (cm) x {{ order.width }} (cm) x
            {{ order.height }} (cm) &bull; {{ order.weight }}
          </p>

          <v-chip small color="success" class="text-uppercase mb-2 black--text">
            {{ order.paymentType }}
          </v-chip>
        </div>
      </v-expand-transition>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import { VuexModuleOrders } from '~/types/orders'

export default defineComponent({
  props: {
    fetchState: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const store = useStore<VuexModuleOrders>()
    const order = computed(() => store.state.orders.orderDetails.order)

    return {
      order,
    }
  },
})
</script>
