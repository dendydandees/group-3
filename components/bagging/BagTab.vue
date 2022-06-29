<template>
  <section class="pa-4 pa-md-10 py-8">


    <v-fade-transition hide-on-leave>
      <!-- List data for order -->
      <v-row v-if="isOnListView" align="center">
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
            @doSelectAll="selectAllToggle"
            @doGetDetails="doGetDetails"
            @doGetBatchDetails="goToBatchView"
            @doHandleModalTrack="doHandleModalTrack"
            @doMovePageBagPartner="baggingPartnerActions.movePage"
          />
            <!-- @fetch="fetchOrders" -->
        </v-col>
      </v-row>
    </v-fade-transition>

    <!-- Pagination universal (order and batch view) -->
    <!-- <BasePagination
      v-model="pagination"
      :meta="meta"
      :loading="$fetchState.pending"
      @resetPage="pagination.page = 1"
    /> -->


    <BaggingModalTrack
      v-model="dialog.track"
      :dialog-settings="dialogSettings"
      :fetch-state="$fetchState"
      :data="bagUpdates"
      :data-item="bagItem"
    />


    <v-snackbar
      :value="
        alert.isShow &&
        alert.message.includes('Order') &&
        alert.type === 'success'
      "
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
import { filterOrderInit, filterBatchInit } from '@/store/orders'
// Interfaces or types
import { BatchOrders, Order, VuexModuleOrders } from '~/types/orders'
import {
  FilterDetails,
  Header,
  VuexModuleApplications,
  ModalConfirm
} from '~/types/applications'
import { VuexModuleDetailBagging, FilterBagging, Unbagged, InputPostBag, Bagged} from '~/types/bagging/bagging'

const initHeaders = [
  {
    text: 'Bag ID',
    value: 'group_name',
    width: 150,
  },
  {
    text: 'Orders',
    value: 'orderBags',
    width: 150,
  },
  {
    text: 'Status',
    value: 'statusBags',
    sortable: false,
    width: 200,
  },
  {
    text: 'Origin Port',
    value: 'origin_port',
    sortable: false,
    width: 150,
  },
  {
    text: 'Destination Port',
    value: 'dest_port',
    sortable: false,
    width: 180,
  },
  {
    text: 'Flight',
    value: 'flight',
    sortable: false,
    width: 150,
  },
  {
    text: 'Date',
    value: 'flight_date',
    sortable: false,
    width: 180,
  },
  {
    text: 'Departure',
    value: 'departure',
    sortable: false,
    width: 230,
  },
  {
    text: 'Arrival',
    value: 'arrival',
    sortable: false,
    width: 150,
  },
  {
    text: '',
    value: 'actions',
    sortable: false,
    width: 150,
  },
] as Header[]

