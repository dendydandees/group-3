<template>
  <section class="pa-4 pa-md-10 py-8 detail-upcoming">

    <!-- <BaseBackButton @doBackTo="doBackTo" /> -->
    <div
      class="mb-7"
    >
      <div
        style="font-size: 25px; line-height: 30px"
        class="mb-4"
      >
        ORDERS
      </div>
      <div
        v-if="idObj.previous && idObj.id"
        class="primary--text"
        style="font-size: 20px; line-height: 24px"
      >
        {{idObj.previous}} > {{idObj.id}}
      </div>
    </div>

    <v-row align="stretch">
      <v-col cols="12" md="4">
        <v-row align="stretch">
          <!-- Order details -->
          <v-col cols="12">
            <OrderDetails
              :fetch-state="$fetchState"
              :is-upcoming="true"
            />
          </v-col>

          <!-- Consignee details -->
          <v-col cols="12">
            <ConsigneeDetails
              :fetch-state="$fetchState"
              :is-upcoming="true"
            />
          </v-col>

          <!-- Pickup details -->
          <v-col cols="12">
            <PickupDetails
              :fetch-state="$fetchState"
              :is-upcoming="true"
            />
          </v-col>
        </v-row>
      </v-col>

      <!-- Order updates -->
      <v-col cols="12" md="8">
        <OrdersDetailsUpdatesTimelineCustom
          :fetch-state="$fetchState"
          :is-upcoming="true"
        />
      </v-col>
    </v-row>

    <!-- Order items -->
    <v-row no-gutters align="center" class="mt-6">
      <v-col cols="12" class="white pa-3 elevation-2 rounded-xl">
        <OrderItems
          :fetch-state="$fetchState"
          :is-upcoming="true"
        />
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  useFetch,
  useMeta,
  useStore,
  computed,
  ref,
  watch,
  reactive,
  useRoute,
} from '@nuxtjs/composition-api'
import { FilterDetails, VuexModuleApplications } from '~/types/applications'
// Interface and types
import { VuexModuleIncomingOrders } from '~/types/partnerPortals/incomingOrders'
// Components
import OrderDetails from '~/components/orders/details/OrderDetails.vue'
import ConsigneeDetails from '~/components/orders/details/ConsigneeDetails.vue'
import PickupDetails from '~/components/orders/details/PickupDetails.vue'
import OrderItems from '~/components/orders/details/OrderItems.vue'

export default defineComponent({
  name: 'DetailOrdersIncomingPages',
  components: {
    OrderDetails,
    ConsigneeDetails,
    PickupDetails,
    OrderItems,
  },
  middleware: 'partner',
  setup() {
    const route = useRoute()
    const storeIncomingOrders = useStore<VuexModuleIncomingOrders>()
    const idObj = computed(
      () =>{
      const storeOrder = storeIncomingOrders.state.partnerPortals?.incomingOrders?.incomingOrderDetails?.order?.order
      return  {
        id: storeOrder?.orderCode,
        previous: storeOrder?.batchId
      }
    })


    const fetchIncomingOrderDetail = async () => {
      const partnerId = route.value.params.id
      const id = route.value.params.orderId
      // const id = '1d6f9538-44ce-4e99-9ca2-4e5e35174436'
      const dataParams = {
        id,
        partnerId
      }
      try {
        $fetchState.pending = true

        await storeIncomingOrders.dispatch(
          'partnerPortals/incomingOrders/getIncomingOrderDetails', dataParams
        )
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }

    const { $fetchState, fetch } = useFetch(async () => {
      await fetchIncomingOrderDetail()
    })

    return {
      idObj
    }
  },
  head: {},
})
</script>
<style lang="scss">
@import "~/assets/scss/color.module.scss";
  .detail-upcoming {
  }
</style>