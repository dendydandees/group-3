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
          <OrdersViewSettings
            v-model="selectedViews"
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
          <OrdersFilterListView v-model="filterOrders" />
        </template>
      </OrdersFiltersContainer>
    </v-expand-transition>

    <v-row align="center">
      <v-col cols="12">
        <BaseTable
          item-key="id"
          :items="incomingOrders"
          :headers="headers"
          :options="pagination"
          :loading="$fetchState.pending"
          @fetch="fetchIncomingOrders"
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
} from '@nuxtjs/composition-api'
// Interface and types
import { FilterDetails, VuexModuleApplications } from '~/types/applications'
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
] as Header[]

export default defineComponent({
  name: 'OrdersIncomingPages',
  middleware: 'partner',
  setup() {
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

    // manage table
    const headers = ref(initHeaders) as Ref<Header[]>
    const selectedViews = ref([
      'orderCode',
      'batchId',
      'serviceType',
      'destination',
      'origin',
      'actions',
    ])
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
      filterOrders.value = {
        orderCode: '',
        batchId: '',
        createdFrom: '',
        createdTo: '',
        serviceType: '',
        originCountry: '',
        destinationCountry: '',
      }
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
      const orderCode = filterOrders?.value?.orderCode ?? null
      const dataParams = {
        page,
        perPage,
        orderCode,
      }

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
      headers,
      selectedViews,
      doGetDetails,
      doGetBatchDetails,
      // manage filter order
      isShowFilter,
      doResetFilter,
      // manage fetch
      fetchIncomingOrders,
      fetchDebounced,
    }
  },
  head: {},
})
</script>
