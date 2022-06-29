<template>
  <div :class="`zone-text`">
    <template v-if="showPortsOrZones && userSelected.serviceType.name">
      <div
        v-for="(portsOrZones, indexPortsOrZones) in showPortsOrZones"
        :key="indexPortsOrZones"
        :class="`text`"
        :style="`${
          !userSelected.serviceType.name ? 'visibility: hidden;' : ''
        }`"
      >
        <div class="d-flex align-center justify-space-between">
          <div style="max-width: 40%">
            {{
              isOnServiceType.customs
                ? portsOrZones.name
                : portsOrZones.zoneName
            }}
          </div>

          <div style="max-width: 40%" class="d-flex align-center">
            <span
              style="
                font-size: 15px;
                line-height: 18px;
                color: #575757;
                max-width: 80%;
              "
              class="d-inline-block text-truncate"
            >
              {{ isRulesExist(portsOrZones, 'partnerName') }}
            </span>

            <v-btn
              color="primary darken-1 white--text ml-6"
              :disabled="loading"
              @click="$emit('handleZoneSelection', { data: portsOrZones })"
            >
              <!-- {{ !portsOrZones.partnerID ? 'SETUP' : 'UPDATE' }} -->
              {{ isRulesExist(portsOrZones, 'button') }}
            </v-btn>
          </div>
        </div>
      </div>

      <!-- handle intersect for port -->
      <template v-if="isOnServiceType.customs">
        <div v-if="loading" class="d-flex justify-center">
          <v-progress-circular indeterminate color="primary" />
        </div>

        <div v-else v-intersect="portIntersect" />
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  useStore,
} from '@nuxtjs/composition-api'
import { PortData, ZoneData } from '~/types/filters'
// types
import { LControl, VuexModuleLControls } from '~/types/lControl/lControl'
import { IsOnServiceType } from '~/pages/lControl/index.vue'
import { Pagination } from '~/types/applications'
import { VuexModuleMarketplaces } from '~/types/marketplace/marketplace'

export default defineComponent({
  props: {
    userSelected: {
      type: Object as PropType<LControl>,
      required: true,
    },
    showPortsOrZones: {
      type: Array as PropType<ZoneData[] | PortData[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    isOnServiceType: {
      type: Object as PropType<IsOnServiceType>,
      required: true,
    },
    portsMeta: {
      type: Object as PropType<Pagination>,
      required: true,
    },
  },
  setup({ portsMeta, showPortsOrZones, isOnServiceType }, { emit }) {
    // manage store
    const storeOfLControls = useStore<VuexModuleLControls>()
    const storeMarketplaces = useStore<VuexModuleMarketplaces>()
    const lControlList = computed(
      () => storeOfLControls.state.lControls.lControls
    )
    const partnersConnected = computed(
      () =>
        storeMarketplaces.state.marketplaces.marketplaces.marketplacesConnected
    )
    const stateStore = { lControlList, partnersConnected }
    // end manage store

    const isRulesExist = (data: ZoneData | PortData, checkOn: string) => {
      const lControlDetail = lControlList.value.find((lcontrol) =>
        isOnServiceType.lastMile
          ? lcontrol.zoneID === data.id
          : lcontrol.portID === data.id
      )

      if (!lControlDetail && checkOn === 'button') return 'SETUP'
      if (!lControlDetail && checkOn === 'partnerName')
        return 'Waiting for Setup'

      const partnerDetail = partnersConnected.value.find(
        (partner) => partner.id === lControlDetail?.defaultPartner.partnerID
      )?.name

      return checkOn === 'partnerName' ? partnerDetail : 'UPDATE'
    }
    const portIntersect = async (
      _entries: IntersectionObserverEntry[],
      _observer: IntersectionObserver,
      isIntersecting: boolean
    ) => {
      if (
        !isIntersecting ||
        portsMeta.itemsPerPage >= showPortsOrZones.length
      ) {
        return
      }

      emit('changePortsMeta', {
        page: 1,
        itemsPerPage: portsMeta.itemsPerPage + 10,
      })
      await emit('getPorts')
    }
    const functionOther = { isRulesExist, portIntersect }

    return {
      ...stateStore,
      ...functionOther,
    }
  },
})
</script>
