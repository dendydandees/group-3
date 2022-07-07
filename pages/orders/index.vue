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

    <v-row align="center">
      <!-- Left options -->
      <OrdersLeftOptions
        :is-on-list-view="isOnListView"
        :selected-orders="selectedOrders"
        :loading="$fetchState.pending"
        :is-show-filter="isShowFilter"
        :is-label-exist-on-selected="isLabelExistOnSelected"
        @doDownloadSelectedLabel="doDownloadSelectedLabel"
        @doExportOrders="doExportOrders"
        @doShowFilter="isShowFilter = !isShowFilter"
      />

      <!-- Right options -->
      <OrdersRightOptions :loading="$fetchState.pending" :is-able-upload="true">
        <template #viewSettings>
          <OrdersViewSettings
            v-if="isOnListView"
            v-model="selectedViews"
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
        @doToggleFilter="isShowFilter = !isShowFilter"
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
      <v-row v-show="isOnListView" align="center" class="my-4">
        <v-col cols="12">
          <BaseTable
            v-model="selectedOrders"
            item-key="id"
            :items="orders"
            :headers="headers"
            :options="pagination"
            :loading="$fetchState.pending"
            :show-select="true"
            :action-exist="actionExist"
            @fetch="fetchOrders"
            @doSelectAll="selectAllToggle"
            @doGetDetails="doGetDetails"
            @doGetBatchDetails="goToBatchView"
          />
        </v-col>
      </v-row>
    </v-fade-transition>

    <!-- List data for batch -->
    <v-fade-transition hide-on-leave>
      <v-row v-if="!isOnListView" align="center" class="my-4">
        <OrdersBatchList
          :loading="$fetchState.pending"
          @doGetBatchDetails="goToBatchView"
        />
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
      :value="alert.isShow"
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
import { AxiosResponse } from 'axios'
import { filterOrderInit, filterBatchInit } from '@/store/orders'
// types
import { BatchOrders, Order, VuexModuleOrders } from '~/types/orders'
import {
  FilterDetails,
  Header,
  VuexModuleApplications,
} from '~/types/applications'

const initHeaders = [
  {
    text: 'Order ID',
    value: 'orderCode',
    width: 150,
  },
  {
    text: 'Batch',
    value: 'batchId',
    width: 150,
  },
  {
    text: 'Service',
    value: 'serviceType',
    sortable: false,
    width: 150,
  },
  {
    text: 'Status',
    value: 'status',
    sortable: false,
    width: 200,
  },
  {
    text: 'Origin',
    value: 'origin',
    sortable: false,
    width: 150,
  },
  {
    text: 'Origin Port',
    value: 'originPort',
    sortable: false,
    width: 150,
  },
  {
    text: 'Destination',
    value: 'destination',
    sortable: false,
    width: 150,
  },
  {
    text: 'Destination Port',
    value: 'destinationPort',
    sortable: false,
    width: 180,
  },
  {
    text: 'Creation Date',
    value: 'creationDate',
    sortable: false,
    width: 180,
  },
  {
    text: 'Last Mile Tracking No.',
    value: 'LMTrackingNumber',
    sortable: false,
    width: 230,
  },
  {
    text: '',
    value: 'actions',
    sortable: false,
    width: 150,
  },
] as Header[]

