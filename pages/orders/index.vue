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

    <v-row align="center" justify="end">
      <!-- Left options -->
      <v-col>
        <v-btn
          v-if="isOnListView"
          :disabled="selectedOrders.length === 0 || $fetchState.pending"
          outlined
          color="primary"
          @click="doDownloadSelectedLabel"
        >
          Download Labels
        </v-btn>

        <v-btn
          :depressed="isShowFilter"
          :outlined="isShowFilter"
          :disabled="$fetchState.pending"
          color="primary"
          :class="[isOnListView ? 'mx-2' : '']"
          @click="isShowFilter = !isShowFilter"
        >
          Filter
        </v-btn>

        <span v-if="isOnListView" class="subtitle-2 text--secondary">
          {{ selectedOrders.length }} Orders selected
        </span>
      </v-col>

      <!-- Right options -->
      <v-col
        cols="12"
        md="auto"
        class="d-flex flex-column flex-md-row align-start align-md-center"
      >
        <v-menu
          v-if="isOnListView"
          bottom
          offset-y
          :close-on-content-click="false"
        >
          <template #activator="{ attrs, on }">
            <v-btn
              text
              :disabled="$fetchState.pending"
              color="primary"
              class="white--text mx-0 mx-md-2 mb-4 mb-md-0"
              v-bind="attrs"
              v-on="on"
            >
              View Settings

              <v-icon right> mdi-eye </v-icon>
            </v-btn>
          </template>

          <v-card color="transparent" style="backdrop-filter: blur(8px)">
            <v-row no-gutters class="py-4">
              <v-col cols="12" class="px-4">
                <span class="text--secondary subtitle-2">Only Show : </span>
              </v-col>

              <v-col cols="6">
                <v-list color="transparent">
                  <v-list-item>
                    <v-checkbox
                      v-model="selectedViews"
                      on-icon="mdi-checkbox-marked-circle"
                      off-icon="mdi-checkbox-blank-circle-outline"
                      label="Service Type"
                      value="serviceType"
                    />
                  </v-list-item>

                  <v-list-item>
                    <v-checkbox
                      v-model="selectedViews"
                      on-icon="mdi-checkbox-marked-circle"
                      off-icon="mdi-checkbox-blank-circle-outline"
                      label="Destination"
                      value="destination"
                    />
                  </v-list-item>
                </v-list>
              </v-col>

              <v-col cols="6">
                <v-list color="transparent">
                  <v-list-item>
                    <v-checkbox
                      v-model="selectedViews"
                      on-icon="mdi-checkbox-marked-circle"
                      off-icon="mdi-checkbox-blank-circle-outline"
                      label="Origin"
                      value="origin"
                    />
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card>
        </v-menu>

        <v-btn-toggle
          v-model="orderView"
          mandatory
          rounded
          dark
          class="mx-0 mx-md-2 mb-4 mb-md-0"
        >
          <template v-for="({ icon, text }, index) in listView">
            <v-tooltip :key="index" top color="primary">
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  color="primary"
                  :disabled="$fetchState.pending"
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

            <!-- Filter for order list -->
            <v-row v-if="isOnListView" align="center" class="ma-0">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="filterOrder.orderCode"
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
                  v-model="filterOrder.batchId"
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

            <!-- Filter for batch list -->
            <v-row v-else align="center" class="ma-0">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="filterBatch.batchId"
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
      <!-- List data for order -->
      <v-row v-if="isOnListView" align="center" class="my-4">
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
            @toggle-select-all="selectAllToggle"
          >
            <!-- checkbox on header table -->
            <template #[`header.data-table-select`]="{ props, on }">
              <v-simple-checkbox
                v-ripple
                on-icon="mdi-checkbox-marked-circle"
                off-icon="mdi-checkbox-blank-circle-outline"
                indeterminate-icon="mdi-checkbox-blank-circle"
                :disabled="$fetchState.pending || !isLabelExist"
                v-bind="props"
                v-on="on"
              />
            </template>

            <!-- checkbox on table body each item -->
            <template
              #[`item.data-table-select`]="{ item, isSelected, select }"
            >
              <v-simple-checkbox
                v-ripple
                on-icon="mdi-checkbox-marked-circle"
                off-icon="mdi-checkbox-blank-circle-outline"
                :value="isSelected"
                :disabled="$fetchState.pending || !item.labelPath"
                @input="select($event)"
              />
            </template>

            <!-- order item cell -->
            <template #[`item.orderCode`]="{ item }">
              <v-btn text color="primary" @click="doGetDetails(item)">
                {{ item.orderCode }}

                <span v-if="item.refID" class="ml-1">
                  (#{{ item.refID }})
                </span>
              </v-btn>
            </template>

            <!-- batch id cell -->
            <template #[`item.batchId`]="{ item }">
              <v-btn
                text
                color="primary"
                @click="doGetBatchDetails(item.batchId)"
              >
                {{ item.batchId }}
              </v-btn>
            </template>

            <!-- service type cell -->
            <template #[`item.serviceType`]="{ item }">
              <template v-if="item.requestedServices">
                <v-chip
                  v-for="service in item.requestedServices"
                  :key="service"
                  small
                  :color="$customUtils.setColorServiceType(service)"
                  class="text-uppercase white--text"
                >
                  {{ $customUtils.setServiceType(service) }}
                </v-chip>
              </template>
            </template>

            <!-- origin cell -->
            <template #[`item.origin`]="{ item }">
              <div class="text--secondary">
                {{ item.consigneeState }}
              </div>
            </template>

            <!-- destination cell -->
            <template #[`item.destination`]="{ item }">
              <div class="text--secondary">
                {{ item.pickupState }}
              </div>
            </template>

            <!-- actions cell -->
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

      <!-- List data for batch -->
      <v-row v-else align="center" class="my-4">
        <v-col cols="12">
          <v-card
            v-for="{ id, totalOrder, updatedAt, createdAt } in batchOrders"
            :key="id"
            elevation="2"
            class="my-4"
          >
            <v-card-text>
              <v-col cols="12">
                <h2 class="title font-weight-bold primary--text">{{ id }}</h2>
              </v-col>

              <v-col cols="12">
                <v-row>
                  <v-col cols="12" md="4">
                    <span class="d-block"> Last Updated </span>

                    <span class="d-block">
                      {{ $dayjs(updatedAt).format('MMM DD, YYYY HH:mm') }}
                    </span>
                  </v-col>

                  <v-col cols="12" md="4">
                    <span class="d-block"> Created </span>

                    <span class="d-block">
                      {{ $dayjs(createdAt).format('MMM DD, YYYY HH:mm') }}
                    </span>
                  </v-col>

                  <v-col cols="12" md="4">
                    <span class="d-block"> Number of Orders </span>

                    <span class="d-block"> {{ totalOrder }} </span>
                  </v-col>
                </v-row>
              </v-col>
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-btn color="primary" @click="doGetBatchDetails(id)">
                View Details
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-fade-transition>

    <!-- Pagination universal (order and batch view) -->
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
          circle
        />
      </v-col>
    </v-row>

    <v-snackbar
      :value="
        alert.isShow &&
        alert.message.includes('Order') &&
        alert.type === 'success'
      "
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
  watch,
  ref,
  useMeta,
  useRouter,
  Ref,
  useContext,
} from '@nuxtjs/composition-api'
import { saveAs } from 'file-saver'
// Interfaces or types
import { Order, VuexModuleOrders } from '~/types/orders'
import { FilterDetails, VuexModuleApplications } from '~/types/applications'

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
  {
    text: '',
    value: 'actions',
    sortable: false,
  },
] as Header[]