export default defineComponent({
  name: 'BagTab',
  layout: 'default',
  props: {
    value: {
      type: Array,
      required: true,
    },
    isCompleteTabPartner: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { $dateFns, app } = useContext()
    const router = useRouter()

    // manage store
    const storeOrders = useStore<VuexModuleOrders>()
    const storeApplications = useStore<VuexModuleApplications>()
    const storeBagging = useStore<VuexModuleDetailBagging>()
    const orders = computed(() => (storeBagging.state.bagging as any).bagging.bags)
    const bagUpdates = computed(() => (storeBagging.state.bagging as any).bagging.bagUpdates)
    const bagItem = ref({})

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
    const dialog = ref({
      track: false,
    })
    const dialogSettings = ref({
      loading: false,
      title: '',
      content: '',
      cancelText: '',
      submitText: '',
      submitColor: '',
    }) as Ref<ModalConfirm>

    // manage view
    const orderView = ref(0)
    const isOnListView = computed(() => {
      return orderView.value === 0
    })

    // manage table

    const selectedOrders = computed({
      get: () => {
        return props.value
      },
      set: (value) => {
        emit('input', value)
      },
    }) as Ref<Order[]>
    // const selectedOrders = ref([]) as Ref<Order[]>
    const actionExist = computed(() => {
      let temp = {
        updates: true,
        download: true,
      } as any
      if(props.isCompleteTabPartner) {
        temp = {
          edit: true,
          download: true,
        }
      }
      return temp
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
    const headers = computed(() => {
      let temp = initHeaders
      if(props.isCompleteTabPartner) {
        temp = [
          {
            text: 'Bag ID',
            value: 'group_name',
            width: 150,
          },
          {
            text: 'Orders',
            value: 'orderBags',
            width: 150,
          },
          {
            text: 'Sub-Bags',
            value: 'statusBags',
            sortable: false,
            width: 200,
          },
          {
            text: 'Origin Port',
            value: 'origin_port',
            sortable: false,
            width: 150,
          },
          {
            text: 'Destination Port',
            value: 'dest_port',
            sortable: false,
            width: 180,
          },
          {
            text: 'Weight',
            value: 'flight',
            sortable: false,
            width: 150,
          },
          {
            text: '',
            value: 'actions',
            sortable: false,
            width: 150,
          },
        ]
      }
      return temp
    }) as Ref<Header[]>
    const selectAllToggle = ({ items }: { items: Order[]; value: boolean }) => {
      if (selectedOrders.value.length === 0) {
        return (selectedOrders.value = [...items])
      } else {
        return (selectedOrders.value = [])
      }
    }
    const isLabelExistOnSelected = computed(() => {
      return selectedOrders.value.every((order: any) => order.labelPath)
    })
    const doResetPagination = () => {
      pagination.value = {
        ...pagination.value,
        page: 1,
      }
    }
    const doGetDetails = (data: Bagged) => {

    }
    const goToBatchView = (item: Order | BatchOrders) => {
      let batchId = ''

      if (isOnListView) {
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
      filterOrder.value = filterOrderInit
      filterBatch.value = filterBatchInit
    }

    // Debounced fetch
    const fetchTimer = ref(null) as unknown as Ref<any>
    const fetchDebounced = () => {
      clearTimeout(fetchTimer.value)

      fetchTimer.value = setTimeout(() => {
        fetch()
      }, 300)
    }
    // const fetchOrders = async (params: FilterDetails) => {
    //   const { page, itemsPerPage } = pagination.value
    //   const perPage = itemsPerPage !== -1 ? itemsPerPage : meta.value.totalCount
    //   let dataParams = {
    //     page,
    //     perPage,
    //   } as Object

    //   if (isOnListView.value) {
    //     const { sortBy, sortDesc } = params

    //     dataParams = app.$customUtils.setURLParams({
    //       ...dataParams,
    //       ...filterOrder.value,
    //       sortBy: sortBy && sortBy[0] === 'orderCode' ? 'order_code' : null,
    //       sortDesc: sortDesc ? sortDesc[0] : null,
    //     })
    //   } else {
    //     dataParams = app.$customUtils.setURLParams({
    //       ...dataParams,
    //       ...filterBatch.value,
    //     })
    //   }

    //   try {
    //     $fetchState.pending = true
    //     const url = isOnListView.value
    //       ? 'orders/getOrders'
    //       : 'orders/getBatchOrders'

    //     await storeOrders.dispatch(url, { params: dataParams })
    //   } catch (error) {
    //     return error
    //   } finally {
    //     $fetchState.pending = false
    //   }
    // }
    const { $fetchState, fetch } = useFetch(async () => {
      setTimeout(() => {
        storeApplications.commit('applications/RESET_ALERT')
      }, 3000)
      // await fetchOrders(pagination.value)
    })


    const fetchBagUpdates = async (bagID: string) => {

      try {
        $fetchState.pending = true


        await storeBagging.dispatch(
          'bagging/bagging/getBagsUpdate',
          {bagID}
        )
        $fetchState.pending = false
      } catch (error) {
        return error
      }
    }

    function doHandleModalTrack(data?: Bagged) {
      if(data && Object.keys(data).length) {
        fetchBagUpdates(data.id)
        bagItem.value = data
      } else {
        bagItem.value = {}
      }
      dialog.value.track = !dialog.value.track
    }

    const doDownloadSelectedLabel = async () => {
      if (selectedOrders.value.length === 0) return

      try {
        $fetchState.pending = true

        const response = await storeOrders.dispatch(
          'orders/getSelectedLabels',
          {
            data: {
              orderIds: selectedOrders.value.map((order) => order.id),
            },
          }
        )
        const fileName = `order_labels_${$dateFns.format(
          new Date(),
          'yyyy-MM-dd_HH-mm'
        )}.pdf`

        saveAs(response, fileName)
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
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
        $fetchState.pending = false
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
    watch(orderView, (_newView) => {
      doResetFilter()
      selectedOrders.value = []
    })

    const baggingPartnerActions = {
      movePage: (data: any) => {
        // console.log(data)
        router.push('/partner-portals/bagging/dsadsadsa')
      },
    }

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
      // fetchOrders,
      fetchDebounced,
      dialogSettings,
      dialog,
      doHandleModalTrack,
      bagUpdates,
      bagItem,

      baggingPartnerActions
    }
  },
  head: {},
})
</script>
