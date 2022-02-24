<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseHeadlinePage
      title="Client Connections"
      subtitle="View details and manage each connected client."
    >
      <template slot="addition">
        <span class="text--secondary font-weight-medium title">
          &bull; {{ meta.totalCount }} Total Connections
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
  useMeta,
  useStore,
  computed,
  ref,
  useFetch,
  reactive,
  watch,
} from '@nuxtjs/composition-api'

// Interfaces and types
import { VuexModuleClientConnections } from '~/types/clientConnections'
import { VuexModuleApplications } from '~/types/applications'

export default defineComponent({
  name: 'ClientConnectionsPages',
  setup() {
    useMeta({ titleTemplate: '%s | Client Connections' })

    // store manage
    const storeClientConnections = useStore<VuexModuleClientConnections>()
    const storeApplications = useStore<VuexModuleApplications>()
    const incomingOrders = computed(
      () => storeClientConnections.state.clientConnections.clientConnections
    )
    const meta = computed(
      () => storeClientConnections.state.clientConnections.meta
    )
    const pagination = ref({
      ...storeApplications.state.applications.pagination,
    })

    const headers = reactive([
      {
        text: 'Name',
        value: 'name',
      },
      {
        text: 'Contact Person',
        value: 'contactPerson',
        sortable: false,
      },
      {
        text: 'Status',
        value: 'status',
        sortable: false,
      },
    ])
    const fetchIncomingOrders = async () => {
      await storeClientConnections.commit(
        'clientConnections/SET_CLIENT_CONNECTIONS',
        [
          {
            id: '1',
            name: 'RayRay Global',
            contactPerson: 'Ray',
            status: 'Connected',
          },
          {
            id: '2',
            name: 'World Asia Logistic',
            contactPerson: 'Asia',
            status: 'Pending',
          },
        ]
      )
    }

    useFetch(() => {
      fetchIncomingOrders()
    })

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

    useMeta(() => ({ title: 'Partner Portal | Client Connections' }))

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
