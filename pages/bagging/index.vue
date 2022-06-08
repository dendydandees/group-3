<template>
  <section class="pa-4 pa-md-10 py-8 baggedPage">
    <BaseHeadlinePage
      title="Bagging"
      subtitle="Bag parcels together and generate a single bag label for ease of shipping and tracking."
    >
      <template slot="addition">
        <span class="text--secondary font-weight-medium title">
          &bull; {{ '0' }} Total Orders
        </span>
      </template>
    </BaseHeadlinePage>

    <v-row align="center" justify="end">
      <!-- Left options -->
      <OrdersLeftOptions
        :is-on-list-view="false"
        :selected-orders="selectedOrders"
        :is-show-filter="isShowFilter"
        @doShowFilter="isShowFilter = !isShowFilter"
      />
        <!-- :loading="$fetchState.pending" -->

      <!-- Right options -->
      <OrdersRightOptions
      >
        <!-- :loading="$fetchState.pending" -->
        <template #toggleView>
          <OrdersToggleView
            v-model="orderView"
          />
        </template>
      </OrdersRightOptions>
      <v-btn
        color="primary"
        min-width="200px"
        @click="handleBagScanBag"
      >
        <v-icon
          v-if="orderView === 1"
          class="mr-2"
        >
          mdi-play
        </v-icon>
        {{
          orderView === 0
          ? 'BAG'
          : 'START SCAN'
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
          <BaggingFilterListView v-model="filterBagging" />
        </template>
      </OrdersFiltersContainer>
    </v-expand-transition>

    <!-- <v-row align="center">
      <v-col cols="12">
        <BaseTable
          v-model="selectedOrders"
          item-key="id"
          :items="incomingOrders"
          :headers="headers"
          :options="pagination"
          :loading="$fetchState.pending"
          :is-select-disabled="isExternalTrackingExist"
          :show-select="true"
          :action-exist="actionExist"
          @fetch="fetchIncomingOrders"
          @doSelectAll="selectAllToggle"
          @doGetDetails="doGetDetails"
          @doGetBatchDetails="doGetBatchDetails"
        />
      </v-col>
    </v-row> -->

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
          <BaggingScanned
            v-if="orderView === 1"
          />
          <BaggingList v-else/>
        </v-window-item>

        <v-window-item :value="1">
          <BaggingScanned
            v-if="orderView === 1"
          />
          <BaggingList v-else/>
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
      @doCancel="handleCancel"
    />
    <!-- Modal after click no -->
    <BaggingModalConfirm
      v-model="dialog.cancel"
      :dialog-settings="dialogSettings"
      @doSubmit="submit({isCancel: true})"
    />
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
import {
  FilterDetails,
  ModalConfirm,
  VuexModuleApplications,
  Alert,
  Header,
} from '~/types/applications'
import { VuexModuleFilters, Statuses } from '~/types/filters'
import { filterBaggingInit} from '~/store/bagging/bagging'
import { VuexModuleDetailBagging, FilterBagging} from '~/types/bagging/bagging'

export default defineComponent({
  name: 'BaggingPages',
  middleware: 'partner',
  setup() {
    const router = useRouter()
    const storeApplications = useStore<VuexModuleApplications>()
    const storeBagging = useStore<VuexModuleDetailBagging>()
    const dialog = ref({
      confirm: false,
      cancel: false
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
    // manage view
    const orderView = ref(0)
    // manage table
    const selectedOrders = ref([]) as Ref<any>
    // manage filter order
    const isShowFilter = ref(false)
    const doResetFilter = () => {
      filterBagging.value = {
        createdFrom: '',
        createdTo: '',
        client: '',
        destination: ''
      }
    }
    // manage windows
    const step = ref(0)
    const stepList = computed(() => {
      return [
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
    const isActive = (data: number) => step.value === data
    const doChangeWindow = (data: number) => {
      step.value = data
    }

    function handleBagScanBag() {
      if(orderView.value === 0 ) {
        dialogSettings.value = {
          loading: false,
          title: 'Print label now ?',
          content: '',
          cancelText: 'No',
          submitText: 'Yes',
          submitColor: 'primary',
        }
        dialog.value.confirm = true
      } else {
        router.push(`/bagging/scan`)
      }
    }
    async function submit(params: {isCancel?: boolean}) {
      try {
        dialogSettings.value.loading = true

        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'success',
          message: 'Print label successfully!',
        })
      } catch (error) {

        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'error',
          message: `Print label ${'error'}`,
        })
      } finally {
        dialogSettings.value.loading = false
        if(params?.isCancel) {
          dialog.value.cancel = false
        } else {
          dialog.value.confirm = false
        }
        setTimeout(() => {
          storeApplications.commit('applications/RESET_ALERT')
        }, 3000)
      }
    }
    function handleCancel() {
      dialogSettings.value = {
        loading: false,
        title: 'Make sure bags are arranged properly to prevent mix-up',
        content: '',
        cancelText: '',
        submitText: 'Ok',
        submitColor: 'primary',
      }
      dialog.value.cancel = true

    }

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
      handleCancel,
      filterBagging
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
