<template>
  <section class="pa-4 pa-md-10 py-8">
    <v-row align="center">
      <v-col>
        <h1 class="mb-6 display-1 font-weight-bold">Manage Orders</h1>
      </v-col>
    </v-row>

    <v-row align="center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="params.search"
          :loading="$fetchState.loading"
          label="Search by order code"
          placeholder="Enter your order code..."
          background-color="white"
          prepend-inner-icon="mdi-magnify"
          type="search"
          clearable
          solo
          flat
          hide-details
        />
      </v-col>
    </v-row>

    <v-row align="center" class="my-10">
      <v-col v-for="order in orders" :key="order.id" cols="12" md="4" lg="3">
        <v-card :loading="$fetchState.loading" color="white" tile outlined>
          <v-card-title class="title font-weight-bold text-capitalize">
            {{ order.orderCode }}
          </v-card-title>

          <v-card-subtitle> #{{ order.refID }} </v-card-subtitle>

          <v-card-text>
            <v-row align="start">
              <v-col cols="auto">
                <v-icon size="32"> mdi-home-account </v-icon>
              </v-col>

              <v-col>
                <span
                  class="text-capitalize subtitle-1 font-weight-medium mb-2"
                >
                  {{ order.consigneeName }}
                </span>

                <span class="mb-1 d-block">
                  {{ `${order.consigneeAddress}` }}
                </span>

                <span class="mb-1 d-block">
                  {{
                    `${order.consigneeCity}, ${order.consigneeCountry}, ${order.consigneePostal}`
                  }}
                </span>
              </v-col>
            </v-row>

            <v-row align="start">
              <v-col cols="auto">
                <v-icon size="32" color="primary"> mdi-map-marker </v-icon>
              </v-col>

              <v-col>
                <span
                  class="text-capitalize subtitle-1 font-weight-medium mb-2"
                >
                  {{ order.pickupContactName }}
                </span>

                <span class="mb-1 d-block">
                  {{ `${order.pickupAddress}` }}
                </span>

                <span class="mb-1 d-block">
                  {{
                    `${order.pickupCity}, ${order.pickupCountry}, ${order.pickupPostal}`
                  }}
                </span>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-btn tile color="primary"> Full Report </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row align="center" justify="space-between" class="my-10 white">
      <v-col cols="12" md="auto">
        <div class="d-flex align-center">
          <span class="font-weight-bold mr-2">
            Items
            <span class="d-none d-md-inline-block"> per page </span>
            :
          </span>

          <v-select
            v-model="params.perPage"
            :items="itemsPerPageOptions"
            :loading="$fetchState.loading"
            background-color="white"
            dense
            outlined
            hide-details
            eager
          />
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <v-pagination
          v-model="params.page"
          :disabled="$fetchState.loading"
          :length="meta.totalPage"
          :total-visible="7"
        />
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useFetch,
  useStore,
  reactive,
  watch,
} from '@nuxtjs/composition-api'
// Interfaces or types
import { VuexModuleOrders } from '~/types/orders'

export default defineComponent({
  name: 'DashboardPage',
  layout: 'default',
  setup() {
    const store = useStore<VuexModuleOrders>()
    const orders = computed(() => store.state.orders.orders)
    const meta = computed(() => store.state.orders.meta)
    const params = reactive({
      page: 1,
      perPage: 10,
      search: '',
    })
    const itemsPerPageOptions = reactive([
      {
        text: '10',
        value: 10,
      },
      {
        text: '20',
        value: 20,
      },
      {
        text: 'All',
        value: -1,
      },
    ])

    useFetch(() => {
      store.dispatch('orders/getOrders')
    })

    watch(
      () => params,
      (newValue) => {
        const newMeta = {
          ...meta.value,
          page: newValue.page,
        }

        store.commit('orders/SET_META', newMeta)
      },
      { deep: true }
    )

    return {
      orders,
      meta,
      params,
      itemsPerPageOptions,
    }
  },
})
</script>

<style lang="scss">
@media screen and (min-width: 1024px) {
  .v-pagination {
    justify-content: flex-end !important;
  }
}
</style>
