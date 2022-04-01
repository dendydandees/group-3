<template>
  <v-card dark color="primary" elevation="2" :loading="fetchState.pending">
    <template slot="progress">
      <v-progress-linear color="info" height="8" indeterminate />
    </template>

    <BaseLoading v-if="fetchState.pending" color="white" />

    <v-card-text class="body-1 pa-6 grey--text text--lighten-4">
      <v-expand-transition>
        <div v-if="!fetchState.pending">
          <h2 class="font-weight-bold title white--text mb-1">
            Sender Details
          </h2>

          <h3 class="font-weight-bold subtitle-1 secondary--text mb-4">
            {{ order.senderName }}
          </h3>

          <p class="mb-0">
            {{ order.senderNumber }}
          </p>

          <p class="mb-0">
            {{
              $customUtils.setAddress([
                order.senderAddress,
                order.senderCity,
                order.senderProvince,
                order.senderCountry,
                order.senderPostal,
              ])
            }}
          </p>
        </div>
      </v-expand-transition>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import { VuexModuleOrders } from '~/types/orders'
import { VuexModuleIncomingOrders } from '~/types/partnerPortals/incomingOrders'

export default defineComponent({
  props: {
    fetchState: {
      type: Object,
      default: () => ({}),
    },
    isUpcoming: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const storeOrders = useStore<VuexModuleOrders>()
    const storeIncomingOrders = useStore<VuexModuleIncomingOrders>()
    const order = computed(() => {
      return props.isUpcoming
        ? storeIncomingOrders.state.partnerPortals.incomingOrders
            .incomingOrderDetails.order.order
        : storeOrders.state.orders.orderDetails.order
    })

    return {
      order,
    }
  },
})
</script>
