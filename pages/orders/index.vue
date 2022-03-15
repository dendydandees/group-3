<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseHeadlinePage
      title="Manage Orders"
      subtitle="View the details of each order or make changes to a order."
    >
      <template slot="addition">
        <span class="text--secondary font-weight-medium title">
          &bull; {{ meta.totalCount }} Total Orders
        </span>
      </template>
    </BaseHeadlinePage>

    <v-row align="center" justify="end">
      <v-col>
        <v-btn
          v-if="isOnListView"
          :disabled="selectedOrders.length === 0 || $fetchState.pending"
          outlined
          color="primary"
        >
          Download Labels
        </v-btn>

        <v-btn
          :depressed="isShowFilter"
          :outlined="isShowFilter"
          :disabled="$fetchState.pending"
          color="primary"
          class="mx-2"
          @click="isShowFilter = !isShowFilter"
        >
          Filter
        </v-btn>

        <span v-if="isOnListView" class="subtitle-2 text--secondary">
          {{ selectedOrders.length }} Orders selected
        </span>
      </v-col>

      <v-col cols="12" md="auto" class="d-flex align-center">
        <v-btn-toggle v-model="orderView" mandatory rounded dark class="mx-2">
          <template v-for="({ icon, text }, index) in listView">
            <v-tooltip :key="index" top color="primary">
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  color="primary"
                  :disabled="$fetchState.pending || text === 'Batch view'"
                  v-on="on"
                >
                  <v-icon>{{ icon }}</v-icon>
                </v-btn>
              </template>

              <span>{{ text }}</span>
            </v-tooltip>
          </template>
        </v-btn-toggle>

        <v-btn
          :disabled="$fetchState.pending"
          color="primary"
          nuxt
          to="/orders/upload"
        >
          Upload Orders
        </v-btn>
      </v-col>
    </v-row>

    <v-expand-transition>
      <v-row v-if="isShowFilter" align="center">
        <v-col cols="12">
          <v-sheet class="white pa-6 elevation-1 rounded-xl">
            <span class="subtitle-1 font-weight-medium mb-4 d-block">
              Filter
            </span>

            <v-row align="center" class="ma-0">
              <v-col v-if="isOnListView" cols="12" md="6">
                <v-text-field
                  v-model="filter.orderCode"
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
                  @change="fetchDebounced"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="filter.batchId"
                  clearable
                  outlined
                  dense
                  rounded
                  single-line
                  hide-details
                  label="Search by batch code"
                  placeholder="Enter your batch code..."
                  background-color="white"
                  type="search"
                  class="input-filter elevation-1"
                  @change="fetchDebounced"
                />
              </v-col>
            </v-row>

            <div class="d-flex mt-6">
              <v-spacer />

              <v-btn text color="error" small @click="doResetFilter">
                Clear Filter
              </v-btn>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-expand-transition>

    <v-fade-transition hide-on-leave>
      <v-row v-show="isOnListView" align="center" class="my-4">
        <v-col cols="12">
          <v-data-table
            v-model="selectedOrders"
            item-key="id"
            :items="orders"
            :headers="headers"
            :options="pagination"
            :loading="$fetchState.pending"
            hide-default-footer
            show-select
            class="elevation-2"
            @update:options="fetchOrders"
          >
            <template #[`item.orderCode`]="{ item }">
              <v-btn text color="primary" @click="doGetDetails(item)">
                {{ item.orderCode }}

                <span v-if="item.refID" class="ml-1">
                  (#{{ item.refID }})
                </span>
              </v-btn>
            </template>

            <template #[`item.serviceType`]="{ item }">
              <template v-if="item.requestedServices">
                <v-chip
                  v-for="service in item.requestedServices"
                  :key="service"
                  small
                  :color="service === 'LAST_MILE' ? 'primary' : 'secondary'"
                  class="text-uppercase mb-2 white--text"
                >
                  {{ $customUtils.setServiceType(service) }}
                </v-chip>
              </template>
            </template>

            <!-- Origin data -->
            <template #[`item.origin`]="{ item }">
              <div class="text--secondary my-2">
                {{ item.consigneeState }}
              </div>
            </template>

            <!-- Destination data -->
            <template #[`item.destination`]="{ item }">
              <div class="text--secondary my-2">
                {{ item.pickupState }}
              </div>
            </template>

            <template #[`item.actions`]="{ item }">
              <div class="d-flex align-center">
                <v-btn
                  small
                  download
                  :href="item.labelPath || ''"
                  :loading="$fetchState.pending"
                  :disabled="!item.labelPath"
                  color="info"
                  class="ma-2"
                >
                  Download
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-fade-transition>

    <v-row align="center" justify="space-between">
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
          @change="pagination.page = 1"
        />
      </v-col>

      <v-col cols="12" md="auto">
        <v-pagination
          v-model="pagination.page"
          :length="meta.totalPage"
          :disabled="$fetchState.pending"
          :total-visible="7"
          circle
        />
      </v-col>
    </v-row>

    <v-snackbar
      :value="alert.isShow && alert.message.includes('Order')"
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
  reactive,
  watch,
  ref,
  useMeta,
  useRouter,
  Ref,
} from '@nuxtjs/composition-api'
// Interfaces or types
import { Order, VuexModuleOrders } from '~/types/orders'
import { FilterDetails, VuexModuleApplications } from '~/types/applications'

