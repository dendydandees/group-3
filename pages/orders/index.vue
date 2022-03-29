<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseHeadlinePage
      title="Manage Orders"
      subtitle="View the details of each order and batch order, or make changes to a order."
    >
      <template slot="addition">
        <span
          v-if="isOnListView"
          class="text--secondary font-weight-medium title"
        >
          &bull; {{ meta.totalCount }} Total Orders
        </span>

        <span v-else class="text--secondary font-weight-medium title">
          &bull; {{ meta.totalCount }} Total Batch
        </span>
      </template>
    </BaseHeadlinePage>

    <v-row align="center" justify="end">
      <!-- Left options -->
      <OrdersLeftOptions
        :is-on-list-view="isOnListView"
        :selected-orders="selectedOrders"
        :loading="$fetchState.pending"
        :is-show-filter="isShowFilter"
        @doDownloadSelectedLabel="doDownloadSelectedLabel"
        @doShowFilter="isShowFilter = !isShowFilter"
      />

      <!-- Right options -->
      <OrdersRightOptions
        :is-on-list-view="isOnListView"
        :loading="$fetchState.pending"
      >
        <template #viewSettings>
          <OrdersViewSettings
            v-model="selectedViews"
            :is-on-list-view="isOnListView"
            :loading="$fetchState.pending"
          />
        </template>

        <template #toggleView>
          <OrdersToggleView
            v-model="orderView"
            :loading="$fetchState.pending"
          />
        </template>
      </OrdersRightOptions>
    </v-row>

    <v-expand-transition>
      <OrdersFiltersContainer
        :is-show-filter="isShowFilter"
        @doResetFilter="doResetFilter"
      >
        <template #filterList>
          <!-- Filter for order list -->
          <OrdersFilterListView v-if="isOnListView" v-model="filterOrder" />

          <!-- Filter for batch list -->
          <OrdersFilterBatchView v-else v-model="filterBatch" />
        </template>
      </OrdersFiltersContainer>
    </v-expand-transition>

    <v-fade-transition hide-on-leave>
      <!-- List data for order -->
      <v-row v-if="isOnListView" align="center" class="my-4">
        <v-col cols="12">
          <BaseTable
            v-model="selectedOrders"
            item-key="id"
            :items="orders"
            :headers="headers"
            :options="pagination"
            :loading="$fetchState.pending"
            :is-select-disabled="isLabelExist"
            :show-select="true"
            @fetch="fetchOrders"
            @doSelectAll="selectAllToggle"
            @doGetDetails="doGetDetails"
            @doGetBatchDetails="doGetBatchDetails"
          />
        </v-col>
      </v-row>

      <!-- List data for batch -->
      <v-row v-else align="center" class="my-4">
        <OrdersBatchList @doGetBatchDetails="doGetBatchDetails" />
      </v-row>
    </v-fade-transition>

    <!-- Pagination universal (order and batch view) -->
    <BasePagination
      v-model="pagination"
      :meta="meta"
      :loading="$fetchState.pending"
      @resetPage="pagination.page = 1"
    />

    <v-snackbar
      :value="
        alert.isShow &&
        alert.message.includes('Order') &&
        alert.type === 'success'
      "
      :timeout="2000"
      rounded="pill"
      right
      bottom
      :color="alert.type"
    >
      {{ alert.message }}
    </v-snackbar>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useFetch,
  useStore,
  watch,
  ref,
  useMeta,
  useRouter,
  Ref,
  useContext,
} from '@nuxtjs/composition-api'
import { saveAs } from 'file-saver'
// Interfaces or types
import { Order, VuexModuleOrders } from '~/types/orders'
import { FilterDetails, VuexModuleApplications } from '~/types/applications'
import { VuexModuleFilters } from '~/types/filters'

interface Header {
  text: string
  value: string
  sortable?: boolean
}

const initHeaders = [
  {
    text: 'Order ID',
    value: 'orderCode',
  },
  {
    text: 'Batch',
    value: 'batchId',
    sortable: false,
  },
  {
    text: 'Service',
    value: 'serviceType',
    sortable: false,
  },
  {
    text: 'Origin',
    value: 'origin',
    sortable: false,
  },
  {
    text: 'Destination',
    value: 'destination',
    sortable: false,
  },
  {
    text: '',
    value: 'actions',
    sortable: false,
  },
] as Header[]

