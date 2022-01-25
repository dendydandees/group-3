<template>
  <section class="pa-4 pa-md-10 py-8">
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

                  <v-chip small color="info" class="text-uppercase mb-2">
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
                      setAddress([
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
                      setAddress([
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
                  <v-col cols="7">
                    <h3 class="font-weight-medium subtitle-1">
                      {{ update.partnerName }}
                    </h3>

                    <p class="ma-0 caption">
                      {{ update.serviceType }}
                    </p>
                  </v-col>
                  <v-col class="text-right" cols="5">
                    <v-btn tile small elevation="0">
                      {{ update.externalTrackingNumber || 'Not submitted' }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
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
  useStore,
} from '@nuxtjs/composition-api'
// Interfaces or types
import { VuexModuleOrders } from '~/types/orders'

export default defineComponent({
  name: 'OrderDetailsPages',
  layout: 'default',
  setup() {
    const route = useRoute()
    const store = useStore<VuexModuleOrders>()
    const id = computed(() => route.value.params.id)
    const order = computed(() => store.state.orders.orderDetails.order)
    const orderAllocationUpdates = computed(
      () => store.state.orders.orderDetails.orderAllocationUpdates
    )
    const setAddress = (data: string[]) => {
      const setItem = data.filter((item: string) => item)

      return setItem.join(', ')
    }

    useFetch(async () => {
      await store.dispatch('orders/getOrderDetails', id.value)
    })

    return {
      id,
      order,
      orderAllocationUpdates,
      setAddress,
    }
  },
})
</script>
