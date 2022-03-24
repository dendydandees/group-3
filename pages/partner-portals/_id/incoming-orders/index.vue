<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseHeadlinePage
      title="Manage Incoming Orders"
      subtitle="View the details of each order or make changes to a incoming order."
    >
      <template slot="addition">
        <span class="text--secondary font-weight-medium title">
          &bull; {{ meta.totalCount }} Total Incoming Orders
        </span>
      </template>
    </BaseHeadlinePage>

    <v-row align="center" class="my-8 mx-0">
      <v-col cols="12" md="6" class="px-0">
        <!-- Search filter field -->
        <v-text-field
          v-model="filter.search"
          clearable
          outlined
          dense
          rounded
          single-line
          hide-details
          label="Search by order code"
          placeholder="Enter your order code..."
          background-color="white"
          type="search"
          class="input-filter elevation-1"
        />
      </v-col>
    </v-row>

    <v-row align="center">
      <v-col cols="12">
        <BaseTableListServer
          v-model="pagination"
          item-key="id"
          :loading="$fetchState.pending"
          :items="incomingOrders"
          :headers="headers"
          :meta="meta"
          @fetch="fetchIncomingOrders"
        />
      </v-col>
    </v-row>
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
  watch,
  reactive,
  useRoute,
} from '@nuxtjs/composition-api'
import { FilterDetails, VuexModuleApplications } from '~/types/applications'
// Interface and types
import { VuexModuleIncomingOrders } from '~/types/partnerPortals/incomingOrders'

export default defineComponent({
  name: 'OrdersIncomingPages',
  middleware: 'partner',
  setup() {
    const route = useRoute()
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
    const filter = ref({
      ...storeIncomingOrders.state.partnerPortals.incomingOrders.filter,
    })

    const headers = reactive([
      {
        text: 'Order Code (#Ref)',
        value: 'incomingOrderCode',
        sortable: false,
      },
      {
        text: 'Service Type',
        value: 'serviceType',
        sortable: false,
      },
      {
        text: 'Origin',
        value: 'incomingOrigin',
        sortable: false,
      },
      {
        text: 'Destination',
        value: 'incomingPickup',
        sortable: false,
      },
    ])
    const fetchIncomingOrders = async (params: FilterDetails) => {
      const id = route.value.params.id
      const { page, itemsPerPage } = params
      const perPage = itemsPerPage !== -1 ? itemsPerPage : meta.value.totalCount
      const orderCode = filter?.value.search ?? null
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

    // manage filter on changed
    watch(
      filter,
      (newFilter) => {
        pagination.value = {
          ...pagination.value,
          page: 1,
        }
        storeApplications.commit('partnerPortals/incomingOrders/SET_FILTER', {
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

    const { $fetchState, fetch } = useFetch(async () => {
      storeApplications.commit('applications/RESET_ALERT')
      await fetchIncomingOrders(pagination.value)
    })

    useMeta(() => ({ title: 'Partner Portal | Incoming Orders' }))

    return {
      incomingOrders,
      meta,
      pagination,
      filter,
      headers,
      fetchIncomingOrders,
    }
  },
  head: {},
})
</script>
