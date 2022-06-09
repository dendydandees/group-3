<template>
  <section class="pa-4 pa-md-10 py-8 batchView">
    <BaseHeadlinePage title="Batch Order View" :subtitle="batchId" />
    <!-- <v-row>
      <v-col
        cols="12"
        md="10"
      >
        <v-list>
          <v-list-item
          >
            <v-list-item-title class="font-weight-bold">
              Origin Country
            </v-list-item-title>
            <v-list-item-title class="font-weight-bold">
              Origin Port
            </v-list-item-title>
            <v-list-item-title class="font-weight-bold">
              Destination Country
            </v-list-item-title>
            <v-list-item-title class="font-weight-bold">
              Destination Port
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="itemDetail"
          >
            <v-list-item-title class="font-weight-bold primary--text">
              {{itemDetail.senderCountry}}
            </v-list-item-title>
            <v-list-item-title class="font-weight-bold primary--text">
              {{itemDetail.senderPort.code}}
            </v-list-item-title>
            <v-list-item-title class="font-weight-bold primary--text">
              {{itemDetail.consigneeCountry}}
            </v-list-item-title>
            <v-list-item-title class="font-weight-bold primary--text">
              {{itemDetail.destPort.code}}
            </v-list-item-title>
          </v-list-item>
        </v-list>

      </v-col>
    </v-row> -->

    <v-chip-group
      v-model="selectedTransferCost"
      active-class="primary accent-4 white--text"
      column
      class="mb-10 mt-4"
      mandatory
    >
      <v-chip
        v-for="(chip, i) in transferCost"
        :key="i"
        :value="chip.value"
        :disabled="$fetchState.pending"
        small
        class="custom-chips"
      >
        {{ chip.text }}
      </v-chip>
    </v-chip-group>

    <v-sheet
      v-if="selectedTransferCost === 2"
      color="transparent"
      width="100%"
      class="mx-10"
    >
      <template v-for="({ text, icon }, index) in stepList">
        <v-btn
          :key="text"
          :color="isActive(index) ? 'primary' : 'white'"
          :class="[isActive(index) ? 'white--text' : 'primary--text']"
          class="custom-tab mx-2"
          @click="doChangeWindow(index)"
        >
          <v-icon v-if="icon" left dark size="28">
            {{ icon }}
          </v-icon>
          {{ text }}
        </v-btn>
      </template>
    </v-sheet>

    <v-row
      v-if="$fetchState.pending"
      class="fill-height"
      align-content="center"
      justify="center"
    >
      <v-col class="text-subtitle-1 text-center" cols="12">
        Getting the data...
      </v-col>
      <v-col cols="6">
        <v-progress-linear
          color="primary"
          indeterminate
          rounded
          height="6"
        ></v-progress-linear>
      </v-col>
    </v-row>

    <v-scroll-y-transition hide-on-leave>
      <template v-if="!$fetchState.pending">
        <v-card v-if="selectedTransferCost === 2" elevation="2">
          <v-window v-model="step">
            <v-window-item :value="0">
              <v-scroll-y-transition hide-on-leave>
                <OrdersBatchViewSummary
                  :step="step"
                  :node-calculators="nodeCalculators"
                />
              </v-scroll-y-transition>
            </v-window-item>

            <v-window-item :value="1">
              <v-scroll-y-transition hide-on-leave>
                <OrdersBatchViewDetails
                  :step="step"
                  :node-calculators="nodeCalculators"
                />
              </v-scroll-y-transition>
            </v-window-item>
          </v-window>
        </v-card>

        <div v-if="selectedTransferCost === 1">
          <v-card
            v-for="(x, i) in ordersData"
            :key="i"
            elevation="2"
            class="pl-6 pt-6 pb-6 pr-16 mb-6"
            :disabled="$fetchState.pending"
          >
            <v-row>
              <v-col
                cols="12"
                md="4"
                class="d-flex flex-column justify-space-between"
              >
                <div
                  class="primary--text font-weight-bold custom-text-btn"
                  @click="doGetDetails(x)"
                >
                  {{ x.orderCode }}
                </div>
                <div :style="'color: grey; font-size: 14px'">
                  {{
                    x.items && typeof x.items === 'object' ? x.items.length : 0
                  }}
                  items
                </div>
                <div
                  class="font-weight-bold"
                  :style="'color: grey; font-size: 14px'"
                >
                  {{ x.paymentType }}
                </div>
              </v-col>
              <v-col
                v-if="x.orderAllocations && x.orderAllocations.length > 0"
                cols="12"
                md="8"
                class="d-flex flex-column justify-space-between"
              >
                <div class="font-weight-bold">
                  {{ findNamePartner(x.orderAllocations[0].partnerID) }}
                  <!-- Pos Malaysia -->
                </div>
                <!-- <v-divider
              :style="'border-bottom: 3px solid; border-color: red'"
            /> -->
                <div
                  v-if="
                    x.orderAllocations[0].updates &&
                    x.orderAllocations[0].updates.length > 0
                  "
                  class="d-flex justify-space-between"
                >
                  <div class="grey--text" :style="'font-size: 14px'">
                    {{ lastStatus(x.orderAllocations) }}
                    <!-- {{x.orderAllocations[0].updates[0].comments}} -->
                  </div>
                  <div :style="'font-size: 15px'">
                    {{
                      $dateFns.format(
                        x.orderAllocations[0].updates[0].updateTimestamp,
                        'HH:mm E, MMM dd, yyyy'
                      )
                    }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>

          <div class="d-flex justify-space-between align-center">
            <div :style="'font-size: 12px; color: red'">
              {{ meta.totalCount }} Orders
            </div>

            <div class="d-flex align-center justify-center">
              <div>
                <v-btn
                  fab
                  small
                  plain
                  :disabled="
                    paginationTracking.page === 1 || $fetchState.pending
                  "
                  @click="nextOrPrev('-')"
                >
                  <v-icon dense color="black"> mdi-menu-left </v-icon>
                </v-btn>
              </div>
              <div class="px-3">
                {{ meta.page }}
              </div>
              <div>
                <v-btn
                  fab
                  small
                  plain
                  :disabled="
                    paginationTracking.page >= meta.totalPage ||
                    $fetchState.pending
                  "
                  @click="nextOrPrev('+')"
                >
                  <v-icon dense color="black"> mdi-menu-right </v-icon>
                </v-btn>
              </div>
            </div>
            <div class="btn-page">
              {{ ordersData && ordersData.length ? ordersData.length : 0 }}
              Orders / Page
            </div>
          </div>
        </div>
      </template>
    </v-scroll-y-transition>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  useMeta,
  useRouter,
  useRoute,
  ref,
  computed,
  onUnmounted,
  useStore,
  useContext,
  useFetch,
  watch,
} from '@nuxtjs/composition-api'
import { Order, VuexModuleOrders, OrderAllocationData } from '~/types/orders'
import { VuexModuleMarketplaces } from '~/types/marketplace/marketplace'
import { FilterDetails } from '~/types/applications'

