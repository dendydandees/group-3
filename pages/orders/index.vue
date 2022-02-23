<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseHeadlinePage
      title="Manage Orders"
      subtitle="View the details of each order or make changes to a order."
    >
      <template slot="addition">
        <span class="text--secondary font-weight-medium title">
          &bull; {{ meta.totalCount }} Total Orders
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
          v-model="pagination"
          item-key="id"
          :loading="$fetchState.pending"
          :items="orders"
          :headers="headers"
          :meta="meta"
          :is-show-actions="isShowActions"
          @doGetDetails="doGetDetails"
          @fetch="fetchOrders"
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
import { FilterDetails, VuexModuleApplications } from '~/types/applications'

export default defineComponent({
  name: 'OrdersProcessPages',
  layout: 'default',
  setup() {
    useMeta({ titleTemplate: '%s | Orders' })
    const router = useRouter()
    // store manage
    const storeOrders = useStore<VuexModuleOrders>()
    const storeApplications = useStore<VuexModuleApplications>()
    const orders = computed(() => storeOrders.state.orders.orders)
    const meta = computed(() => storeOrders.state.orders.meta)
    const pagination = ref({
      ...storeApplications.state.applications.pagination,
    })
    const filter = ref({
      ...storeOrders.state.orders.filter,
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
      router.push(`/orders/${data.id}`)
    }
    const fetchOrders = async (params: FilterDetails) => {
      const { page, itemsPerPage, sortBy, sortDesc } = params
      const perPage = itemsPerPage !== -1 ? itemsPerPage : meta.value.totalCount
      const orderCode = filter?.value.search ?? null
      const dataParams = {
        page,
        perPage,
        orderCode,
        sortBy: sortBy && sortBy[0] === 'orderCode' ? 'order_code' : null,
        sortDesc: sortDesc ? sortDesc[0] : null,
      }

      try {
        $fetchState.pending = true

        await storeOrders.dispatch('orders/getOrders', { params: dataParams })
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const { $fetchState, fetch } = useFetch(async () => {
      await fetchOrders(pagination.value)
    })

    // manage filter on changed
    watch(
      filter,
      (newFilter) => {
        pagination.value = {
          ...pagination.value,
          page: 1,
        }
        storeApplications.commit('orders/SET_FILTER', {
          ...newFilter,
        })

        fetch()
      },
      { deep: true }
    )

    // manage pagination on changed
    watch(
      pagination,
      (newPagination) => {
        storeApplications.commit('applications/SET_PAGINATION', {
          ...newPagination,
        })
      },
      { deep: true }
    )

    return {
      orders,
      meta,
      pagination,
      filter,
      headers,
      fetchOrders,
      doGetDetails,
      isShowActions,
    }
  },
  head: {},
})
</script>
