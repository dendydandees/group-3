<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseHeadlinePage
      title="Manage Process Orders"
      subtitle="View the details of each order or make changes to a processed order."
    >
      <template slot="addition">
        <span class="text--secondary font-weight-medium title">
          &bull; {{ meta.totalCount }} Total Process Orders
        </span>
      </template>
    </BaseHeadlinePage>

    <v-row align="center">
      <v-col cols="12" md="6">
        <!-- Search filter field -->
        <BaseSearchField v-model="filter.search" />
      </v-col>
    </v-row>

    <v-row align="center">
      <v-col cols="12">
        <BaseTableListServer
          item-key="id"
          :loading="$fetchState.pending"
          :items="orders"
          :headers="headers"
          :meta="meta"
          :options="options"
          :is-show-actions="isShowActions"
          @doGetDetails="doGetDetails"
          @fetchOrders="fetchOrders"
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
  ref,
  useMeta,
  useRouter,
} from '@nuxtjs/composition-api'
// Interfaces or types
import { Order, VuexModuleOrders } from '~/types/orders'
import { FilterDetails } from '~/types/applications'

export default defineComponent({
  name: 'OrdersProcessPages',
  layout: 'default',
  setup() {
    useMeta({ titleTemplate: '%s | Orders' })
    const store = useStore<VuexModuleOrders>()
    const router = useRouter()
    const orders = computed(() => store.state.orders.orders)
    const meta = computed(() => store.state.orders.meta)
    const filter = reactive({
      search: null,
    })
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [''],
      sortDesc: [true],
    })
    const headers = reactive([
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
    ])
    const isShowActions = reactive({
      detail: true,
    })
    const doGetDetails = (data: Order) => {
      router.push(`/orders/process/${data.id}`)
    }

    // Settings fetch options
    const fetchOrders = async (params: FilterDetails) => {
      let dataParams = {
        page: params.page,
        perPage: params.itemsPerPage,
        orderCode: filter?.search ?? null,
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
      await fetchOrders(options.value)
    })

    // If filter is changed, fetch data again
    watch(
      () => filter,
      (_newValue) => {
        options.value = {
          ...options.value,
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
      options,
      headers,
      fetchOrders,
      doGetDetails,
      isShowActions,
    }
  },
  head: {},
})
</script>

<style lang="scss">
@media screen and (min-width: 1024px) {
  .v-pagination {
    justify-content: flex-end !important;
  }
}
</style>
