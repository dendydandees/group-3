<template>
  <div class="d-flex align-center">
    <v-btn
      v-if="actionExist.export"
      small
      dark
      :loading="loading"
      color="cyan darken-1"
      class="ma-2"
      @click="doExportOrder(item.id)"
    >
      Export
    </v-btn>

    <v-btn
      v-if="actionExist.edit"
      small
      :dark="!!item.labelPath"
      :loading="loading"
      color="teal darken-1"
      class="ma-2 white--text"
      @click="doMovePageBagPartner(item)"
    >
      Edit
    </v-btn>

    <v-btn
      v-if="actionExist.downloadSingle"
      small
      download
      :dark="!!item.labelPath"
      :href="item.labelPath || ''"
      :loading="loading"
      :disabled="!item.labelPath"
      color="teal darken-1"
      class="ma-2"
    >
      Download
    </v-btn>

    <!-- button component for separated label download ( orders page) -->
    <v-menu transition="slide-y-transition" bottom offset-y>
      <template #activator="{ on, attrs }">
        <v-btn
          v-if="actionExist.downloadSelection"
          v-bind="attrs"
          :loading="loading"
          :disabled="!isDisabled.labelSeparated(item)"
          :dark="isDisabled.labelSeparated(item)"
          small
          download
          color="teal darken-1"
          class="ma-2"
          v-on="on"
        >
          <span> Download Label </span>

          <v-icon right> mdi-chevron-down </v-icon>
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item
          :disabled="!item.labelPath"
          :href="item.labelPath || ''"
          :ripple="{ class: `primary--text` }"
          download
        >
          <v-list-item-title>All</v-list-item-title>
        </v-list-item>

        <v-list-item
          v-for="allocation in item.orderAllocations"
          :key="allocation.id"
          :ripple="{ class: `primary--text` }"
          :disabled="!allocation.labelURL"
          :href="allocation.labelURL || ''"
          download
        >
          <v-list-item-title class="text-capitalize">
            {{
              `Only ${$customUtils.setServiceType(
                allocation.serviceType.toLowerCase()
              )}`
            }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn
      v-if="actionExist.downloadBagging"
      small
      download
      :dark="!!item.label_url"
      :href="item.label_url || ''"
      :loading="loading"
      :disabled="!item.label_url"
      color="teal darken-1"
      class="ma-2"
    >
      Download
    </v-btn>
    <v-btn
      v-if="actionExist.updates"
      small
      dark
      :loading="loading"
      color="cyan darken-1"
      class="ma-2"
      @click="track(item)"
    >
      Track
    </v-btn>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  useContext,
  useStore,
} from '@nuxtjs/composition-api'
import { saveAs } from 'file-saver'
import { Bagged } from '~/types/bagging/bagging'
// types
import { Order, VuexModuleOrders } from '~/types/orders'

export default defineComponent({
  name: 'TableActions',
  props: {
    item: {
      type: Object as PropType<Record<string, string>>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    actionExist: {
      type: Object,
      default: () => ({
        export: false,
        downloadSingle: false,
        downloadSelection: false,
      }),
    },
  },
  setup(_props, { emit }) {
    const { $dateFns } = useContext()
    // manage order store
    const storeOrders = useStore<VuexModuleOrders>()
    // end

    /* Function for
     * - Order pages
     * - Incoming order pages
     */
    const doExportOrder = async (id: string) => {
      const response = await storeOrders.dispatch('orders/getSelectedExports', {
        data: [id],
      })
      const fileName = `order_exports_${$dateFns.format(
        new Date(),
        'yyyy-MM-dd_HH-mm'
      )}.xlsx`

      saveAs(response, fileName)
    }
    const isDisabled = {
      labelSeparated: (data: Order) =>
        !!data.labelPath ||
        data.orderAllocations.every((allocation) => allocation.labelURL),
    }
    const functionOrder = { doExportOrder, isDisabled }
    // end

    /* Function for
     * - Bagging pages
     */
    function doMovePageBagPartner(data: any) {
      emit('doMovePageBagPartner', data)
    }
    function track(data: Bagged) {
      emit('doHandleModalTrack', data)
    }
    const functionBagging = { doMovePageBagPartner, track }
    // end

    return {
      ...functionOrder,
      ...functionBagging,
    }
  },
})
</script>
