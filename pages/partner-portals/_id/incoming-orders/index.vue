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
        :selected-orders="[]"
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
            <v-btn
              color="error"
              :disabled="selectedOrders && selectedOrders.length === 0"
              class="mx-1"
              @click="toggleUpdate({isDelete: true})"
            >
              Delete Status
            </v-btn>
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
          :is-select-disabled="true"
          :show-select="true"
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
        :is-open="dialog.form" />
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
import { FilterDetails, ModalConfirm, VuexModuleApplications } from '~/types/applications'
import {
  IncomingOrder,
  VuexModuleIncomingOrders,
} from '~/types/partnerPortals/incomingOrders'

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
    text: 'Origin Port',
    value: 'originPort',
    sortable: false,
    width: 150,
  },
  {
    text: 'Destination',
    value: 'destination',
    sortable: false,
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
      updateTime: ''
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
    const isLabelExist = computed(() => {
      return incomingOrders.value.some((order) => order.labelPath)
    })

    // manage table
    const headers = ref(initHeaders) as Ref<Header[]>
    const selectedViews = ref([
      'orderCode',
      'batchId',
      'serviceType',
      'origin',
      'originPort',
      'destination',
      'destinationPort',
      'creationDate',
      'actions',
    ])
    const selectAllToggle = ({ items }: { items: IncomingOrder[]; value: boolean }) => {
      if (selectedOrders.value.length === 0) {
        // const selectedItems = items.filter((item) => {

        //   return item.labelPath
        // })
        const selectedItems = items

        return (selectedOrders.value = [...selectedItems])
      } else {
        return (selectedOrders.value = [])
      }
    }

    // update status
    const toggleUpdate = (params: {isDelete?: boolean}) => {
      if(params?.isDelete) {
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
    function updateStatus() {
      console.log('submit update date time', selectedUpdate.value)
      dialog.value.form = false
      selectedOrders.value = []
    }
    function deleteStatus() {
      console.log('submit delete', selectedOrders.value)
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
      isLabelExist,
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
      deleteStatus
    }
  },
  head: {},
})
</script>
