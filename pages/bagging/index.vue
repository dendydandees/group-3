<template>
  <section class="pa-4 pa-md-10 py-8 baggedPage">
    <BaseHeadlinePage
      title="Bagging"
      subtitle="Bag parcels toegether and generate a single bag label for ease of shipping and tracking."
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
        <template #viewSettings>
        </template>
      </OrdersRightOptions>
    </v-row>

    <v-expand-transition>
      <OrdersFiltersContainer
        :is-show-filter="isShowFilter"
        @doToggleFilter="isShowFilter = !isShowFilter"
        @doResetFilter="doResetFilter"
      >
        <template #filterList>
          <!-- Filter for order list -->
          <!-- <OrdersFilterListView v-model="filterOrders" /> -->
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
          <BaggingList />
        </v-window-item>

        <v-window-item :value="1">
          <BaggingList />
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

export default defineComponent({
  name: 'BaggingPages',
  middleware: 'partner',
  setup() {
    // manage table
    const selectedOrders = ref([]) as Ref<any>
    // manage filter order
    const isShowFilter = ref(false)
    const doResetFilter = () => {
      // filterOrders.value = filterOrderInit
    }
    // manage windows
    const step = ref(0)
    const stepList = ref([
      {
        text: 'Bags',
        icon: '',
      },
      {
        text: 'Unbagged',
        icon: '',
      },
    ])
    const isActive = (data: number) => step.value === data
    const doChangeWindow = (data: number) => {
      step.value = data
    }

    useMeta(() => ({ title: 'Partner Portal | Bagging' }))

    return {
      isShowFilter,
      doResetFilter,
      selectedOrders,
      stepList,
      step,
      isActive,
      doChangeWindow
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
