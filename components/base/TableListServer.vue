<template>
  <v-data-table
    :item-key="itemKey"
    :items="items"
    :headers="headers"
    :footer-props="footerProps"
    :server-items-length="meta.totalCount"
    :options.sync="tableOptions"
    :loading="fetchState.pending"
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
        :loading="fetchState.pending"
        :disabled="fetchState.pending"
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
import { defineComponent, reactive, ref } from '@nuxtjs/composition-api'
// Interfaces and types
import { FilterDetails } from '~/types/applications'

export default defineComponent({
  props: {
    fetchState: {
      type: Object,
      required: true,
    },
    itemKey: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    meta: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
    isShowActions: {
      type: Object,
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
