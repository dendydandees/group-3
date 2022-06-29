<template>
  <div>
    <div
      v-if="!!networkPartnersForm.length && isOnServiceType.lastMile"
      class="mt-2"
    >
      <LcontrolDropdownCustomInput
        v-for="(networkPartner, networkPartnerIndex) in networkPartnersForm"
        :key="networkPartnerIndex"
        v-model="networkPartnersForm[networkPartnerIndex]"
        :label="`${setLabel(networkPartnerIndex)} Network Partner`"
        :placeholder="'Default Partner'"
        :data="partnersConnected"
        :disabled-drop="loading"
        :item-show="{ text: 'name', value: 'id' }"
        :is-delete="true"
        class="mb-2"
        @delete="handleDeletePartner(networkPartnerIndex)"
      />
    </div>

    <div
      v-if="networkPartnersForm.length < 3 && isOnServiceType.lastMile"
      :class="` my-4 btn-COD ${
        userSelected.defaultPartner.partnerID ? '' : 'disabled'
      } ${loading ? 'text--secondary' : 'primary--text'}
                      `"
      :style="`${loading ? '' : 'cursor: pointer'}`"
      @click="handleSelectionPartner"
    >
      + Add Network Partner
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  useStore,
  Ref,
  watch,
  ref,
  onMounted,
} from '@nuxtjs/composition-api'
// types
import { IsOnServiceType } from '~/pages/lControl/index.vue'
import { UserSelectedLControl, LControlDetail } from '~/types/lControl/lControl'
import { VuexModuleMarketplaces } from '~/types/marketplace/marketplace'

const detail = {
  partnerID: '',
  volume: 0,
} as LControlDetail

export default defineComponent({
  props: {
    value: {
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
  },
  setup(props, { emit }) {
    // manage store marketplaces
    const storeMarketplaces = useStore<VuexModuleMarketplaces>()
    const partnersConnected = computed(
      () =>
        storeMarketplaces.state.marketplaces.marketplaces.marketplacesConnected
    )
    // end manage store marketplaces

    const userSelected = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })
    const networkPartnersForm = ref([]) as unknown as Ref<LControlDetail[]>
    const stateOther = { networkPartnersForm, userSelected }

    const setLabel = (index: number) => {
      if (index > 3) return ''

      switch (index) {
        case 0:
          return 'Primary'
        case 1:
          return 'Secondary'
        case 2:
          return 'Tertiary'
      }
    }
    const handleSelectionPartner = () => {
      const networkPartnersFormLength = networkPartnersForm.value.length

      if (networkPartnersFormLength > 3) return

      networkPartnersForm.value.push({ ...detail })
    }
    const handleDeletePartner = (index: number) => {
      const isNetworkPartnerNotEmpty = !!networkPartnersForm.value.find(
        (_partner, indexpartner) => indexpartner === index
      )?.partnerID

      if (!isNetworkPartnerNotEmpty) {
        networkPartnersForm.value.splice(index, 1)
      } else {
        emit('handleDeleteNetworkPartner', 'networkPartner', index)
      }
    }
    const functionOther = {
      setLabel,
      handleSelectionPartner,
      handleDeletePartner,
    }

    // set network partner form on mounted
    onMounted(() => {
      const { primary, secondary, tertiary } = userSelected.value

      if (primary.partnerID) {
        networkPartnersForm.value.push({
          partnerID: primary.partnerID,
          volume: primary.volume,
        })
      }

      if (secondary.partnerID) {
        networkPartnersForm.value.push({
          partnerID: secondary.partnerID,
          volume: secondary.volume,
        })
      }

      if (tertiary.partnerID) {
        networkPartnersForm.value.push({
          partnerID: tertiary.partnerID,
          volume: tertiary.volume,
        })
      }
    })

    // watch state changed network partners (primary, secondary, tertiary)
    watch(
      networkPartnersForm.value,
      (newValue) => {
        const setValueBasedNPIndex = (length: number) => {
          return newValue.length >= length
            ? { ...newValue[length - 1] }
            : { ...detail }
        }

        userSelected.value = {
          ...userSelected.value,
          primary: setValueBasedNPIndex(1),
          secondary: setValueBasedNPIndex(2),
          tertiary: setValueBasedNPIndex(3),
        }
      },
      { deep: true }
    )

    return {
      // manage store marketplaces
      partnersConnected,
      // end manage store marketplaces
      ...stateOther,
      ...functionOther,
    }
  },
})
</script>