export interface ParseNodeCalc {
  orderCode: String
  id: String
  fmCost: Number
  lmCost: Number
  ccCost: Number
  bobCost: Number
  codCost: Number
  total: Number
  dnt: Number
  adminFee: Number
  currency: String
}

export default defineComponent({
  name: 'BatchPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const pagination = ref({
      page: 1,
      itemsPerPage: 1000000,
      sortBy: [''],
      sortDesc: [true],
    })
    const paginationTracking = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [''],
      sortDesc: [true],
    })
    const { app } = useContext()
    const storeOrders = useStore<VuexModuleOrders>()
    const storeMarketplaces = useStore<VuexModuleMarketplaces>()
    const marketplaces = computed(
      () => storeMarketplaces.state.marketplaces.marketplaces.marketplaces
    )
    const meta = computed(() => storeOrders.state.orders.meta)

    const ordersData = computed(() => {
      const order = storeOrders.state.orders.orders as Order[]
      return order
    })
    const ordersCode = computed(() => {
      const data = storeOrders.state.orders.ordersBatchView
      let parsingData = [] as { id: string; orderCode: string }[] | []
      if (data && data.length > 0) {
        parsingData = [...data].map((x: Order) => {
          return {
            id: x.id,
            orderCode: x.orderCode,
          }
        })
      }
      return parsingData
    })
    const nodeCalculators = computed(() => {
      const data = storeOrders.state.orders.orderDetails.nodeCalc
      let parsingData = [] as any
      if (ordersCode.value && ordersCode.value.length > 0) {
        parsingData = [...ordersCode.value].map(
          (x: { id: string; orderCode: string }) => {
            const batch = data[x.id]
            return {
              orderCode: x.orderCode,
              id: batch?.id,
              orderId: x.id,
              fmCost: Number(batch?.fmCost),
              lmCost: Number(batch?.lmCost),
              ccCost: Number(batch?.ccCost),
              bobCost: Number(batch?.bobCost),
              codCost: Number(batch?.codCost),
              total:
                Number(batch?.fmCost) +
                Number(batch?.lmCost) +
                Number(batch?.ccCost) +
                Number(batch?.bobCost) +
                Number(batch?.codCost),
              dnt: Number(batch?.dutiesFee) + Number(batch?.taxFee),
              adminFee:
                Number(batch?.fmTransmissionFee) +
                Number(batch?.lmTransmissionFee) +
                Number(batch?.ccTransmissionFee) +
                Number(batch?.bobTransmissionFee),
              currency: batch?.currency,
            }
          }
        )
      }
      parsingData = [...parsingData].filter((y: ParseNodeCalc) => {
        return y.fmCost || y.ccCost || y.lmCost || y.bobCost || y.codCost
      })
      return parsingData
    })

    const itemDetail = computed(() => {
      let data = route.value?.params?.item
      if (!data) {
        data = JSON.parse(localStorage.getItem('batch.data') as any)
      }
      return data
    })
    const batchId = route.value?.params?.batchId

    onUnmounted(() => {
      localStorage.removeItem('batch.data')
    })

    // manage transfer cost
    const transferCost = ref([
      {
        text: 'Tracker',
        value: 1,
      },
      {
        text: 'Cost',
        value: 2,
      },
    ])
    const selectedTransferCost = ref(storeOrders.state.orders.tabBatchView.selectedTransferCost) as string | unknown

    // manage windows
    const step = ref(storeOrders.state.orders.tabBatchView.step)
    const stepList = ref([
      {
        text: 'Summary',
        icon: '',
      },
      {
        text: 'Details',
        icon: '',
      },
    ])
    const isActive = (data: number) => step.value === data
    const doChangeWindow = (data: number) => {
      step.value = data
    }


    watch(
      [selectedTransferCost, step],
      ([newSelectedTransferCost, newStep]) => {

        storeOrders.commit('orders/SET_TAB_BTN_BATCHVIEW', {
          selectedTransferCost: newSelectedTransferCost,
          step: newStep
        })
      },
      { deep: true }
    )

    // manage title
    useMeta(() => ({
      title: `Client Portal | Batch Orders View`,
    }))

    const doBackTo = () => {
      router.go(-1)
    }

    const fetchOrders = async ({
      params,
      isBatchView,
    }: {
      params: FilterDetails
      isBatchView?: Boolean
    }) => {
      const { page, itemsPerPage } = params
      const perPage = itemsPerPage !== -1 ? itemsPerPage : meta.value.totalCount
      let dataParams = {
        page,
        perPage,
      } as Object
      dataParams = app.$customUtils.setURLParams({
        ...dataParams,
        batchCode: route.value?.params?.batchId,
      })

      try {
        $fetchState.pending = true
        const url = 'orders/getOrders'

        await storeOrders.dispatch(url, { params: dataParams, isBatchView })
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }

    const getNodeCalculators = async () => {
      try {
        $fetchState.pending = true
        const url = 'orders/getNodeCalculators'

        await storeOrders.dispatch(url)
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }

    const fetchMarketplace = async () => {
      const dataParams = {
        page: 1,
        perPage: 1000,
      }

      try {
        // $fetchState.pending = true
        await storeMarketplaces.dispatch(
          'marketplaces/marketplaces/getMarketplaces',
          { params: dataParams, isLControl: false }
        )
      } catch (error) {
        return error
      } finally {
        // $fetchState.pending = false
      }
    }

    const { $fetchState } = useFetch(async () => {
      await fetchMarketplace()
      await getNodeCalculators()
      await fetchOrders({ params: pagination.value, isBatchView: true })
      await fetchOrders({ params: paginationTracking.value })
    })

    watch(
      paginationTracking,
      (newPagination) => {
        fetchOrders({ params: newPagination })
      },
      { deep: true }
    )

    const findNamePartner = (id: string) => {
      if (marketplaces.value && marketplaces.value.length > 0) {
        return marketplaces.value.filter((x) => x.id === id)[0]?.name
      }
    }

    const nextOrPrev = (type: string) => {
      switch (type) {
        case '+':
          paginationTracking.value = {
            ...paginationTracking.value,
            page: paginationTracking.value.page + 1,
          }
          break
        case '-':
          paginationTracking.value = {
            ...paginationTracking.value,
            page: paginationTracking.value.page - 1,
          }
          break
        default:
          break
      }
    }

    function lastStatus(orderAllocations: OrderAllocationData[]) {
      return orderAllocations[0].updates[0].comments
    }

    const doGetDetails = (data: any) => {
      // console.log({data})
      router.push(`/orders/${data.id}`)
    }

    return {
      step,
      stepList,
      isActive,
      doChangeWindow,
      doBackTo,
      transferCost,
      selectedTransferCost,
      batchId,
      itemDetail,
      ordersCode,
      nodeCalculators,
      ordersData,
      findNamePartner,
      meta,
      nextOrPrev,
      paginationTracking,
      lastStatus,
      doGetDetails
    }
  },
  head: {},
})
</script>

<style lang="scss">
.batchView {
  margin-bottom: 40rem;
  .custom-tab {
    border-top-left-radius: 16px !important;
    border-top-right-radius: 16px !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  .custom-bg {
    position: absolute;
    bottom: 500px;
    margin-left: -100px;
  }

  @media only screen and (min-width: 1024px) {
    .custom-bg {
      bottom: 300px;
      width: 100vw;
      margin-left: -100px;
    }
  }
  .v-list-item {
    min-height: 36px;
    padding: unset;
  }
  .custom-chips {
    color: $primary;
    background: transparent !important;
    border: 1px solid $primary;
    margin: 0px 8px 0px 0;
    padding: 15px 20px;
    font-size: 0.875rem;
    border-radius: 30px;

    &.v-chip--active {
      background: $primary !important;
    }

    &.blue {
      background: $primary !important;
      border: 1px solid $primary !important;
    }
  }
  .btn-page {
    border: 1px solid $primary;
    padding: 5px 15px;
    border-radius: 20px;
    color: $error;
    font-size: 12px;
  }
  .custom-text-btn {
    transition: all .3s;
    cursor: pointer;
    &:hover {
      opacity: .7;
    }
  }
}
</style>