export default defineComponent({
  name: 'OrderPages',
  layout: 'default',
  setup() {
    const { $dateFns, app } = useContext()
    const router = useRouter()

    // manage store
    const storeOrders = useStore<VuexModuleOrders>()
    const storeApplications = useStore<VuexModuleApplications>()
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

    // manage view
    const orderView = ref(storeOrders.state.orders.orderTabView)
    const isOnListView = computed(() => {
      return orderView.value === 0
    })

    // manage table
    const selectedOrders = ref([]) as Ref<Order[]>
    const actionExist = ref({
      export: true,
      downloadSelection: true,
    })
    const selectedViews = ref([
      'orderCode',
      'batchId',
      'serviceType',
      'status',
      'origin',
      'originPort',
      'destination',
      'destinationPort',
      'creationDate',
      'LMTrackingNumber',
      'actions',
    ])
    const headers = ref(initHeaders) as Ref<Header[]>
    const selectAllToggle = ({ items }: { items: Order[]; value: boolean }) => {
      if (selectedOrders.value.length === 0) {
        return (selectedOrders.value = [...items])
      } else {
        return (selectedOrders.value = [])
      }
    }
    const isLabelExistOnSelected = computed(() => {
      return selectedOrders.value.every((order) => order.labelPath)
    })
    const doResetPagination = () => {
      pagination.value = {
        ...pagination.value,
        page: 1,
      }
    }
    const doGetDetails = (data: Order) => {
      router.push(`/orders/${data.id}`)
    }
    const goToBatchView = (item: Order | BatchOrders) => {
      let batchId = ''

      if (isOnListView.value) {
        batchId = (item as Order).batchCode
      } else {
        batchId = (item as BatchOrders).code
      }

      router.push({
        name: `orders-batch-batchId`,
        params: {
          batchId,
        },
      })
    }

    // manage filter order
    const isShowFilter = ref(false)
    const doResetFilter = () => {
      filterOrder.value = { ...filterOrderInit }
      filterBatch.value = { ...filterBatchInit }
    }

    // Debounced fetch
    const fetchTimer = ref(null) as unknown as Ref<any>
    const fetchDebounced = () => {
      clearTimeout(fetchTimer.value)

      fetchTimer.value = setTimeout(async () => {
        await fetchOrders(pagination.value)
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

        dataParams = app.$customUtils.setURLParams({
          ...dataParams,
          ...filterOrder.value,
          sortBy: sortBy && sortBy[0] === 'orderCode' ? 'order_code' : null,
          sortDesc: sortDesc ? sortDesc[0] : null,
        })
      } else {
        dataParams = app.$customUtils.setURLParams({
          ...dataParams,
          ...filterBatch.value,
        })
      }

      try {
        $fetchState.pending = true
        const url = isOnListView.value
          ? 'orders/getOrders'
          : 'orders/getBatchOrders'

        await storeOrders.dispatch(url, { params: dataParams })
      } catch (error) {
        return error
      } finally {
        setTimeout(() => {
          $fetchState.pending = false
        }, 1500)
      }
    }
    const { $fetchState } = useFetch(() => {
      setTimeout(() => {
        storeApplications.commit('applications/RESET_ALERT')
      }, 3000)
    })

    const doDownloadSelectedLabel = async (serviceType = '') => {
      if (selectedOrders.value.length === 0) return

      const messageServicetype = `${
        serviceType &&
        `on ${app.$customUtils.setServiceType(serviceType.toLowerCase())}`
      }`

      try {
        storeApplications.commit('applications/RESET_ALERT')
        $fetchState.pending = true

        // * actually return Blob or AxiosResponse<Blob> depends it's success or failed
        const response = await storeOrders.dispatch(
          'orders/getSelectedLabels',
          {
            data: {
              orderIds: selectedOrders.value.map((order) => order.id),
              serviceType,
            },
          }
        )

        // * check it's the response is blob with size 0 (means no file)
        if ((response as Blob).size === 0) throw response
        // * check it's the response
        if (
          (response as { response: AxiosResponse<Blob> })?.response?.status >=
          400
        )
          throw new Error(
            JSON.parse(
              await (
                response as { response: AxiosResponse<Blob> }
              ).response.data.text()
            ).error
          )

        saveAs(
          response,
          `order_labels${
            serviceType && `_${serviceType.toLowerCase()}`
          }_${$dateFns.format(new Date(), 'yyyy-MM-dd_HH-mm')}.pdf`
        )
        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'success',
          message: `Order labels ${messageServicetype} successfully downloaded!`,
        })
      } catch (error) {
        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'error',
          message:
            (error as Error)?.message ??
            `Orders haven't labels ${messageServicetype}`,
        })
      } finally {
        setTimeout(() => {
          $fetchState.pending = false
        }, 1500)
      }
    }
    const doExportOrders = async () => {
      if (selectedOrders.value.length === 0) return

      try {
        $fetchState.pending = true

        const response = await storeOrders.dispatch(
          'orders/getSelectedExports',
          {
            data: selectedOrders.value.map((order) => order.id),
          }
        )
        const fileName = `order_exports_${$dateFns.format(
          new Date(),
          'yyyy-MM-dd_HH-mm'
        )}.xlsx`

        saveAs(response, fileName)
      } catch (error) {
        return error
      } finally {
        setTimeout(() => {
          $fetchState.pending = false
        }, 1500)
      }
    }

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
    watch(orderView, (newValue) => {
      doResetFilter()
      selectedOrders.value = []
      storeOrders.commit('orders/SET_ORDER_TAB_VIEW', newValue)
    })

    // manage page title
    const title = computed(() => {
      return orderView.value === 0 ? 'Order List' : 'Batch List'
    })
    useMeta(() => ({ title: `Client Portal | ${title.value}` }))

    return {
      // manage store
      orders,
      meta,
      pagination,
      filterOrder,
      filterBatch,
      alert,
      // manage view
      orderView,
      isOnListView,
      // manage table
      selectedOrders,
      actionExist,
      selectedViews,
      headers,
      selectAllToggle,
      isLabelExistOnSelected,
      doGetDetails,
      goToBatchView,
      doDownloadSelectedLabel,
      doExportOrders,
      // manage filter order
      isShowFilter,
      doResetFilter,
      // manage fetch
      fetchOrders,
      fetchDebounced,
    }
  },
  head: {},
})
</script>
