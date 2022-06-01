<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseHeadlinePage
      title="Manage Incoming Orders"
      subtitle="View the details or make changes to a incoming order."
    >
      <template slot="addition">
        <span class="text--secondary font-weight-medium title">
          &bull; {{ meta.totalCount }} Total Incoming Orders
        </span>
      </template>
    </BaseHeadlinePage>

    <v-row align="center" justify="end">
      <!-- Left options -->
      <OrdersLeftOptions
        :is-on-list-view="false"
        :selected-orders="selectedOrders"
        :loading="$fetchState.pending"
        :is-show-filter="isShowFilter"
        @doShowFilter="isShowFilter = !isShowFilter"
      />

      <!-- Right options -->
      <OrdersRightOptions :loading="$fetchState.pending">
        <template #viewSettings>
          <div>
            <v-btn
              color="primary"
              :disabled="selectedOrders && selectedOrders.length === 0"
              class="mx-1"
              @click="toggleUpdate()"
            >
              Update Status
            </v-btn>
            <!-- <v-btn
              color="error"
              :disabled="selectedOrders && selectedOrders.length === 0"
              class="mx-1"
              @click="toggleUpdate({isDelete: true})"
            >
              Delete Status
            </v-btn> -->
            <OrdersViewSettings
              v-model="selectedViews"
              :loading="$fetchState.pending"
            />
          </div>
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
          <OrdersFilterListView v-model="filterOrders" />
        </template>
      </OrdersFiltersContainer>
    </v-expand-transition>

    <v-row align="center">
      <v-col cols="12">
        <BaseTable
          v-model="selectedOrders"
          item-key="id"
          :items="incomingOrders"
          :headers="headers"
          :options="pagination"
          :loading="$fetchState.pending"
          :is-select-disabled="isExternalTrackingExist"
          :show-select="true"
          :action-exist="actionExist"
          @fetch="fetchIncomingOrders"
          @doSelectAll="selectAllToggle"
          @doGetDetails="doGetDetails"
          @doGetBatchDetails="doGetBatchDetails"
        />
      </v-col>
    </v-row>

    <!-- Pagination universal (order and batch view) -->
    <BasePagination
      v-model="pagination"
      :meta="meta"
      :loading="$fetchState.pending"
      @resetPage="pagination.page = 1"
    />

    <!-- Update Status -->
    <BaseModalForm
      v-model="dialog.form"
      :dialog-settings="dialogSettings"
      @doSubmit="updateStatus"
    >
      <template #modalFields>
        <OrdersUpdateStatusContent
          v-model="selectedUpdate"
          :is-open="dialog.form"
        />
      </template>
    </BaseModalForm>

    <!-- Delete Status -->
    <BaseModalForm
      v-model="dialog.delete"
      :dialog-settings="dialogSettings"
      @doSubmit="deleteStatus"
    >
      <template #modalFields>
        <OrdersDeleteStatusContent
          :selected="selectedOrders"
          :is-open="dialog.delete"
        />
      </template>
    </BaseModalForm>
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
  Ref,
  watch,
  useRoute,
  useRouter,
  useContext,
  onMounted,
} from '@nuxtjs/composition-api'
import { filterOrderInit } from '~/store/partnerPortals/incomingOrders'
// Interface and types
import {
  FilterDetails,
  ModalConfirm,
  VuexModuleApplications,
  Alert,
  Header,
} from '~/types/applications'
import {
  IncomingOrder,
  OrderAllocation,
  VuexModuleIncomingOrders,
} from '~/types/partnerPortals/incomingOrders'
import { VuexModuleFilters, Statuses } from '~/types/filters'

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
  name: 'OrdersIncomingPages',
  middleware: 'partner',
  setup() {
    const { app } = useContext()
    const route = useRoute()
    const router = useRouter()
    // manage store
    const storeIncomingOrders = useStore<VuexModuleIncomingOrders>()
    const storeApplications = useStore<VuexModuleApplications>()
    const storeFilter = useStore<VuexModuleFilters>()
    const incomingOrders = computed(
      () =>
        storeIncomingOrders.state.partnerPortals.incomingOrders.incomingOrders
    )
    const meta = computed(
      () => storeIncomingOrders.state.partnerPortals.incomingOrders.meta
    )
    const pagination = ref({
      ...storeApplications.state.applications.pagination,
    })
    const filterOrders = ref({
      ...storeIncomingOrders.state.partnerPortals.incomingOrders.filterOrders,
    })

    // manage modal
    const selectedUpdate = ref({
      status: '',
      updateDate: '',
      updateTime: '',
    })
    const dialog = ref({
      confirm: false,
      form: false,
      delete: false,
    })
    const dialogSettings = ref({
      loading: false,
      title: '',
      content: '',
      cancelText: '',
      submitText: '',
      submitColor: '',
    }) as Ref<ModalConfirm>

    // manage table
    const selectedOrders = ref([]) as Ref<IncomingOrder[]>
    const actionExist = ref({
      download: true,
    })
    const isExternalTrackingExist = computed(() => {
      return incomingOrders.value.some((order: IncomingOrder) => {
        return order.orderAllocations.some(
          (el: OrderAllocation) => el.externalTrackingNumber
        )
      })
    })
    const headers = ref(initHeaders) as Ref<Header[]>
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
    const selectAllToggle = () => {
      if (selectedOrders.value.length === 0) {
        const selectedItems = incomingOrders.value.filter(
          (order: IncomingOrder) => {
            return order.orderAllocations.some(
              (el: OrderAllocation) => el.externalTrackingNumber
            )
          }
        )

        return (selectedOrders.value = [...selectedItems])
      } else {
        return (selectedOrders.value = [])
      }
    }

    // update status
    const toggleUpdate = (params: { isDelete?: boolean }) => {
      if (params?.isDelete) {
        dialogSettings.value = {
          loading: false,
          title: 'Delete Status',
          content: '',
          cancelText: 'Cancel',
          submitText: 'Delete',
          submitColor: 'error',
        }
        dialog.value.delete = true
      } else {
        dialogSettings.value = {
          loading: false,
          title: 'Update Status',
          content: '',
          cancelText: 'Cancel',
          submitText: 'Update',
          submitColor: 'primary',
        }
        dialog.value.form = true
      }
    }

    function setTime(data: number) {
      let decimalTime = data
      if (decimalTime < 0) decimalTime = decimalTime * -1
      decimalTime = decimalTime * 60 * 60
      let hours = Math.floor(decimalTime / (60 * 60)) as any
      decimalTime = decimalTime - hours * 60 * 60
      let minutes = Math.floor(decimalTime / 60) as any
      decimalTime = decimalTime - minutes * 60
      if (hours < 10) {
        hours = '0' + hours
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      return '' + hours + ':' + minutes
    }
    function setGMT(data: number) {
      const temp = setTime(data)
      if (data > 0) {
        return `+${temp}`
      } else {
        return `-${temp}`
      }
    }
    function setStatusRemarks(data: string, type: string) {
      let status = [...storeFilter.state.filters.statuses] as Statuses[]
      status = status.filter((el: Statuses) => el.Status === data)
      switch (type) {
        case 'remarks':
          return status[0]?.Remarks ?? ''
        case 'service':
          return status[0]?.ServiceType ?? ''
        default:
          return ''
      }
    }

    function setAlert(value: Alert) {
      storeApplications.commit('applications/SET_ALERT', value)
    }
    function resetAlert() {
      storeApplications.commit('applications/RESET_ALERT')
    }
    async function updateStatus() {
      // console.log('submit update date time', selectedUpdate.value)
      resetAlert()

      try {
        const arrStringIDs = [...selectedOrders.value].map(
          (el: IncomingOrder) => {
            return el.id
          }
        )
        const gmt = setGMT(new Date().getTimezoneOffset() / -60)
        const dateToISO = `${selectedUpdate.value.updateDate}T${selectedUpdate.value.updateTime}:00${gmt}`
        const payload = {
          orderIDs: arrStringIDs,
          status: selectedUpdate.value.status,
          timestamp: dateToISO,
          service_type: setStatusRemarks(
            selectedUpdate.value.status,
            'service'
          ),
          remarks: setStatusRemarks(selectedUpdate.value.status, 'remarks'),
        }

        $fetchState.pending = true

        const res = await storeIncomingOrders.dispatch(
          'partnerPortals/incomingOrders/updateStatus',
          payload
        )

        if (res?.response && res?.response?.status !== 200) {
          throw res?.response?.data?.error
        }
        dialog.value.form = false
        selectedOrders.value = []
      } catch (error: any) {
        setAlert({
          isShow: true,
          type: 'error',
          message: error,
        })
      } finally {
        $fetchState.pending = false
      }
    }
    function deleteStatus() {
      dialog.value.delete = false
      selectedOrders.value = []
    }

    const doResetPagination = () => {
      pagination.value = {
        ...pagination.value,
        page: 1,
      }
    }
    const doGetDetails = (data: IncomingOrder) => {
      const id = route.value.params.id

      router.push(`/partner-portals/${id}/incoming-orders/${data.id}`)
    }
    const doGetBatchDetails = (id: string) => {
      isShowFilter.value = true
      setTimeout(() => {
        filterOrders.value = {
          ...filterOrders.value,
          batchId: id,
        }
      }, 100)
      setTimeout(() => {
        fetchDebounced()
      }, 500)
    }

    // manage filter order
    const isShowFilter = ref(false)
    const doResetFilter = () => {
      filterOrders.value = filterOrderInit
    }

    // manage fetch
    const fetchTimer = ref(null) as unknown as Ref<any>
    const fetchDebounced = () => {
      clearTimeout(fetchTimer.value)

      fetchTimer.value = setTimeout(() => {
        fetch()
      }, 300)
    }
    const fetchIncomingOrders = async (_params: FilterDetails) => {
      const id = route.value.params.id
      const { page, itemsPerPage } = pagination.value
      const perPage = itemsPerPage !== -1 ? itemsPerPage : meta.value.totalCount
      const dataParams = app.$customUtils.setURLParams({
        page,
        perPage,
        ...filterOrders.value,
      })

      try {
        $fetchState.pending = true

        await storeIncomingOrders.dispatch(
          'partnerPortals/incomingOrders/getIncomingOrders',
          {
            id,
            params: dataParams,
          }
        )
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const { $fetchState, fetch } = useFetch(async () => {
      storeApplications.commit('applications/RESET_ALERT')

      await fetchIncomingOrders(pagination.value)
    })

    onMounted(() => {
      const batchId = route.value.query?.batchId as string

      if (batchId) {
        doGetBatchDetails(batchId)
      }
    })

    // manage filter on changed
    watch(
      filterOrders,
      (newFilter) => {
        doResetPagination()
        storeApplications.commit('partnerPortals/incomingOrders/SET_FILTER', {
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

    useMeta(() => ({ title: 'Partner Portal | Incoming Orders' }))

    return {
      // manage store
      incomingOrders,
      meta,
      pagination,
      filterOrders,
      // manage table
      selectedOrders,
      actionExist,
      selectedViews,
      headers,
      selectAllToggle,
      doGetDetails,
      doGetBatchDetails,
      // manage filter order
      isShowFilter,
      doResetFilter,
      // manage fetch
      fetchIncomingOrders,
      fetchDebounced,
      dialog,
      dialogSettings,
      toggleUpdate,
      selectedUpdate,
      updateStatus,
      deleteStatus,
      isExternalTrackingExist,
    }
  },
  head: {},
})
</script>
