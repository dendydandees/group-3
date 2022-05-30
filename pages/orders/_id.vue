<template>
  <section class="pa-4 pa-md-10 py-8">
    <v-row>
      <v-col cols="12">
        <v-btn text small class="pa-0 mb-2" @click="doBackTo">
          <v-icon left dark tite elevation="0"> mdi-arrow-left-thin </v-icon>
          Back
        </v-btn>

        <h2 class="headline mb-4 font-weight-bold">ORDERS</h2>

        <v-breadcrumbs
          v-if="detailsOrder.batchId"
          :items="breadCrumbsItems"
          class="pa-0"
        >
          <template #divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>

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
    <!-- Node Calculator items -->
    <div class="mt-6">
      <span class="title">
        Estimated Rate
      </span>
    </div>
    <div
      class="d-flex mb-3"
    >
      <span
        :style="'font-size: 12px; color: #626262'"
      >
        *Actual rate will be reflected on invoice
      </span>
    </div>
    <v-row no-gutters align="center" class="mt-2">
      <v-col cols="12" class="white pa-3 elevation-2 rounded-xl">
        <CalculatorOrderItems :fetch-state="$fetchState" />
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
  ComputedRef,
} from '@nuxtjs/composition-api'
// Interfaces or types
import { VuexModuleOrders } from '~/types/orders'
// Components
import OrderDetails from '~/components/orders/details/OrderDetails.vue'
import ConsigneeDetails from '~/components/orders/details/ConsigneeDetails.vue'
import PickupDetails from '~/components/orders/details/PickupDetails.vue'
import SenderDetails from '~/components/orders/details/SenderDetails.vue'
import OrderItems from '~/components/orders/details/OrderItems.vue'
import CalculatorOrderItems from '~/components/orders/details/CalculatorOrderItems.vue'
import UpdatesTimeline from '~/components/orders/details/UpdatesTimeline.vue'
import { Breadcrumbs } from '~/types/applications'

export default defineComponent({
  name: 'OrderDetailsPages',
  components: {
    OrderDetails,
    ConsigneeDetails,
    PickupDetails,
    SenderDetails,
    OrderItems,
    UpdatesTimeline,
    CalculatorOrderItems,
  },
  layout: 'default',
  setup() {
    useMeta({ titleTemplate: '%s | Order Details' })

    // manage route
    const route = useRoute()
    const router = useRouter()
    const id = computed(() => route.value.params.id)
    const doBackTo = () => {
      router.go(-1)
    }
    // manage store
    const storeOrders = useStore<VuexModuleOrders>()
    const detailsOrder = computed(
      () => storeOrders.state.orders.orderDetails.order
    )

    // check data exist
    const isPickupExist = computed(
      () => !!storeOrders.state.orders.orderDetails.order.pickupContactName
    )
    const isSenderExist = computed(
      () => !!storeOrders.state.orders.orderDetails.order.senderName
    )

    // manage breadcrumbs
    const breadCrumbsItems = computed(() => {
      return [
        {
          text: detailsOrder.value?.batchId,
          disabled: false,
          to: `/orders?batchId=${detailsOrder.value?.batchId}`,
          exact: true,
        },
        {
          text: detailsOrder.value?.orderCode,
          disabled: true,
          to: '#',
        },
      ]
    }) as ComputedRef<Breadcrumbs[]>

    useFetch(async () => {
      await storeOrders.dispatch('orders/getOrderDetails', id.value)
    })

    return {
      // manage route
      id,
      doBackTo,
      detailsOrder,
      // check data exist
      isPickupExist,
      isSenderExist,
      // manage breadcrumbs
      breadCrumbsItems,
    }
  },
  head: {},
})
</script>
