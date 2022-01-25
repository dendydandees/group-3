<template>
  <section class="pa-4 pa-md-10 py-8">
    <v-row align="center">
      <v-col cols="12">
        <v-btn text small @click="doBackTo">
          <v-icon left dark tite elevation="0"> mdi-arrow-left-thin </v-icon>
          Back
        </v-btn>
      </v-col>
    </v-row>

    <v-row align="stretch">
      <v-col cols="12" md="4">
        <v-row align="stretch">
          <!-- Order details -->
          <v-col cols="12">
            <v-card
              dark
              tile
              color="primary"
              elevation="0"
              :loading="$fetchState.loading"
            >
              <template slot="progress">
                <v-progress-linear color="info" height="8" indeterminate />
              </template>

              <v-card-text class="body-1 white--text">
                <h2 class="font-weight-bold title">Order Details</h2>

                <v-divider class="grey lighten-4 my-4" />

                <div>
                  <h3 class="font-weight-medium subtitle-1">
                    {{ order.orderCode }}
                  </h3>

                  <p class="mb-4">
                    {{ order.length }} (cm) x {{ order.width }} (cm) x
                    {{ order.height }} (cm) &bull; {{ order.weight }}
                  </p>

                  <v-chip
                    small
                    color="success"
                    class="text-uppercase mb-2 black--text"
                  >
                    {{ order.paymentType }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Consignee details -->
          <v-col cols="12">
            <v-card
              dark
              tile
              color="primary"
              elevation="0"
              :loading="$fetchState.loading"
            >
              <template slot="progress">
                <v-progress-linear color="info" height="8" indeterminate />
              </template>

              <v-card-text class="body-1 white--text">
                <h2 class="font-weight-bold title">Consignee Details</h2>

                <v-divider class="grey lighten-4 my-4" />

                <div>
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
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Consignee details -->
          <v-col cols="12">
            <v-card
              dark
              tile
              color="primary"
              elevation="0"
              :loading="$fetchState.loading"
            >
              <template slot="progress">
                <v-progress-linear color="info" height="8" indeterminate />
              </template>

              <v-card-text class="body-1 white--text">
                <h2 class="font-weight-bold title">Pickup Details</h2>

                <v-divider class="grey lighten-4 my-4" />

                <div>
                  <h3 class="font-weight-medium subtitle-1">
                    {{ order.pickupContactName }}
                  </h3>

                  <p class="mb-4">
                    {{ order.pickupContactNumber }}
                  </p>

                  <p class="mb-2">
                    {{
                      $customUtils.setAddress([
                        order.pickupAddress,
                        order.pickupCity,
                        order.pickupProvince,
                        order.pickupCountry,
                        order.pickupPostal,
                      ])
                    }}
                  </p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- Order updates -->
      <v-col cols="12" md="8">
        <v-card tile elevation="0" :loading="$fetchState.loading" height="100%">
          <template slot="progress">
            <v-progress-linear color="info" height="8" indeterminate />
          </template>

          <v-card-text class="body-1 pa-6">
            <v-timeline dense clipped align-top>
              <v-timeline-item
                v-for="update in orderAllocationUpdates"
                :key="update.id"
                small
                class="mb-10"
              >
                <v-row justify="space-between">
                  <v-col cols="auto">
                    <h3 class="font-weight-medium subtitle-1">
                      {{ update.partnerName }}
                    </h3>

                    <p class="ma-0 caption">
                      {{ update.serviceType }}
                    </p>
                  </v-col>
                  <v-col class="text-right" cols="auto">
                    <v-chip
                      small
                      :color="update.externalTrackingNumber ? 'primary' : ''"
                      class="text-right text-uppercase"
                    >
                      {{ update.externalTrackingNumber || 'Not submitted' }}
                    </v-chip>
                  </v-col>
                </v-row>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Order items -->
    <v-row no-gutters align="center" class="my-10">
      <v-col cols="12" class="white pa-3">
        <v-data-table
          v-bind="tableSettings"
          :items="orderItems"
          :loading="$fetchState.loading"
          class="elevation-0"
        >
          <template #[`item.price`]="{ item }">
            {{ item.currency }} {{ setPrice(item.price) }}
          </template>

          <template #footer>
            <v-divider class="my-4" />

            <p class="ma-0 text-right font-weight-bold">
              Total
              <span class="primary--text title ml-2">
                {{ setTotal() }}
              </span>
            </p>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  useFetch,
  useRoute,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
// Interfaces or types
import { OrderItem, VuexModuleOrders } from '~/types/orders'

export default defineComponent({
  name: 'OrderDetailsPages',
  layout: 'default',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore<VuexModuleOrders>()
    const id = computed(() => route.value.params.id)
    const order = computed(() => store.state.orders.orderDetails.order)
    const orderAllocationUpdates = computed(
      () => store.state.orders.orderDetails.orderAllocationUpdates
    )
    const orderItems = computed(
      () => store.state.orders.orderDetails.orderItems
    )
    const tableSettings = reactive({
      itemKey: 'id',
      hideDefaultFooter: true,
      headers: [
        {
          text: 'Product Code',
          value: 'productCode',
        },
        {
          text: 'SKU',
          value: 'sku',
        },
        {
          text: 'Category',
          value: 'category',
        },
        {
          text: 'Description',
          value: 'description',
        },
        {
          text: 'Quantity',
          value: 'quantity',
        },
        {
          text: 'Price',
          value: 'price',
        },
      ],
    })
    const doBackTo = () => {
      router.go(-1)
    }
    const setPrice = (price: string) => {
      return parseFloat(price).toFixed(2)
    }
    const setTotal = () => {
      const orderItems = store.state.orders.orderDetails.orderItems
      const totalPrice = orderItems.reduce(
        (previous: number, current: OrderItem) => {
          const total = previous + parseFloat(current.price)

          return total
        },
        0
      )
      const currency = orderItems.length !== 0 ? orderItems[0].currency : ''

      return `${currency} ${totalPrice.toFixed(2)}`
    }

    useFetch(async () => {
      await store.dispatch('orders/getOrderDetails', id.value)
    })

    return {
      id,
      order,
      orderAllocationUpdates,
      orderItems,
      tableSettings,
      doBackTo,
      setPrice,
      setTotal,
    }
  },
})
</script>
