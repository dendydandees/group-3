<template>
  <v-data-table
    :item-key="itemKey"
    :items="items"
    :loading="loading"
    :headers="headers"
    :footer-props="footerProps"
    :server-items-length="meta.totalCount"
    :hide-default-footer="hideDefaultFooter"
    :options.sync="pagination"
    :single-expand="expandedOption.singleExpand"
    :show-expand="expandedOption.showExpand"
    class="elevation-2"
    @update:options="fetch"
  >
    <template #expanded-item="{ headers: expandHeaders, item }">
      <td :colspan="expandHeaders.length" :class="`expandable-custom `">
        <div
          :class="`d-flex align-center justify-space-between py-3 ${
            item.Rules ? 'border-bottom' : ''
          } `"
        >
          <div class="font-weight-bold">RULE LIST</div>
          <v-btn small @click="addRuleModal(item)">
            <v-icon small> mdi-plus </v-icon>
            Rules
          </v-btn>
        </div>
        <v-card
          v-for="(x, i) in item.Rules"
          :key="i"
          class="custom-card-expand"
        >
          <div class="d-flex align-center border-bottom">
            <v-col cols="1">
              {{ x.priority }}
            </v-col>
            <v-col class="ml-16" cols="4">
              {{ findNamePartner(x.partnerID) }}
            </v-col>
            <v-col class="d-flex justify-end">
              <v-btn icon color="red" @click="dialogDeleteModal(x.id, 'rule')">
                <v-icon small> mdi-trash-can </v-icon>
              </v-btn>
              <!-- Delete -->
            </v-col>
          </div>
          <div
            v-for="(o, n) in x.definitions"
            :key="n"
            class="d-flex border-bottom custom-rule-card"
          >
            <v-col cols="2"> </v-col>
            <v-col cols="4">
              {{ $customUtils.setRuleType(o.type) }}
            </v-col>
            <v-col>
              {{ o.value }}
            </v-col>
          </div>
        </v-card>
      </td>
    </template>

    <template #[`item.actionsLControl`]="{ item }">
      <div class="d-flex align-center justify-end">
        <v-btn icon outlined color="red" @click="dialogDeleteModal(item.id)">
          <v-icon small> mdi-trash-can </v-icon>
          <!-- Delete -->
        </v-btn>
      </div>
    </template>

    <!-- Start Incoming L-Control Page -->
    <template #[`item.countryCode`]="{ item }">
      <div class="d-flex align-center my-2">
        <country-flag
          :country="item.countryCode"
          size="normal"
          :shadow="true"
          :rounded="true"
          :style="'margin: unset'"
        />
        <div class="font-weight-bold">
          {{ item.countryCode }}
        </div>
      </div>
    </template>
    <template #[`item.defaultPartner`]="{ item }">
      <v-row class="text--secondary my-2 px-4 align-center">
        <div>
          <v-chip small color="info" class="text-uppercase white--text mr-3">
            {{ $customUtils.setServiceType(item.serviceType) }}
          </v-chip>
        </div>
        <div
          v-if="!item.useBOB"
          class="font-weight-bold subtitle-2 text-no-wrap align-center"
        >
          {{ findNamePartner(item.defaultPartnerID) }}
        </div>
        <NuxtImg
          v-else-if="item.useBOB"
          src="/images/BOB.svg"
          preload
          :height="20"
        />
      </v-row>
    </template>
    <template #[`item.data-table-expand`]="{ expand, isExpanded, item }">
      <v-icon v-if="item.useBOB"></v-icon>
      <v-icon v-else @click="expand(!isExpanded)">
        {{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
      </v-icon>
    </template>
    <!-- End Incoming L-Control Page -->

    <!-- Actions button list -->
    <template #[`item.actions`]="{ item }">
      <div class="d-flex align-center">
        <v-btn
          v-if="isShowActions.detail"
          small
          :loading="loading"
          color="primary"
          class="ma-2"
          @click="getDetailItem(item)"
        >
          Details
        </v-btn>

        <v-btn
          v-if="isShowActions.download"
          small
          download
          :href="item.labelPath || ''"
          :loading="loading"
          :disabled="!item.labelPath"
          color="info"
          class="ma-2"
        >
          Download
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useStore,
  reactive,
  PropType,
} from '@nuxtjs/composition-api'
import CountryFlag from 'vue-country-flag'
// Interfaces and types
import { DataOptions, DataTableHeader, ItemGroup } from 'vuetify'
import { ActionsTable, FilterDetails, Meta } from '~/types/applications'
import { VuexModuleMarketplaces } from '~/types/marketplace/marketplace'

export default defineComponent({
  components: {
    CountryFlag,
  },
  props: {
    value: {
      type: Object as PropType<DataOptions>,
      required: true,
    },
    loading: {
      type: Boolean as PropType<Boolean>,
      default: false,
    },
    expandedOption: {
      type: Object as PropType<{ singleExpand: Boolean; showExpand: Boolean }>,
      default: () => ({ singleExpand: true, showExpand: false }),
    },
    itemKey: {
      type: String as PropType<String>,
      required: true,
    },
    hideDefaultFooter: {
      type: Boolean as PropType<Boolean>,
      default: false,
    },
    items: {
      type: Array as () => PropType<ItemGroup<[]>>,
      required: true,
    },
    headers: {
      type: Array as unknown as PropType<DataTableHeader<[]>>,
      required: true,
    },
    meta: {
      type: Object as PropType<Meta>,
      required: true,
    },
    isShowActions: {
      type: Object as PropType<ActionsTable>,
      default: () => ({
        detail: false,
        download: false,
        edit: false,
        delete: false,
      }),
    },
  },
  setup(props, { emit }) {
    // end incoming orders
    const storeMarketplaces = useStore<VuexModuleMarketplaces>()
    const marketplaces = computed(
      () => storeMarketplaces.state.marketplaces.marketplaces.marketplaces
    )
    const marketplacesLControl = computed(
      () =>
        storeMarketplaces.state.marketplaces.marketplaces.marketplacesLControl
    )

    const pagination = computed({
      get: () => props.value,
      set: (value: DataOptions) => emit('input', value),
    })
    const footerProps = reactive({
      'items-per-page-options': [5, 10, 15, 20, -1],
      'show-first-last-page': true,
      'show-current-page': true,
    })
    const fetch = (data: FilterDetails) => {
      emit('fetch', data)
    }
    const getDetailItem = (data: {}) => {
      emit('doGetDetails', data)
    }
    const addRuleModal = (data: any) => {
      emit('addRuleModal', data)
      // console.log('addRuleModal', data)
      fetchMarketplace(data.countryCode, data.serviceType)
    }
    const dialogDeleteModal = (ruleID: string, name: string) => {
      emit('dialogDeleteModal', { id: ruleID, name })
    }

    const findNamePartner = (id: string) => {
      if (marketplacesLControl.value && marketplacesLControl.value.length > 0) {
        return marketplacesLControl.value.filter((x) => x.id === id)[0]?.name
      }
    }
    const fetchMarketplace = async (country: string, service: string) => {
      const dataParams = {
        page: 1,
        perPage: 100,
        country,
        service,
      }

      try {
        // $fetchState.pending = true

        await storeMarketplaces.dispatch(
          'marketplaces/marketplaces/getMarketplaces',
          { params: dataParams }
        )
      } catch (error) {
        return error
      } finally {
        // $fetchState.pending = false
      }
    }

    return {
      pagination,
      footerProps,
      fetch,
      getDetailItem,
      addRuleModal,
      dialogDeleteModal,
      marketplaces,
      marketplacesLControl,
      findNamePartner,
    }
  },
})
</script>
<style lang="scss">
.expandable-custom {
  .border-bottom {
    border-bottom: 1px solid rgba(128, 128, 128, 0.322);
  }
  .v-card {
    border-radius: unset !important;
  }
  .custom-card-expand {
    background: transparent;

    .custom-rule-card {
      background: rgba(128, 128, 128, 0.082);
      /* color: white; */
    }
  }
}
.v-data-table__expanded {
  &:last-of-type {
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
  }
}
</style>
