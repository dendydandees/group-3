<template>
  <div
    :class="`zone-wrapper-content scroller ${
      userSelected.useBOB ? 'd-flex align-center justify-center' : ''
    }`"
  >
    <ZonesSelectionList
      v-if="
        !userSelected.zone.zoneName &&
        !userSelected.port.name &&
        !userSelected.useBOB
      "
      :user-selected="userSelected"
      :show-ports-or-zones="showPortsOrZones"
      :ports-meta="portsMeta"
      :loading="loading"
      :is-on-service-type="isOnServiceType"
      @changePortsMeta="(value) => $emit('changePortsMeta', value)"
      @getPorts="$emit('getPorts')"
      @handleZoneSelection="(value) => $emit('handleZoneSelection', value)"
    />

    <BOBContent v-else-if="userSelected.useBOB" />

    <template v-else>
      <slot name="form" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
// components
import ZonesSelectionList from '@/components/lcontrol/ZonesSelectionList.vue'
import BOBContent from '@/components/lcontrol/BOBContent.vue'
// types
import { IsOnServiceType } from '~/pages/lControl/index.vue'
import { Pagination } from '~/types/applications'
import { UserSelectedLControl } from '~/types/lControl/lControl'
import { PortData, ZoneData } from '~/types/filters'

export default defineComponent({
  components: {
    ZonesSelectionList,
    BOBContent,
  },
  props: {
    userSelected: {
      type: Object as PropType<UserSelectedLControl>,
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
    showPortsOrZones: {
      type: Array as PropType<ZoneData[] | PortData[]>,
      required: true,
    },
  },
})
</script>
