<template>
  <section class="pa-4 pa-md-10 py-8 baggedPage">
    <BaseHeadlinePage
      title="Bagging Partner"
      subtitle="Bag parcels together and generate a single bag label for ease of shipping and tracking."
    >
      <!-- <template slot="addition">
        <span class="text--secondary font-weight-medium title">
          &bull; {{ '0' }} Total Orders
        </span>
      </template> -->
    </BaseHeadlinePage>

    <v-row align="center" justify="end" :style="'min-height: 72px'">
      <!-- Left options -->
      <OrdersLeftOptions
        :selected-orders="selectedINFO"
        :is-show-filter="isShowFilter"
        :is-on-bags-tab="{
          text: true,
          filter: true
        }"
        :is-unbagged="true"
        @doShowFilter="isShowFilter = !isShowFilter"
      />
        <!-- :loading="$fetchState.pending" -->

      <!-- Right options -->
      <OrdersRightOptions
        v-if="step === 2 || step === 3"
      >
        <!-- :loading="$fetchState.pending" -->
        <template #toggleView>
          <OrdersToggleView
            v-if="step !== 0"
            v-model="orderView"
            :is-bagging="true"
          />
        </template>
      </OrdersRightOptions>
      <v-btn
        v-if="step === 1"
        color="primary"
        min-width="200px"
        class="mr-2"
        :disabled="!selectedOrders.length"
        @click="handleManifest()"
      >
        Generate Manifest
      </v-btn>
      <v-btn
        v-if="step === 2 || step === 3"
        color="primary"
        min-width="200px"
        :disabled="!Object.keys(selectedUnbagged).length && orderView !== 1"
        @click="handleBagScanBag"
      >
        <v-icon
          v-if="orderView === 1"
          class="mr-2"
        >
          mdi-play
        </v-icon>
        {{
          nameBtn
        }}
      </v-btn>

      <v-btn
        v-else
        :color="step === 1 ? 'green' : 'primary'"
        min-width="200px"
        :disabled="!selectedOrders.length"
        :class="step === 1 ? 'white--text' : ''"
        @click="handleBagScanBag"
      >
        {{
          nameBtn
        }}
      </v-btn>
    </v-row>

    <v-expand-transition>
      <OrdersFiltersContainer
        :is-show-filter="isShowFilter"
        @doToggleFilter="isShowFilter = !isShowFilter"
        @doResetFilter="doResetFilter"
      >
        <template #filterList>
          <!-- Filter for order list -->
          <BaggingFilterListView v-model="filterBagging" :is-client="true"/>
        </template>
      </OrdersFiltersContainer>
    </v-expand-transition>

    <v-sheet
      color="transparent"
      width="100%"
      class="mx-10 mt-10"
    >
      <template v-for="({ text, icon }, index) in stepList">
        <v-btn
          :key="text"
          :color="isActive(index) ? 'primary' : 'white'"
          :class="[isActive(index) ? 'white--text' : 'primary--text']"
          class="custom-tab mx-2"
          min-width="150px"
          @click="doChangeWindow(index)"
        >
          <v-icon v-if="icon" left dark size="28">
            {{ icon }}
          </v-icon>
          {{ text }}
        </v-btn>
      </template>
    </v-sheet>

    <v-card elevation="2">
      <v-window v-model="step">
        <v-window-item :value="0">
        </v-window-item>
        <v-window-item :value="1">
          <BaggingBagTab
            v-model="selectedOrders"
            :is-complete-tab-partner="true"
          />
        </v-window-item>
        <v-window-item :value="2">
          <BaggingScanned
            v-if="orderView === 1"
            :data="dataMerged"
            :is-bag-tab-partner="true"
          />
          <BaggingList v-else v-model="selectedUnbagged" :data="dataMerged"/>
        </v-window-item>

        <v-window-item :value="3">
          <BaggingScanned
            v-if="orderView === 1"
            :data="dataMerged"
          />
          <BaggingList v-else v-model="selectedUnbagged" :data="dataMerged"/>
        </v-window-item>
      </v-window>
    </v-card>

    <!-- Delete Status -->
    <!-- <BaseModalForm
      v-model="dialog.delete"
      :dialog-settings="dialogSettings"
      @doSubmit="deleteStatus"
    >
      <template #modalFields>
        <OrdersDeleteStatusContent
          :selected="selectedOrders"
          :is-open="dialog.delete"
        />
      </template>
    </BaseModalForm> -->
    <!-- Modal confirm -->
    <BaggingModalConfirm
      v-model="dialog.confirm"
      :dialog-settings="dialogSettings"
      :is-confirm="true"
      @doSubmit="submit"
      @doCancel="() => (dialog.confirm = false)"
    />
    <!-- Modal Manifest -->
    <BaggingGenerateManifest
      v-model="inputMAWB"
      :selected="selectedOrders"
      :dialog-settings="dialogSettings"
      @doSubmit="() => (inputMAWB.manifest = false)"
      @doCancel="() => (inputMAWB.manifest = false)"
    />
   <v-snackbar
      :value="alert.isShow"
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
  useFetch,
  useMeta,
  useStore,
  computed,
  ref,
  Ref,
  watch,
  useRoute,
  useRouter,
  useContext,
  onMounted,
} from '@nuxtjs/composition-api'
// Interface and types
import { PropType } from 'vue'
import {
  FilterDetails,
  ModalConfirm,
  VuexModuleApplications,
  Alert,
  Header,
} from '~/types/applications'
import { VuexModuleFilters, Statuses } from '~/types/filters'
import { filterBaggingInit} from '~/store/bagging/bagging'
import { VuexModuleDetailBagging, FilterBagging, Unbagged, InputPostBag, InputManifest, GenerateManifest} from '~/types/bagging/bagging'
import tempData from '~/static/tempData'

