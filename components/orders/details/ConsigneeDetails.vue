<template>
  <v-card dark color="primary" elevation="2" :loading="fetchState.pending">
    <template slot="progress">
      <v-progress-linear color="info" height="8" indeterminate />
    </template>

    <v-card-text class="body-1 white--text">
      <h2 class="font-weight-bold title">Consignee Details</h2>

      <v-divider class="grey lighten-4 my-4" />
      <BaseLoading v-if="fetchState.pending" color="white" />

      <v-expand-transition>
        <div v-if="!fetchState.pending">
          <h3 class="font-weight-medium subtitle-1">
            {{ order.consigneeName }}
          </h3>

          <p class="ma-0">
            {{ order.consigneeEmail }}
          </p>

          <p class="mb-4">
            {{ order.consigneeNumber }}
          </p>

          <p class="mb-2">
            {{
              $customUtils.setAddress([
                order.consigneeAddress,
                order.consigneeCity,
                order.consigneeProvince,
                order.consigneeCountry,
                order.consigneePostal,
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