export default defineComponent({
  name: 'OrderPages',
  layout: 'default',
  setup() {
    useMeta({ titleTemplate: '%s | Orders' })
    const router = useRouter()

    // store manage
    const storeOrders = useStore<VuexModuleOrders>()
    const storeApplications = useStore<VuexModuleApplications>()
    const orders = computed(() => storeOrders.state.orders.orders)
    const meta = computed(() => storeOrders.state.orders.meta)
    const pagination = ref({
      ...storeApplications.state.applications.pagination,
    })
    const filter = ref({
      ...storeOrders.state.orders.filter,
    })
    const alert = computed(() => storeApplications.state.applications.alert)

    // manage view
    const listView = ref([
      {
        icon: 'mdi-view-list',
        text: 'List view',
      },
      {
        icon: 'mdi-select-group',
        text: 'Batch view',
      },
    ])
    const orderView = ref(0)
    const isOnListView = computed(() => {
      return orderView.value === 0
    })

    // manage table
    const selectedOrders = ref([])
    const headers = reactive([
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
    ])
    const itemsPerPageOptions = computed(() => {
      const textDefault = 'Items/Page'
      const values = [5, 10, 15, 20]

      return values.map((value) => ({
        text: `${value} ${textDefault}`,
        value,
      }))
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

    // manage filter
    const isShowFilter = ref(false)
    const doResetFilter = () => {
      filter.value = {
        orderCode: '',
        batchId: '',
      }
    }

    // Debounced fetch
    const fetchTimer = ref(null) as unknown as Ref<any>
    const fetchDebounced = () => {
      clearTimeout(fetchTimer.value)

      fetchTimer.value = setTimeout(() => {
        fetch()
      }, 500)
    }
    const fetchOrders = async (params: FilterDetails) => {
      const { page, itemsPerPage } = pagination.value
      const { sortBy, sortDesc } = params
      const perPage = itemsPerPage !== -1 ? itemsPerPage : meta.value.totalCount
      const orderCode = filter?.value.orderCode ?? null
      const batchId = filter?.value.batchId ?? null
      const dataParams = {
        page,
        perPage,
        orderCode,
        batchId,
        sortBy: sortBy && sortBy[0] === 'orderCode' ? 'order_code' : null,
        sortDesc: sortDesc ? sortDesc[0] : null,
      }

      try {
        $fetchState.pending = true

        await storeOrders.dispatch('orders/getOrders', { params: dataParams })
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const { $fetchState, fetch } = useFetch(async () => {
      switch (isOnListView.value) {
        case true:
          await fetchOrders(pagination.value)
          break
        default:
          break
      }
    })

    // manage filter on changed
    watch(
      filter,
      (newFilter) => {
        doResetPagination()
        storeApplications.commit('orders/SET_FILTER', {
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

        fetch()
      },
      { deep: true }
    )
    // manage view on changed
    watch(orderView, (_newView) => {
      doResetFilter()
      doResetPagination()
    })

    return {
      orders,
      meta,
      pagination,
      filter,
      alert,
      listView,
      orderView,
      isOnListView,
      selectedOrders,
      headers,
      itemsPerPageOptions,
      doGetDetails,
      isShowFilter,
      doResetFilter,
      fetchOrders,
      fetchDebounced,
    }
  },
  head: {},
})
</script>
