<template>
  <section class="pa-4 pa-md-10 py-8 batchView">

    <BaseHeadlinePage
      title="Batch Order View"
      :subtitle="batchId"
    />
    <v-row>
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
    </v-row>

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
        small
        class="custom-chips"
      >
        {{chip.text}}
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
          <v-icon
            v-if="icon"
            left dark size="28"
          >
            {{ icon }}
          </v-icon>
          {{ text }}
        </v-btn>
      </template>
    </v-sheet>

    <v-card
      v-if="selectedTransferCost === 2"
      elevation="2"
    >
      <v-window v-model="step">
        <v-window-item :value="0">
          <OrdersBatchViewDetails
            :step="step"
            :node-calculators="nodeCalculators"
          />
        </v-window-item>

        <v-window-item :value="1">
          <OrdersBatchViewSummary
            :step="step"
            :node-calculators="nodeCalculators"
          />
        </v-window-item>
      </v-window>
    </v-card>

    <div
      v-if="selectedTransferCost === 1"
    >
      <v-card
        v-for="(x, i) in 4"
        :key="i"
        elevation="2"
        class="pl-6 pt-6 pb-6 pr-16 mb-6"
      >
        <v-row
        >
          <v-col
            cols="12"
            md="4"
            class="d-flex flex-column justify-space-between"
          >
            <div
              class="primary--text font-weight-bold"
            >
              LUWADSSA123123123
            </div>
            <div
              :style="'color: grey; font-size: 14px'"
            >
              4 items
            </div>
            <div
              class="font-weight-bold"
              :style="'color: grey; font-size: 14px'"
            >
              Prepaid
            </div>
          </v-col>
          <v-col
            cols="12"
            md="8"
            class="d-flex flex-column justify-space-between"
          >
            <div
              class="font-weight-bold"
            >
              Pos Malaysia
            </div>
            <v-divider
              :style="'border-bottom: 3px solid; border-color: red'"
            />
            <div
              class="d-flex justify-space-between"
            >
              <div
                class="grey--text"
                :style="'font-size: 14px'"
              >
                Order has been received at destination warehouse
              </div>
              <div
                :style="'font-size: 15px'"
              >
                17:12 Tue, Mar 15, 2024
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <div
        class="d-flex justify-space-between align-center"
      >
        <div
          :style="'font-size: 12px; color: red'"
        >
          6 Orders
        </div>
        <div
          class="btn-page"
        >
          15 Orders / Page
        </div>
      </div>

    </div>
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
  useFetch
} from '@nuxtjs/composition-api'
import { Order, VuexModuleOrders } from '~/types/orders'
import { FilterDetails } from '~/types/applications'

export interface ParseNodeCalc {
  orderCode: String
  "id": String
  "fmCost": Number
  "lmCost": Number
  "ccCost": Number
  "bobCost": Number
  "codCost": Number
  "total": Number
  "dnt": Number
  "adminFee": Number
  "currency": String
}

export default defineComponent({
  name: 'BatchPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const pagination = ref( {
      page: 1,
      itemsPerPage: 1000000,
      sortBy: [''],
      sortDesc: [true],
    })
    const { $dateFns, app } = useContext()
    const storeOrders = useStore<VuexModuleOrders>()
    const meta = computed(() => storeOrders.state.orders.meta)

    const ordersCode = computed(() => {
      const data = storeOrders.state.orders.orders
      let parsingData = [] as {id: string, orderCode: string}[] | []
      if(data && data.length > 0) {
        parsingData = [...data].map((x: Order) => {
          return {
            id: x.id,
            orderCode: x.orderCode
          }
        })
      }
      return parsingData
    })
    const nodeCalculators = computed(() => {
      const data = storeOrders.state.orders.orderDetails.nodeCalc
      let parsingData = [] as any
      if(ordersCode.value && ordersCode.value.length > 0) {
        parsingData = [...ordersCode.value].map((x: {id: string, orderCode: string}) => {
          const batch = data[x.id]
          return {
            orderCode: x.orderCode,
            "id": batch?.id,
            "fmCost": Number(batch?.fmCost),
            "lmCost": Number(batch?.lmCost),
            "ccCost": Number(batch?.ccCost),
            "bobCost": Number(batch?.bobCost),
            "codCost": Number(batch?.codCost),
            "total": Number(batch?.fmCost) + Number(batch?.lmCost) + Number(batch?.ccCost) + Number(batch?.bobCost) + Number(batch?.codCost),
            "dnt": Number(batch?.dutiesFee) + Number(batch?.taxFee),
            "adminFee": Number(batch?.fmTransmissionFee) + Number(batch?.lmTransmissionFee) + Number(batch?.ccTransmissionFee) + Number(batch?.bobTransmissionFee),
            "currency": batch?.currency
          }
        })
      }
      parsingData = [...parsingData].filter((y: ParseNodeCalc) => {
        return y.fmCost || y.ccCost || y.lmCost || y.bobCost || y.codCost
      })
      return parsingData
    })

    const itemDetail = computed(() => {
      let data = route.value?.params?.item
      if(!data) {
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
    const selectedTransferCost = ref(1) as string | unknown

    // manage windows
    const step = ref(1)
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
    // manage title
    useMeta(() => ({
      title: `Client Portal | Batch Orders View`,
    }))

    const doBackTo = () => {
      router.go(-1)
    }

    const fetchOrders = async (params: FilterDetails) => {
      const { page, itemsPerPage } = params
      const perPage = itemsPerPage !== -1 ? itemsPerPage : meta.value.totalCount
      let dataParams = {
        page,
        perPage,
      } as Object
      dataParams = app.$customUtils.setURLParams({
          ...dataParams,
          batchCode: route.value?.params?.batchId
        })

      try {
        $fetchState.pending = true
        const url = 'orders/getOrders'

        await storeOrders.dispatch(url, { params: dataParams })
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

    const { $fetchState, fetch } = useFetch(async () => {
      await getNodeCalculators()
      await fetchOrders(pagination.value)
    })

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
      nodeCalculators
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
}
</style>
