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
          <OrdersBatchViewSummary :step="step" />
        </v-window-item>

        <v-window-item :value="1">
          <OrdersBatchViewDetails :step="step" />
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
  onUnmounted
} from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'BatchPage',
  setup() {
    const router = useRouter()
    const route = useRoute()

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
    const currentTitle = computed(() =>
      step.value === 0 ? 'Domestic' : 'Cross Border'
    )
    useMeta(() => ({
      title: `Client Portal | Upload ${currentTitle.value} Orders`,
    }))

    const doBackTo = () => {
      router.go(-1)
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
      itemDetail
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