export default defineComponent({
  name: 'BaggingPages',
  middleware: 'partner',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const storeApplications = useStore<VuexModuleApplications>()
    const storeBagging = useStore<VuexModuleDetailBagging>()
    const storeOfApplications = useStore<VuexModuleApplications>()
    const alert = computed(() => storeOfApplications.state.applications.alert)
    const dialog = ref({
      confirm: false,
      manifest: false
    })
    const dialogSettings = ref({
      loading: false,
      title: '',
      content: '',
      cancelText: '',
      submitText: '',
      submitColor: '',
    }) as Ref<ModalConfirm>
    const filterBagging = ref({
      ...(storeBagging.state.bagging as any).bagging.filter,
    })
    // manage windows
    const step = ref((storeBagging.state.bagging as any).bagging.tab.step)
    const stepList = computed(() => {
      return [
        {
          text: 'Manifest',
          icon: '',
        },
        {
          text: 'Complete',
          icon: '',
        },
        {
          text: 'Bags',
          icon: '',
        },
        {
          text: orderView.value === 0 ? 'Unbagged' : 'Scanned',
          icon: '',
        },
      ]
    })
    // manage view
    const orderView = ref((storeBagging.state.bagging as any).bagging.tab.orderView[step.value])
    // manage table
    const selectedOrders = ref([]) as Ref<any>
    const inputMAWB = ref({
      manifest: false,
    }) as Ref<InputManifest>

    watch(
      () => [selectedOrders.value],
      ([newSelectedOrders]) => {
          const generateManifest = {} as GenerateManifest
          newSelectedOrders.forEach((x: any) => {
            generateManifest[x.id] = {
              groupName: x.group_name,
              length: '',
              width: '',
              height: '',
              weight: '',
            }
          });
          inputMAWB.value = {
            ...inputMAWB.value,
            mawb: '',
            generateManifest
          }
      },
      { deep: true }
    )
    // manage filter order
    const isShowFilter = ref((storeBagging.state.bagging as any).bagging.isShowFilter)
    const doResetFilter = () => {
      filterBagging.value = {
        createdFrom: '',
        createdTo: '',
        client: '',
        destination: ''
      }
    }
    const selectedUnbagged = ref({}) as Ref<InputPostBag>
    const selectedINFO = computed(() => {
      if(step.value === 1 && orderView.value === 0) {
        return  selectedUnbagged.value &&selectedUnbagged.value?.order_ids ? selectedUnbagged.value?.order_ids : []
      }

      if(step.value === 0 && orderView.value === 0) {
        return selectedOrders.value
      }

      return []
    })


    // const dataMerged = ref([]) as Ref<Unbagged[]>

    const newScanned = computed(() => {
      const user = localStorage.getItem('auth.user') ? JSON.parse(localStorage.getItem('auth.user') as string) : {}
      if(!localStorage.getItem(`newScanned.${step.value === 2 ? 'bagsTab' : 'scannedTab'}.partner.${user.email}`) || (!user && !user.email)) {
        return []
      } else {
        return localStorage.getItem(`newScanned.${step.value === 2 ? 'bagsTab' : 'scannedTab'}.partner.${user.email}`) ? JSON.parse(localStorage.getItem(`newScanned.${step.value === 2 ? 'bagsTab' : 'scannedTab'}.partner.${user.email}`) as string) : []
      }
    })


    // const dataTemp = tempData.bagging.data.unbagged as Unbagged[]
    const dataMerged =  computed(() => {
      const data =  (storeBagging.state.bagging as any).bagging.unbagged as Unbagged[]
      // const data = step.value === 2 ? (storeBagging.state.bagging as any).bagging.bagsPartner as Unbagged[]  : (storeBagging.state.bagging as any).bagging.unbaggedPartner as Unbagged[]
      let tempArr = [] as {group_name: string, id: string, orderCode: string, new?: boolean}[]
      data.forEach(x => {
        newScanned.value.forEach((k: {orderCode: string, new?: boolean}) => {
          let temp = {} as {group_name: string, id: string, orderCode: string, new?: boolean}
          x.order_group.forEach(m => {
            m.orders.forEach(n => {
              if(k.orderCode === n.orderCode) {
                temp = {
                  group_name: m.group_name,
                  id: n.id,
                  ...k,
                }
              }
            })
          })
        tempArr.push(temp)
        })
      })
      tempArr = tempArr.filter(x => Object.keys(x).length)

      const noOrder = [...data].map(x => {
        return {
            ...x,
            order_group: x.order_group && (x.order_group.map(y => {
            return {
              ...y,
              orders: (tempArr.filter(k => k.group_name === y.group_name)).map(l => {
                return  {
                  id: l.id,
                  orderCode: l.orderCode,
                  new: l.new ?? false
                }
              })
            }
          })).filter(b => b.orders.length)
        }
      })
      return noOrder
    }) as Ref<Unbagged[]>


    // onMounted(() => {

    //   dataMerged.value = dataTemp.value
    // })

    const isActive = (data: number) => step.value === data
    const doChangeWindow = (data: number) => {
      step.value = data
    }
    const nameBtn = computed(() => {
        let temp = ''
        if(step.value === 2 || step.value === 3) {
          if(orderView.value === 0) {
            temp = step.value === 3 ? 'BAG' : 'COMPLETE'
          } else {
            temp = 'START SCAN'
          }
        } else {
          temp = 'DOWNLOAD BAG LABEL'
        }
        return temp
    })

    // manage filter on changed
    watch(
      filterBagging,
      (newFilter) => {
        // doResetPagination()
        storeApplications.commit('bagging/bagging/SET_FILTER', {
          ...newFilter,
        })
      },
      { deep: true }
    )
    // manage filter on changed
    watch(
      isShowFilter,
      (newFilterBtn) => {
        // doResetPagination()
        storeApplications.commit('bagging/bagging/SET_FILTER_BTN', {
          ...newFilterBtn,
        })
      },
      { deep: true }
    )

    watch(
      [orderView, step],
      ([newOrderView, newStep]) => {

        storeApplications.commit('bagging/bagging/SET_TAB_BTN', {
          orderView: {
            ...(storeBagging.state.bagging as any).bagging.tab.orderView,
            [`${newStep}`]: newOrderView
          },
          step: newStep
        })
      },
      { deep: true }
    )

    watch(
      [orderView],
      ([newOrderView]) => {
        selectedUnbagged.value = {} as any
      },
      { deep: true }
    )

    function handleBagScanBag() {
      dialogSettings.value = {
        loading: false,
        title: 'Print label now ?',
        content: '',
        cancelText: 'No',
        submitText: 'Yes',
        submitColor: 'primary',
      }
      if(step.value === 2 || step.value === 3) {
        if(orderView.value === 0 ) {
          dialog.value.confirm = true
        } else {
          router.push(`/partner-portals/bagging/scan${
            step.value === 2
            ? '?bag=1'
            : ''
          }`)
        }
      } else {
        dialog.value.confirm = true
      }
    }
    async function submit(params: {isCancel?: boolean}) {
      const textMsg = params?.isCancel ? 'Close Bag' : 'Print label'

      try {
        dialogSettings.value.loading = true
        if(step.value !== 0) {
          await storeBagging.dispatch(
            'bagging/bagging/postBags',
            {payload: selectedUnbagged.value}
          )
          await fetchBags()
          storeApplications.commit('applications/SET_ALERT', {
            isShow: true,
            type: 'success',
            message: `${textMsg} successfully!`,
          })
        }

        if(step.value === 0 && !params?.isCancel) {
          storeApplications.commit('applications/SET_ALERT', {
            isShow: true,
            type: 'success',
            message: `${textMsg} successfully!`,
          })
        }
      } catch (error) {

        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'error',
          message: `${'error'}`,
        })
      } finally {
        dialogSettings.value.loading = false
        if(params?.isCancel) {
          inputMAWB.value.manifest = false
        } else {
          dialog.value.confirm = false
        }
        setTimeout(() => {
          storeApplications.commit('applications/RESET_ALERT')
        }, 3000)
      }
    }
    function handleManifest() {
      dialogSettings.value = {
        loading: false,
        title: 'Generate Manifest',
        content: '',
        cancelText: 'Cancel',
        submitText: 'Update',
        submitColor: 'primary',
      }
      inputMAWB.value.manifest = true

    }


    async function fetchBags () {
      const id = route.value.params.id
      // console.log(id)

      try {
        $fetchState.pending = true
        await storeBagging.dispatch('bagging/bagging/getBags')
        // await storeBagging.dispatch('bagging/bagging/getBagsPartner', {partnerID: id})
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }


    const { $fetchState, fetch } = useFetch(async () => {
      await fetchBags()
    })

    useMeta(() => ({ title: 'Partner Portal | Bagging' }))

    return {
      isShowFilter,
      doResetFilter,
      selectedOrders,
      stepList,
      step,
      isActive,
      doChangeWindow,
      orderView,
      handleBagScanBag,
      submit,
      dialog,
      dialogSettings,
      handleManifest,
      filterBagging,
      nameBtn,
      // dataTemp,
      dataMerged,
      selectedUnbagged,
      alert,
      selectedINFO,
      inputMAWB
    }
  },
  head: {},
})
</script>

<style lang="scss">
.baggedPage {
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
}
</style>