export default defineComponent({
  name: 'OrderPages',
  layout: 'default',
  setup() {
    const { $dayjs } = useContext()
    const router = useRouter()

    // store manage
    const storeOrders = useStore<VuexModuleOrders>()
    const storeApplications = useStore<VuexModuleApplications>()
    const storeFilters = useStore<VuexModuleFilters>()
    const orders = computed(() => storeOrders.state.orders.orders)
    const meta = computed(() => storeOrders.state.orders.meta)
    const pagination = ref({
      ...storeApplications.state.applications.pagination,
    })
    const filterOrder = ref({
      ...storeOrders.state.orders.filterOrder,
    })
    const filterBatch = ref({
      ...storeOrders.state.orders.filterBatch,
    })
    const alert = computed(() => storeApplications.state.applications.alert)
    const serviceTypes = ref([...storeFilters.state.filters.serviceTypes])

    // manage view
    const orderView = ref(0)
    const isOnListView = computed(() => {
      return orderView.value === 0
    })

    // manage table
    const selectedOrders = ref([]) as Ref<Order[]>
    const isLabelExist = computed(() => {
      return orders.value.some((order) => order.labelPath)
    })
    const selectedViews = ref([
      'orderCode',
      'batchId',
      'serviceType',
      'destination',
      'origin',
      'actions',
    ])
    const headers = ref(initHeaders) as Ref<Header[]>
    const selectAllToggle = ({ items }: { items: Order[]; value: boolean }) => {
      if (selectedOrders.value.length === 0) {
        const selectedItems = items.filter((item) => {
          return item.labelPath
        })

        return (selectedOrders.value = [...selectedItems])
      } else {
        return (selectedOrders.value = [])
      }
    }
    const doResetPagination = () => {
      pagination.value = {
        ...pagination.value,
        page: 1,
      }
    }
    const doGetDetails = (data: Order) => {
      router.push(`/orders/${data.id}`)
    }
    const doGetBatchDetails = (id: string) => {
      orderView.value = 0
      isShowFilter.value = true
      setTimeout(() => {
        filterOrder.value = {
          ...filterOrder.value,
          batchId: id,
        }
      }, 100)
      setTimeout(() => {
        fetchDebounced()
      }, 500)
    }
    const doDownloadSelectedLabel = async () => {
      if (selectedOrders.value.length === 0) return

      const selectedLabels = {
        orderIds: selectedOrders.value.map((order) => order.id),
      }
      const response = (await storeOrders.dispatch('orders/getSelectedLabels', {
        data: selectedLabels,
      })) as string
      const fileName = `order_labels_${$dayjs().format('YYYY-MM-DD_HH-mm')}.pdf`

      saveAs(response, fileName)
    }

    // manage filter order
    const isShowFilter = ref(false)
    const country = ref([])
    const doResetFilter = () => {
      filterOrder.value = {
        orderCode: '',
        batchId: '',
        serviceType: '',
        originCountry: '',
        destinationCountry: '',
      }
      filterBatch.value = {
        batchId: '',
      }
    }

    // Debounced fetch
    const fetchTimer = ref(null) as unknown as Ref<any>
    const fetchDebounced = () => {
      clearTimeout(fetchTimer.value)

      fetchTimer.value = setTimeout(() => {
        fetch()
      }, 300)
    }
    const fetchOrders = async (params: FilterDetails) => {
      const { page, itemsPerPage } = pagination.value
      const perPage = itemsPerPage !== -1 ? itemsPerPage : meta.value.totalCount
      let dataParams = {
        page,
        perPage,
      } as Object

      if (isOnListView.value) {
        const { sortBy, sortDesc } = params
        const orderCode = filterOrder?.value.orderCode ?? null
        const batchId = filterOrder?.value.batchId ?? null

        dataParams = {
          ...dataParams,
          orderCode,
          batchId,
          sortBy: sortBy && sortBy[0] === 'orderCode' ? 'order_code' : null,
          sortDesc: sortDesc ? sortDesc[0] : null,
        }
      } else {
        const batchId = filterBatch?.value.batchId ?? null

        dataParams = {
          ...dataParams,
          batchId,
        }
      }

      try {
        $fetchState.pending = true

        if (isOnListView.value) {
          await storeOrders.dispatch('orders/getOrders', { params: dataParams })
        } else {
          await storeOrders.dispatch('orders/getBatchOrders', {
            params: dataParams,
          })
        }
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const { $fetchState, fetch } = useFetch(async () => {
      setTimeout(() => {
        storeApplications.commit('applications/RESET_ALERT')
      }, 3000)
      await fetchOrders(pagination.value)
    })

    // manage filter on changed
    watch(
      filterOrder,
      (newFilter) => {
        doResetPagination()
        storeApplications.commit('orders/SET_FILTER_ORDERS', {
          ...newFilter,
        })
      },
      { deep: true }
    )
    watch(
      filterBatch,
      (newFilter) => {
        doResetPagination()
        storeApplications.commit('orders/SET_FILTER_BATCH', {
          ...newFilter,
        })
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

        fetchDebounced()
      },
      { deep: true }
    )
    // manage view table on changed
    watch(selectedViews, (newValue) => {
      headers.value = initHeaders.filter((header) =>
        newValue.includes(header.value)
      )
    })
    // manage view on changed
    watch(orderView, (_newView) => {
      doResetFilter()
      selectedOrders.value = []
    })

    // manage page title
    const title = computed(() => {
      return orderView.value === 0 ? 'Order List' : 'Batch List'
    })
    useMeta(() => ({ title: `Client Portal | ${title.value}` }))

    return {
      orders,
      meta,
      pagination,
      filterOrder,
      filterBatch,
      alert,
      serviceTypes,
      orderView,
      isOnListView,
      selectedOrders,
      isLabelExist,
      selectedViews,
      headers,
      doGetDetails,
      doGetBatchDetails,
      doDownloadSelectedLabel,
      isShowFilter,
      country,
      selectAllToggle,
      doResetFilter,
      fetchOrders,
      fetchDebounced,
    }
  },
  head: {},
})
</script>