export default defineComponent({
  name: 'OrderPages',
  layout: 'default',
  setup(_props) {
    useMeta({ titleTemplate: '%s | Orders' })
    const { $dayjs } = useContext()
    const router = useRouter()

    // store manage
    const storeOrders = useStore<VuexModuleOrders>()
    const storeApplications = useStore<VuexModuleApplications>()
    const orders = computed(() => storeOrders.state.orders.orders)
    const batchOrders = computed(() => storeOrders.state.orders.batchOrders)
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
    const selectedOrders = ref([]) as Ref<Order[]>
    const isLabelExist = computed(() => {
      return orders.value.some((order) => order.labelPath)
    })
    const selectedViews = ref([
      'orderCode',
      'batchId',
      'serviceType',
      'destination',
      'origin',
      'actions',
    ])
    const headers = ref(initHeaders) as Ref<Header[]>
    const itemsPerPageOptions = computed(() => {
      const textDefault = 'Items/Page'
      const values = [5, 10, 15, 20]

      return values.map((value) => ({
        text: `${value} ${textDefault}`,
        value,
      }))
    })
    const selectAllToggle = ({ items }: { items: Order[]; value: boolean }) => {
      if (selectedOrders.value.length === 0) {
        const selectedItems = items.filter((item) => {
          return item.labelPath
        })

        return (selectedOrders.value = [...selectedItems])
      } else {
        return (selectedOrders.value = [])
      }
    }
    const doResetPagination = () => {
      pagination.value = {
        ...pagination.value,
        page: 1,
      }
    }
    const doGetDetails = (data: Order) => {
      router.push(`/orders/${data.id}`)
    }
    const doGetBatchDetails = (id: string) => {
      orderView.value = 0
      isShowFilter.value = true
      setTimeout(() => {
        filterOrder.value = {
          orderCode: '',
          batchId: id,
        }
      }, 100)
      setTimeout(() => {
        fetchDebounced()
      }, 500)
    }
    const doDownloadSelectedLabel = async () => {
      if (selectedOrders.value.length === 0) return

      const selectedLabels = {
        orderIds: selectedOrders.value.map((order) => order.id),
      }
      const response = (await storeOrders.dispatch('orders/getSelectedLabels', {
        data: selectedLabels,
      })) as string
      const fileName = `order_labels_${$dayjs().format('YYYY-MM-DD_HH-mm')}.pdf`

      saveAs(response, fileName)
    }

    // manage filter order
    const isShowFilter = ref(false)
    const doResetFilter = () => {
      filterOrder.value = {
        orderCode: '',
        batchId: '',
      }
      filterBatch.value = {
        batchId: '',
      }
    }

    // Debounced fetch
    const fetchTimer = ref(null) as unknown as Ref<any>
    const fetchDebounced = () => {
      clearTimeout(fetchTimer.value)

      fetchTimer.value = setTimeout(() => {
        fetch()
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
        const orderCode = filterOrder?.value.orderCode ?? null
        const batchId = filterOrder?.value.batchId ?? null

        dataParams = {
          ...dataParams,
          orderCode,
          batchId,
          sortBy: sortBy && sortBy[0] === 'orderCode' ? 'order_code' : null,
          sortDesc: sortDesc ? sortDesc[0] : null,
        }
      } else {
        const batchId = filterBatch?.value.batchId ?? null

        dataParams = {
          ...dataParams,
          batchId,
        }
      }

      try {
        $fetchState.pending = true

        if (isOnListView.value) {
          await storeOrders.dispatch('orders/getOrders', { params: dataParams })
        } else {
          await storeOrders.dispatch('orders/getBatchOrders', {
            params: dataParams,
          })
        }
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const { $fetchState, fetch } = useFetch(async () => {
      setTimeout(() => {
        storeApplications.commit('applications/RESET_ALERT')
      }, 3000)
      await fetchOrders(pagination.value)
    })

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

        fetch()
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
      doResetPagination()
      selectedOrders.value = []
    })

    return {
      orders,
      batchOrders,
      meta,
      pagination,
      filterOrder,
      filterBatch,
      alert,
      listView,
      orderView,
      isOnListView,
      selectedOrders,
      isLabelExist,
      selectedViews,
      headers,
      itemsPerPageOptions,
      doGetDetails,
      doGetBatchDetails,
      doDownloadSelectedLabel,
      isShowFilter,
      selectAllToggle,
      doResetFilter,
      fetchOrders,
      fetchDebounced,
    }
  },
  head: {},
})
</script>
