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
  useRoute,
  useStore,
  computed,
  ref,
  watch,
  reactive,
} from '@nuxtjs/composition-api'
import { FilterDetails, VuexModuleApplications } from '~/types/applications'
// Interface and types
import { VuexModuleIncomingOrders } from '~/types/incomingOrders'

export default defineComponent({
  name: 'OrdersIncomingPages',
  middleware: 'partner',
  setup() {
    const route = useRoute()
    // manage store
    const storeIncomingOrders = useStore<VuexModuleIncomingOrders>()
    const storeApplications = useStore<VuexModuleApplications>()
    const incomingOrders = computed(
      () => storeIncomingOrders.state.incomingOrders.incomingOrders
    )
    const meta = computed(() => storeIncomingOrders.state.incomingOrders.meta)
    const pagination = ref({
      ...storeApplications.state.applications.pagination,
    })

    const headers = reactive([
      {
        text: 'Order Code (#Ref)',
        value: 'incomingOrderCode',
      },
      {
        text: 'Consignee',
        value: 'incomingConsignee',
        sortable: false,
      },
      {
        text: 'Pickup',
        value: 'incomingPickup',
        sortable: false,
      },
      {
        text: 'Service Type',
        value: 'serviceType',
        sortable: false,
      },
    ])
    const fetchIncomingOrders = async (params: FilterDetails) => {
      const id = route.value.params.id
      const { page, itemsPerPage } = params
      const perPage = itemsPerPage !== -1 ? itemsPerPage : meta.value.totalCount
      const dataParams = {
        page,
        perPage,
      }
      try {
        $fetchState.pending = true

        await storeIncomingOrders.dispatch('incomingOrders/getIncomingOrders', {
          id,
          params: dataParams,
        })
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }

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

    const { $fetchState } = useFetch(async () => {
      await fetchIncomingOrders(pagination.value)
    })

    useMeta(() => ({ title: 'Partner Portal | Incoming Orders' }))

    return {
      incomingOrders,
      meta,
      pagination,
      headers,
      fetchIncomingOrders,
    }
  },
  head: {},
})
</script>
