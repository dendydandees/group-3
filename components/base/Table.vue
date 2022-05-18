<template>
  <v-data-table
    v-model="selected"
    :item-key="itemKey"
    :items="items"
    :headers="headers"
    :options="options"
    :loading="loading"
    hide-default-footer
    :show-select="showSelect"
    class="elevation-2"
    @update:options="fetch"
    @toggle-select-all="doSelectAll"
  >
    <!-- checkbox on header table -->
    <template #[`header.data-table-select`]="{ props, on }">
      <v-simple-checkbox
        v-ripple
        on-icon="mdi-checkbox-marked-circle"
        off-icon="mdi-checkbox-blank-circle-outline"
        indeterminate-icon="mdi-checkbox-blank-circle"
        color="primary"
        :disabled="loading || !isSelectDisabled"
        v-bind="props"
        v-on="on"
      />
    </template>

    <!-- checkbox on table body each item -->
    <template #[`item.data-table-select`]="{ item, isSelected, select }">
      <v-simple-checkbox
        v-ripple
        on-icon="mdi-checkbox-marked-circle"
        off-icon="mdi-checkbox-blank-circle-outline"
        color="primary"
        :value="isSelected"
        :disabled="loading || validateSelect(item)"
        @input="select($event)"
      />
    </template>

    <!-- order item cell -->
    <template #[`item.orderCode`]="{ item }">
      <v-btn text color="primary" @click="$emit('doGetDetails', item)">
        {{ item.orderCode }}
      </v-btn>
    </template>

    <!-- batch id cell -->
    <template #[`item.batchId`]="{ item }">
      <v-btn
        v-if="item.batchCode"
        text
        color="primary"
        @click="$emit('doGetBatchDetails', item)"
      >
        {{ item.batchCode }}
      </v-btn>
    </template>

    <!-- service type cell -->
    <template #[`item.serviceType`]="{ item }">
      <div v-if="item.requestedServices" class="d-flex align-center">
        <v-chip
          v-for="service in item.requestedServices"
          :key="service"
          small
          :color="$customUtils.setColorServiceType(service)"
          class="text-uppercase white--text ma-1"
        >
          {{ $customUtils.setServiceType(service) }}
        </v-chip>
      </div>
    </template>

    <!-- status cell -->
    <template #[`item.status`]="{ item: { latestUpdate } }">
      <div class="text--secondary">
        {{ latestUpdate ? latestUpdate.comments : '' }}
      </div>
    </template>

    <!-- origin cell -->
    <template #[`item.origin`]="{ item }">
      <div class="text--secondary">
        {{ item.pickupCountry || item.senderCountry }}
      </div>
    </template>

    <!-- origin port cell -->
    <template #[`item.originPort`]="{ item }">
      <div class="text--secondary">
        {{ item.senderPort.code }}
      </div>
    </template>

    <!-- destination cell -->
    <template #[`item.destination`]="{ item }">
      <div class="text--secondary">
        {{ item.consigneeCountry }}
      </div>
    </template>

    <!-- destination port cell -->
    <template #[`item.destinationPort`]="{ item }">
      <div class="text--secondary">
        {{ item.destPort.code }}
      </div>
    </template>

    <!-- creation date cell -->
    <template #[`item.creationDate`]="{ item }">
      <div class="text--secondary">
        {{ $dateFns.format(item.createdAt, 'MMM dd, yyyy HH:mm') }}
      </div>
    </template>

    <!-- actions cell -->
    <template #[`item.actions`]="{ item }">
      <div class="d-flex align-center">
        <v-btn
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
    <!-- START DETAIL MARKETPLACE -->
    <template #[`item.countryTable`]="{ item }">
      <div
        style="font-size: 0.975rem !important;"
      >
        {{ item.countryTable }}
      </div>
    </template>
    <template #[`item.zoneTable`]="{ item }">
      <div
        :class="
          item.slaTable
            ? `green--text font-weight-bold`
            : `error--text font-weight-bold`
        "
        style="font-size: 0.975rem !important;"
      >
        {{ item.zoneTable }}
      </div>
    </template>
    <template #[`item.codTable`]="{ item }">
      <div
        :class="
          item.codTable
            ? `green--text font-weight-bold`
            : `error--text font-weight-bold`
        "
        style="font-size: 0.975rem !important;"
      >
        {{ item.slaTable ? (item.codTable ? 'Yes' : 'No') : '' }}
      </div>
    </template>
    <template #[`item.slaTable`]="{ item }">
      <div
        style="font-size: 0.975rem !important;"
      >
        {{ item.slaTable }}
      </div>
    </template>
    <!-- END DETAIL MARKETPLACE -->
  </v-data-table>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  PropType,
  useRoute,
} from '@nuxtjs/composition-api'
import { FilterDetails, Pagination } from '~/types/applications'
import { Order } from '~/types/orders'

import {
  IncomingOrder,
  OrderAllocation,
} from '~/types/partnerPortals/incomingOrders'

export default defineComponent({
  name: 'BaseTable',
  props: {
    value: {
      type: Array,
      default: () => [],
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
    options: {
      type: Object as PropType<Pagination>,
      required: true,
    },
    loading: {
      type: Boolean,
    },
    showSelect: {
      type: Boolean,
      default: false,
    },
    isSelectDisabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const route = useRoute()
    const selected = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })
    const fetch = (data: FilterDetails) => {
      emit('fetch', data)
    }
    const doSelectAll = (data: []) => {
      emit('doSelectAll', data)
    }

    const validateSelect = (item: Order | IncomingOrder) => {
      if (route.value.name === 'partner-portals-id-incoming-orders') {
        return !(item as IncomingOrder).orderAllocations.some(
          (el: OrderAllocation) => el.externalTrackingNumber
        )
      } else if (route.value.name === 'orders') {
        return !item.labelPath
      } else {
        return false
      }
    }

    return {
      selected,
      fetch,
      doSelectAll,
      validateSelect,
    }
  },
})
</script>
