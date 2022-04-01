<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseBackButton @doBackTo="doBackTo" />

    <v-row align="stretch">
      <v-col cols="12" md="4">
        <v-row align="stretch">
          <!-- Order details -->
          <v-col cols="12">
            <OrderDetails :fetch-state="$fetchState" />
          </v-col>

          <!-- Consignee details -->
          <v-col cols="12">
            <ConsigneeDetails :fetch-state="$fetchState" />
          </v-col>

          <!-- Pickup details -->
          <v-col v-if="isPickupExist" cols="12">
            <PickupDetails :fetch-state="$fetchState" />
          </v-col>

          <!-- Sender details -->
          <v-col v-if="isSenderExist" cols="12">
            <SenderDetails :fetch-state="$fetchState" />
          </v-col>
        </v-row>
      </v-col>

      <!-- Order updates -->
      <v-col cols="12" md="8">
        <UpdatesTimeline :fetch-state="$fetchState" />
      </v-col>
    </v-row>

    <!-- Order items -->
    <v-row no-gutters align="center" class="mt-6">
      <v-col cols="12" class="white pa-3 elevation-2 rounded-xl">
        <OrderItems :fetch-state="$fetchState" />
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useFetch,
  useRoute,
  useRouter,
  useStore,
  useMeta,
} from '@nuxtjs/composition-api'
// Interfaces or types
import { VuexModuleOrders } from '~/types/orders'
// Components
import OrderDetails from '~/components/orders/details/OrderDetails.vue'
import ConsigneeDetails from '~/components/orders/details/ConsigneeDetails.vue'
import PickupDetails from '~/components/orders/details/PickupDetails.vue'
import SenderDetails from '~/components/orders/details/SenderDetails.vue'
import OrderItems from '~/components/orders/details/OrderItems.vue'
import UpdatesTimeline from '~/components/orders/details/UpdatesTimeline.vue'

export default defineComponent({
  name: 'OrderDetailsPages',
  components: {
    OrderDetails,
    ConsigneeDetails,
    PickupDetails,
    SenderDetails,
    OrderItems,
    UpdatesTimeline,
  },
  layout: 'default',
  setup() {
    useMeta({ titleTemplate: '%s | Order Details' })

    // manage route
    const route = useRoute()
    const router = useRouter()
    const storeOrders = useStore<VuexModuleOrders>()
    const id = computed(() => route.value.params.id)
    const doBackTo = () => {
      router.go(-1)
    }

    const isPickupExist = computed(
      () => !!storeOrders.state.orders.orderDetails.order.pickupContactName
    )

    const isSenderExist = computed(
      () => !!storeOrders.state.orders.orderDetails.order.senderName
    )

    useFetch(async () => {
      await storeOrders.dispatch('orders/getOrderDetails', id.value)
    })

    return {
      id,
      doBackTo,
      isPickupExist,
      isSenderExist,
    }
  },
  head: {},
})
</script>
