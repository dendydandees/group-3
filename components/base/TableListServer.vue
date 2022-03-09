<template>
  <v-data-table
    :item-key="itemKey"
    :items="items"
    :headers="headers"
    :footer-props="footerProps"
    :server-items-length="meta.totalCount"
    :options.sync="pagination"
    :loading="loading"
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
    <!-- End Incoming Order List Page -->

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
  defineComponent,
  reactive,
  computed,
  PropType,
} from '@nuxtjs/composition-api'
// Interfaces and types
import { DataOptions, DataTableHeader, ItemGroup } from 'vuetify'
import { ActionsTable, FilterDetails, Meta } from '~/types/applications'

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
    itemKey: {
      type: String as PropType<String>,
      required: true,
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

    return {
      pagination,
      footerProps,
      fetch,
      getDetailItem,
    }
  },
})
</script>
