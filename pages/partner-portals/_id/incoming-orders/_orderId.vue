<template>
  <section class="pa-4 pa-md-10 py-8 detail-upcoming">
    <v-row>
      <v-col cols="12">
        <v-btn text small class="pa-0 mb-2" @click="doBackTo">
          <v-icon left dark tite elevation="0"> mdi-arrow-left-thin </v-icon>
          Back
        </v-btn>

        <h2 class="headline mb-4 font-weight-bold">ORDERS</h2>

        <v-breadcrumbs :items="breadCrumbsItems" class="pa-0">
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
            <OrderDetails :fetch-state="$fetchState" :is-upcoming="true" />
          </v-col>

          <!-- Consignee details -->
          <v-col cols="12">
            <ConsigneeDetails :fetch-state="$fetchState" :is-upcoming="true" />
          </v-col>

          <!-- Pickup details -->
          <v-col v-if="isPickupExist" cols="12">
            <PickupDetails :fetch-state="$fetchState" :is-upcoming="true" />
          </v-col>

          <!-- Sender details -->
          <v-col v-if="isSenderExist" cols="12">
            <SenderDetails :fetch-state="$fetchState" :is-upcoming="true" />
          </v-col>
        </v-row>
      </v-col>

      <!-- Order updates -->
      <v-col cols="12" md="8">
        <UpdatesTimeline :fetch-state="$fetchState" :is-upcoming="true" />
      </v-col>
    </v-row>

    <!-- Order items -->
    <v-row no-gutters align="center" class="mt-6">
      <v-col cols="12" class="white pa-3 elevation-2 rounded-xl">
        <OrderItems :fetch-state="$fetchState" :is-upcoming="true" />
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  useFetch,
  useStore,
  computed,
  useRoute,
  useRouter,
  ComputedRef,
} from '@nuxtjs/composition-api'
// components
import OrderDetails from '~/components/orders/details/OrderDetails.vue'
import ConsigneeDetails from '~/components/orders/details/ConsigneeDetails.vue'
import PickupDetails from '~/components/orders/details/PickupDetails.vue'
import SenderDetails from '~/components/orders/details/SenderDetails.vue'
import OrderItems from '~/components/orders/details/OrderItems.vue'
import UpdatesTimeline from '~/components/orders/details/UpdatesTimeline.vue'
// types
import { VuexModuleIncomingOrders } from '~/types/partnerPortals/incomingOrders'
import { Breadcrumbs } from '~/types/applications'

export default defineComponent({
  name: 'DetailOrdersIncomingPages',
  components: {
    OrderDetails,
    ConsigneeDetails,
    PickupDetails,
    SenderDetails,
    OrderItems,
    UpdatesTimeline,
  },
  middleware: 'partner',
  setup() {
    // manage route
    const route = useRoute()
    const router = useRouter()
    const doBackTo = () => {
      router.go(-1)
    }

    // manage store
    const storeIncomingOrders = useStore<VuexModuleIncomingOrders>()
    const detailsOrder = computed(
      () =>
        storeIncomingOrders.state.partnerPortals?.incomingOrders
          ?.incomingOrderDetails?.order?.order
    )

    // manage breadcrumbs
    const breadCrumbsItems = computed(() => {
      const partnerId = route.value.params?.id

      return [
        {
          text: detailsOrder.value?.batchId,
          disabled: false,
          to: `/partner-portals/${partnerId}/incoming-orders?batchId=${detailsOrder.value?.batchId}`,
          exact: true,
        },
        {
          text: detailsOrder.value?.orderCode,
          disabled: true,
          to: '#',
        },
      ]
    }) as ComputedRef<Breadcrumbs[]>

    // check data exist
    const isPickupExist = computed(
      () =>
        !!storeIncomingOrders.state.partnerPortals.incomingOrders
          .incomingOrderDetails?.order?.order?.pickupContactName
    )
    const isSenderExist = computed(
      () =>
        !!storeIncomingOrders.state.partnerPortals.incomingOrders
          .incomingOrderDetails?.order?.order?.senderName
    )

    // manage fetch
    const fetchIncomingOrderDetail = async () => {
      const partnerId = route.value.params.id
      const id = route.value.params.orderId
      const dataParams = {
        id,
        partnerId,
      }
      try {
        $fetchState.pending = true

        await storeIncomingOrders.dispatch(
          'partnerPortals/incomingOrders/getIncomingOrderDetails',
          dataParams
        )
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const { $fetchState } = useFetch(async () => {
      await fetchIncomingOrderDetail()
    })

    return {
      // manage route
      doBackTo,
      // manage breadcrumbs
      breadCrumbsItems,
      // check data exist
      isPickupExist,
      isSenderExist,
    }
  },
  head: {},
})
</script>
<style lang="scss">
@import '~/assets/scss/color.module.scss';
</style>
