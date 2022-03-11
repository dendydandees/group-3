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
    <!-- Order List Page -->
    <!-- Order code -->
    <template #[`item.orderCode`]="{ item }">
      {{ item.orderCode }}

      <span v-if="item.refID" class="ml-1 text--secondary">
        (#{{ item.refID }})
      </span>
    </template>

    <!-- Consignee data -->
    <template #[`item.consignee`]="{ item }">
      <div class="text--secondary my-2">
        <p class="mb-2 font-weight-bold subtitle-2">
          {{ item.consigneeName }}
        </p>

        <p class="mb-1">
          {{ item.consigneeAddress }}
        </p>

        <p class="ma-0">
          {{
            $customUtils.setAddress([
              item.consigneeCity,
              item.consigneeProvince,
              item.consigneeCountry,
              item.consigneePostal,
            ])
          }}
        </p>
      </div>
    </template>

    <!-- Pickup data -->
    <template #[`item.pickup`]="{ item }">
      <div class="text--secondary my-2">
        <p class="mb-2 font-weight-bold subtitle-2">
          {{ item.pickupContactName }}
        </p>

        <p class="mb-1">
          {{ item.pickupAddress }}
        </p>

        <p class="ma-0">
          {{
            $customUtils.setAddress([
              item.pickupCity,
              item.pickupProvince,
              item.pickupCountry,
              item.pickupPostal,
            ])
          }}
        </p>
      </div>
    </template>
    <!-- End Order List Page -->

    <!-- Incoming Order List Page -->
    <!-- Order code -->
    <template #[`item.incomingOrderCode`]="{ item }">
      {{ item.orderCode }}

      <span v-if="item.order.refID" class="ml-1 text--secondary">
        (#{{ item.order.refID }})
      </span>
    </template>

    <!-- Consignee data -->
    <template #[`item.incomingConsignee`]="{ item }">
      <div class="text--secondary my-2">
        <p class="mb-2 font-weight-bold subtitle-2">
          {{ item.order.consigneeName }}
        </p>

        <p class="mb-1">
          {{ item.order.consigneeAddress }}
        </p>

        <p class="ma-0">
          {{
            $customUtils.setAddress([
              item.order.consigneeCity,
              item.order.consigneeProvince,
              item.order.consigneeCountry,
              item.order.consigneePostal,
            ])
          }}
        </p>
      </div>
    </template>

    <!-- Pickup data -->
    <template #[`item.incomingPickup`]="{ item }">
      <div class="text--secondary my-2">
        <p class="mb-2 font-weight-bold subtitle-2">
          {{ item.order.pickupContactName }}
        </p>

        <p class="mb-1">
          {{ item.order.pickupAddress }}
        </p>

        <p class="ma-0">
          {{
            $customUtils.setAddress([
              item.order.pickupCity,
              item.order.pickupProvince,
              item.order.pickupCountry,
              item.order.pickupPostal,
            ])
          }}
        </p>
      </div>
    </template>

    <!-- Service type -->
    <template #[`item.serviceType`]="{ item }">
      <v-chip small color="info" class="text-uppercase mb-2 white--text">
        {{ $customUtils.setServiceType(item.serviceType) }}
      </v-chip>
    </template>
    <template #expanded-item="{ headers, item }">
      <td
        :colspan="headers.length"
        :class="`expandable-custom `"
      >
        <div
          :class="`d-flex align-center justify-space-between py-3 border-bottom `"
        >
          <div
            class="font-weight-bold"
          >
            RULE LIST
          </div>
          <v-btn
            small
            @click="addRuleModal(item)"
          >
            <v-icon
              small
            >
              mdi-plus
            </v-icon>
            Rules
          </v-btn>
        </div>
        <v-card
          v-for="(x,i) in item.Rules"
          :key="i"
          class="custom-card-expand"
        >
          <div
            class="d-flex align-center border-bottom"
          >
            <v-col
              cols="1"
            >
              {{ x.priority }}
            </v-col>
            <v-col
              class="ml-16"
              cols="4"
            >
              {{ findNamePartner(x.partnerID) }}
            </v-col>
            <v-col
              class="d-flex justify-end"
            >
              <v-btn
                icon
                color="red"
                @click="dialogDeleteModal(x.id, 'rule')"
              >
                <v-icon
                  small
                >
                  mdi-trash-can
                </v-icon>
              </v-btn>
              <!-- Delete -->
            </v-col>
          </div>
          <div
            v-for="(o, n) in x.definitions"
            :key="n"
            class="d-flex  border-bottom custom-rule-card"
          >
            <v-col
              cols="2"
            >

            </v-col>
            <v-col
              cols="4"
            >
              {{ $customUtils.setRuleType(o.type) }}
            </v-col>
            <v-col
            >
              {{o.value}}
            </v-col>
          </div>
        </v-card>
      </td>
    </template>
    <template #[`item.actionsLControl`]="{ item }">
      <div class="d-flex align-center justify-end">
        <v-btn
          icon
          outlined
          color="red"
          @click="dialogDeleteModal(item.id)"
        >
          <v-icon
            small
          >
            mdi-trash-can
          </v-icon>
          <!-- Delete -->
        </v-btn>
      </div>
    </template>
    <!-- End Incoming Order List Page -->

    <!-- Start Incoming L-Control Page -->
    <template #[`item.defaultPartner`]="{ item }">
      <v-row class="text--secondary my-2">
        <v-col
          class="mb-2 font-weight-bold subtitle-2 text-no-wrap"
          cols="5"
        >
          {{ findNamePartner(item.defaultPartnerID)}}
        </v-col>
        <v-col cols="3">
          <v-chip small color="info" class="text-uppercase mb-2 white--text">
            {{ $customUtils.setServiceType(item.serviceType) }}
          </v-chip>

        </v-col>
        <!-- <p class="mb-1">
          {{ item.serviceType }}
        </p> -->
      </v-row>
    </template>
    <!-- End Incoming L-Control Page -->

    <!-- Actions button list -->
    <template #[`item.actions`]="{ item }">
      <div class="d-flex align-center">
        <v-btn
          v-if="isShowActions.detail"
          small
          depressed
          :loading="loading"
          color="primary"
          elevation="0"
          class="ma-2"
          @click="getDetailItem(item)"
        >
          Details
        </v-btn>

        <v-btn
          v-if="isShowActions.download"
          small
          depressed
          download
          :href="item.labelPath || ''"
          :loading="loading"
          :disabled="!item.labelPath"
          color="info"
          elevation="0"
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
  useFetch,
  useStore,
  reactive,
  watch,
  ref,
  Ref,
  useMeta,
  useRouter,
  PropType,
} from '@nuxtjs/composition-api'
// Interfaces and types
import { DataOptions, DataTableHeader, ItemGroup } from 'vuetify'
import { ActionsTable, FilterDetails, Meta } from '~/types/applications'
import { Marketplace, VuexModuleMarketplaces, PartnerServiceZone } from '~/types/marketplace/marketplace'
import { Definition, Rule, RuleGroup } from '~/types/lControl/lControl'

export default defineComponent({
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
      type: Object as PropType<{singleExpand: Boolean, showExpand: Boolean}>,
      default: () => ({singleExpand: true,
      showExpand: false}),
    },
    itemKey: {
      type: String as PropType<String>,
      required: true,
    },
    hideDefaultFooter: {
      type: Boolean as PropType<Boolean>,
      default: false
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
    const storeMarketplaces = useStore<VuexModuleMarketplaces>()
    const marketplaces = computed(() => storeMarketplaces.state.marketplaces.marketplaces.marketplaces)
    const marketplacesLControl = computed(() => storeMarketplaces.state.marketplaces.marketplaces.marketplacesLControl)

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
    const addRuleModal = (data: RuleGroup) => {
      emit('addRuleModal', data.id)
      // console.log('addRuleModal', data)
      fetchMarketplace(data.countryCode, data.serviceType)
    }
    const dialogDeleteModal = (ruleID: string, name: string) => {
      emit('dialogDeleteModal', {id: ruleID, name})
    }

    const findNamePartner = (id: string) => {
      return marketplacesLControl.value.filter(x => x.id === id)[0]?.name
    }
    const fetchMarketplace = async (country: string, service: string) => {
      const dataParams = {
        page:1,
        perPage: 100,
        country,
        service
      }

      try {
        // $fetchState.pending = true

        await storeMarketplaces.dispatch('marketplaces/marketplaces/getMarketplaces', { params: dataParams})
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
      findNamePartner
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
