<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseHeadlinePage title="Manage Orders">
      <template slot="addition">
        <span class="text--secondary font-weight-medium title">
          &bull; {{ meta.totalCount }} Total Orders
        </span>
      </template>
    </BaseHeadlinePage>

    <v-row align="center">
      <v-col cols="12" md="6">
        <!-- Search filter field -->
        <v-text-field
          v-model="filter.search"
          :loading="$fetchState.pending"
          :disabled="$fetchState.pending"
          label="Search by order code"
          placeholder="Enter your order code..."
          background-color="white"
          prepend-inner-icon="mdi-magnify"
          type="search"
          clearable
          solo
          flat
          dense
          hide-details
        />
      </v-col>
    </v-row>

    <v-row align="center">
      <v-col cols="12">
        <v-data-table
          v-bind="tableSettings"
          :items="orders"
          :loading="$fetchState.pending"
          :server-items-length="meta.totalCount"
          :options.sync="tableOptions"
          class="elevation-0"
          @update:options="fetchOrders"
        >
          <!-- Order code -->
          <template #[`item.orderCode`]="{ item }">
            {{ item.orderCode }}

            <span class="ml-1 text--secondary"> (#{{ item.refID }}) </span>
          </template>

          <!-- Consignee data -->
          <template #[`item.consignee`]="{ item }">
            <div class="text--secondary my-2">
              <p class="mb-2 font-weight-bold subtitle-2">
                {{ item.consigneeName }}
              </p>

              <p class="mb-1">
                {{ item.consigneeAddress }}
              </p>

              <p class="ma-0">
                {{
                  $customUtils.setAddress([
                    item.consigneeCity,
                    item.consigneeProvince,
                    item.consigneeCountry,
                    item.consigneePostal,
                  ])
                }}
              </p>
            </div>
          </template>

          <!-- Pickup data -->
          <template #[`item.pickup`]="{ item }">
            <div class="text--secondary my-2">
              <p class="mb-2 font-weight-bold subtitle-2">
                {{ item.pickupContactName }}
              </p>

              <p class="mb-1">
                {{ item.pickupAddress }}
              </p>

              <p class="ma-0">
                {{
                  $customUtils.setAddress([
                    item.pickupCity,
                    item.pickupProvince,
                    item.pickupCountry,
                    item.pickupPostal,
                  ])
                }}
              </p>
            </div>
          </template>

          <!-- Actions button list -->
          <template #[`item.actions`]="{ item }">
            <v-btn
              nuxt
              tile
              small
              :loading="$fetchState.pending"
              :disabled="$fetchState.pending"
              :to="`/orders/${item.id}`"
              color="primary"
              elevation="0"
              class="ma-2"
            >
              Details
            </v-btn>
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
  useFetch,
  useStore,
  reactive,
  watch,
  ref,
} from '@nuxtjs/composition-api'
// Interfaces or types
import { VuexModuleOrders } from '~/types/orders'
import { FilterDetails } from '~/types/applications'

export default defineComponent({
  name: 'OrdersPages',
  layout: 'default',
  setup() {
    const store = useStore<VuexModuleOrders>()
    const orders = computed(() => store.state.orders.orders)
    const meta = computed(() => store.state.orders.meta)
    const filter = reactive({
      search: null,
    })
    const tableOptions = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [''],
      sortDesc: [true],
    })
    const tableSettings = reactive({
      itemKey: 'id',
      headers: [
        {
          text: 'Order Code (#Ref)',
          value: 'orderCode',
        },
        {
          text: 'Consignee',
          value: 'consignee',
          sortable: false,
        },
        {
          text: 'Pickup',
          value: 'pickup',
          sortable: false,
        },
        {
          text: '',
          value: 'actions',
          sortable: false,
        },
      ],
      footerProps: {
        'items-per-page-options': [10, 20, -1],
        'show-first-last-page': true,
        'show-current-page': true,
      },
    })
    // Settings fetch options
    const fetchOrders = async (params: FilterDetails) => {
      let dataParams = {
        page: params.page,
        perPage: params.itemsPerPage,
        orderCode: filter.search ?? null,
        sortBy:
          params.sortBy && params?.sortBy[0] === 'orderCode'
            ? 'order_code'
            : null,
        sortDesc: params.sortDesc ? params?.sortDesc[0] : null,
      }
      dataParams =
        dataParams.perPage !== -1
          ? dataParams
          : {
              ...dataParams,
              perPage: meta.value.totalCount,
            }

      await store.dispatch('orders/getOrders', { params: dataParams })
    }

    const { fetch } = useFetch(async () => {
      await fetchOrders(tableOptions.value)
    })

    // If filter is changed, fetch data again
    watch(
      () => filter,
      (_newValue) => {
        tableOptions.value = {
          ...tableOptions.value,
          page: 1,
        }

        fetch()
      },
      { deep: true }
    )

    return {
      orders,
      meta,
      filter,
      tableOptions,
      tableSettings,
      fetchOrders,
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
