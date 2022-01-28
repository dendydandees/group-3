<template>
  <v-data-table
    :item-key="itemKey"
    :items="items"
    :headers="headers"
    :footer-props="footerProps"
    :server-items-length="meta.totalCount"
    :options.sync="tableOptions"
    :loading="loading"
    class="elevation-0"
    @update:options="fetch"
  >
    <!-- Order List Page -->
    <!-- Order code -->
    <template #[`item.orderCode`]="{ item }">
      {{ item.orderCode }}

      <span class="ml-1 text--secondary"> (#{{ item.refID }}) </span>
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

    <!-- Actions button list -->
    <template #[`item.actions`]="{ item }">
      <v-btn
        v-if="isShowActions.detail"
        tile
        small
        :loading="loading"
        :disabled="loading"
        color="primary"
        elevation="0"
        class="ma-2"
        @click="getDetailItem(item)"
      >
        Details
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  PropType,
} from '@nuxtjs/composition-api'
// Interfaces and types
import { DataOptions, DataTableHeader, ItemGroup } from 'vuetify'
import { ActionsTable, FilterDetails, Meta } from '~/types/applications'

export default defineComponent({
  props: {
    loading: {
      type: Boolean as PropType<Boolean>,
      default: false,
    },
    itemKey: {
      type: String as PropType<String>,
      required: true,
    },
    items: {
      type: Array as unknown as () => PropType<ItemGroup<[]>>,
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
    options: {
      type: Object as PropType<DataOptions>,
      required: true,
    },
    isShowActions: {
      type: Object as PropType<ActionsTable>,
      default: () => ({
        detail: false,
        edit: false,
        delete: false,
      }),
    },
  },
  setup(props, { emit }) {
    const tableOptions = ref(props.options)
    const footerProps = reactive({
      'items-per-page-options': [10, 20, -1],
      'show-first-last-page': true,
      'show-current-page': true,
    })
    const fetch = (data: FilterDetails) => {
      emit('fetchOrders', data)
    }
    const getDetailItem = (data: {}) => {
      emit('doGetDetails', data)
    }

    return {
      tableOptions,
      footerProps,
      fetch,
      getDetailItem,
    }
  },
})
</script>
