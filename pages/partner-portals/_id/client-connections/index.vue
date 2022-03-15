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

    <v-row align="center" justify="space-between" class="mb-4 rounded-xl">
      <v-col cols="12" md="6">
        <!-- Search filter -->
        <v-text-field
          v-model="filter.name"
          clearable
          outlined
          single-line
          dense
          rounded
          hide-details
          label="Search by client name"
          placeholder="Enter your client name..."
          background-color="white"
          type="search"
          class="input-filter elevation-1"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-select
          v-model="filter.status"
          :items="statusOptions"
          :disabled="$fetchState.pending"
          hide-details
          outlined
          single-line
          dense
          rounded
          clearable
          label="Filter by status connections"
          item-text="text"
          item-value="value"
          background-color="white"
          class="input-select-filter elevation-1"
        />
      </v-col>
    </v-row>

    <v-row align="stretch">
      <!-- If no have a pending or connected clients -->
      <v-expand-transition>
        <v-col
          v-if="clientConnections.length === 0 || $fetchState.pending"
          cols="12"
        >
          <v-card height="100%">
            <v-card-text>
              <v-expand-transition>
                <BaseLoading v-if="$fetchState.pending" />

                <BaseEmptyData
                  v-else
                  :is-on-filter="filter.name !== '' || filter.status !== ''"
                  page="Client Connections"
                  @refresh="refreshPage"
                />
              </v-expand-transition>
            </v-card-text>
          </v-card>
        </v-col>
      </v-expand-transition>

      <template v-if="clientConnections.length !== 0 && !$fetchState.pending">
        <v-col
          v-for="connections in clientConnections"
          :key="connections.id"
          cols="12"
          md="3"
        >
          <v-expand-transition>
            <v-card height="100%" elevation="2">
              <v-card-text class="text-center">
                <v-chip
                  :color="connections.status === 'pending' ? 'warning' : 'info'"
                  small
                >
                  {{ connections.status }}
                </v-chip>

                <p class="text-h5 text--primary mt-2 mb-0 font-weight-medium">
                  {{ connections.client.name }}
                </p>
              </v-card-text>

              <v-card-actions>
                <v-spacer />

                <v-btn
                  v-if="connections.status === 'pending'"
                  color="primary"
                  class="mx-2"
                  :loading="$fetchState.pending"
                  @click="doAcceptConnections(connections.id)"
                >
                  Accept
                </v-btn>

                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-expand-transition>
        </v-col>
      </template>
    </v-row>

    <v-row align="center" justify="space-between" class="mt-8 rounded-xl">
      <v-col cols="12" md="auto">
        <v-select
          v-model="pagination.itemsPerPage"
          :items="itemsPerPageOptions"
          :disabled="$fetchState.pending"
          hide-details
          outlined
          single-line
          dense
          rounded
          item-text="text"
          item-value="value"
          background-color="white"
          class="input-select-filter elevation-1"
          :style="[{ width: $vuetify.breakpoint.mobile ? '100%' : '50%' }]"
        />
      </v-col>

      <v-col cols="12" md="auto">
        <v-pagination
          v-model="pagination.page"
          :length="meta.totalPage"
          :disabled="$fetchState.pending"
          circle
        />
      </v-col>
    </v-row>

    <v-snackbar
      :value="alert.isShow"
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
  defineComponent,
  useMeta,
  useStore,
  computed,
  ref,
  Ref,
  useFetch,
  watch,
  nextTick,
} from '@nuxtjs/composition-api'

// Interfaces and types
import { VuexModuleClientConnections } from '~/types/partnerPortals/clientConnections'
import { FilterDetails, VuexModuleApplications } from '~/types/applications'

export default defineComponent({
  name: 'ClientConnectionsPages',
  setup(_props, { root }) {
    useMeta({ titleTemplate: '%s | Client Connections' })

    // store manage
    const storeClientConnections = useStore<VuexModuleClientConnections>()
    const storeApplications = useStore<VuexModuleApplications>()
    const clientConnections = computed(
      () =>
        storeClientConnections.state.partnerPortals.clientConnections
          .clientConnections
    )
    const alert = computed(() => storeApplications.state.applications.alert)
    const meta = computed(
      () => storeClientConnections.state.partnerPortals.clientConnections.meta
    )
    const pagination = ref({
      ...storeApplications.state.applications.pagination,
    })
    const filter = ref({
      ...storeClientConnections.state.partnerPortals.clientConnections.filter,
    })

    const itemsPerPageOptions = computed(() => {
      const textDefault = 'Items/Page'
      const values = [5, 10, 15, 20]

      return values.map((value) => ({
        text: `${value} ${textDefault}`,
        value,
      }))
    })
    const statusOptions = computed(() => [
      {
        text: 'Pending',
        value: 'pending',
      },
      {
        text: 'Connected',
        value: 'connected',
      },
    ])

    const fetchClientConnections = async (params: FilterDetails) => {
      const { page, itemsPerPage } = params
      const perPage = itemsPerPage !== -1 ? itemsPerPage : meta.value.totalCount
      const name = filter.value.name ?? null
      const status = filter.value.status ?? null
      const dataParams = {
        page,
        perPage,
        name,
        status,
      }

      try {
        await storeClientConnections.dispatch(
          'partnerPortals/clientConnections/getClientConnections',
          dataParams
        )
      } catch (error) {
        return error
      }
    }
    const refreshPage = () => {
      filter.value = {
        name: '',
        status: '',
      }
      pagination.value = {
        ...pagination.value,
        page: 1,
      }

      nextTick(() => {
        root.$nuxt.refresh()
      })
    }
    const doAcceptConnections = async (value: string) => {
      try {
        $fetchState.pending = true

        const response = await storeClientConnections.dispatch(
          'partnerPortals/clientConnections/acceptClientConnections',
          value
        )

        if (response !== 'ok') throw response

        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'success',
          message: 'Successfully connected to client!',
        })
        fetch()
      } catch (error) {
        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'error',
          message: 'Accepting client connection failed!',
        })
      } finally {
        $fetchState.pending = false
        setTimeout(() => {
          storeApplications.commit('applications/RESET_ALERT')
        }, 3000)
      }
    }

    const { $fetchState, fetch } = useFetch(async () => {
      await fetchClientConnections(pagination.value)
    })
    // Debounced fetch
    const fetchTimer = ref(null) as unknown as Ref<any>
    const fetchDebounced = () => {
      clearTimeout(fetchTimer.value)

      fetchTimer.value = setTimeout(() => {
        fetch()
      }, 500)
    }

    useMeta(() => ({ title: 'Partner Portal | Client Connections' }))

    // manage filter on changed
    watch(
      filter,
      (newFilter) => {
        pagination.value = {
          ...pagination.value,
          page: 1,
        }
        storeApplications.commit(
          'partnerPortals/clientConnections/SET_FILTER',
          {
            ...newFilter,
          }
        )

        fetchDebounced()
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

    return {
      alert,
      clientConnections,
      meta,
      pagination,
      filter,
      itemsPerPageOptions,
      statusOptions,
      fetchClientConnections,
      refreshPage,
      doAcceptConnections,
    }
  },
  head: {},
})
</script>
