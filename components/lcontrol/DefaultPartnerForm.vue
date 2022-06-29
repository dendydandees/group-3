<template>
  <div>
    <LcontrolDropdownCustom
      v-model="userSelected.defaultPartner.partnerID"
      :label="`${
        isOnServiceType.customs ? 'Port' : 'Zone'
      } Default Network Partner`"
      :placeholder="'Default Partner'"
      :data="partnersConnected"
      :disabled-drop="loading"
      :item-show="{
        text: 'name',
        value: 'id',
      }"
    />

    <div
      v-if="
        userSelected.defaultPartner.partnerID &&
        userSelected.serviceType.name === 'LAST_MILE'
      "
      class="primary--text"
      style="
        font-size: 12px;
        margin-top: 5px;
        justify-content: end;
        display: flex;
      "
    >
      <span v-if="isPartnersCOD(userSelected.defaultPartner.partnerID)">
        Partner available for COD service
      </span>

      <span v-else class="error--text">
        Partner not available for COD service
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  useStore,
} from '@nuxtjs/composition-api'
// types
import { VuexModuleMarketplaces } from '~/types/marketplace/marketplace'
import { UserSelectedLControl } from '~/types/lControl/lControl'
import { IsOnServiceType } from '~/pages/lControl/index.vue'

export default defineComponent({
  props: {
    value: {
      type: Object as PropType<UserSelectedLControl>,
      required: true,
    },
    isOnServiceType: {
      type: Object as PropType<IsOnServiceType>,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    // manage store marketplaces
    const storeMarketplaces = useStore<VuexModuleMarketplaces>()
    const partnersConnected = computed(
      () =>
        storeMarketplaces.state.marketplaces.marketplaces.marketplacesConnected
    )
    const partnersConnectedCOD = computed(
      () => storeMarketplaces.state.marketplaces.marketplaces.marketplacesCOD
    )
    // end manage store marketplaces

    const userSelected = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })
    const isPartnersCOD = (partnerId: string) =>
      partnersConnectedCOD.value.some((partner) => partner.id === partnerId)

    return {
      // manage store marketplaces
      partnersConnected,
      // end manage store marketplaces
      userSelected,
      isPartnersCOD,
    }
  },
})
</script>
