<template>
  <div>
    <div
      v-if="
        !isActiveForm &&
        !userSelected.codPartner.partnerID &&
        isOnServiceType.lastMile
      "
      :class="`my-4 btn-COD ${
        userSelected.defaultPartner.partnerID ? '' : 'disabled'
      } ${loading ? 'text--secondary' : 'primary--text'}`"
      :style="`${loading ? '' : 'cursor: pointer'}`"
      @click="handleSelectionCOD"
    >
      + Add COD Default Network Partner
    </div>

    <div
      v-if="
        (isActiveForm || userSelected.codPartner.partnerID) &&
        isOnServiceType.lastMile
      "
      class="d-flex mt-2"
    >
      <LcontrolDropdownCustom
        v-model="userSelected.codPartner.partnerID"
        :label="`COD Default Network Partner`"
        :placeholder="'COD Default Partner'"
        :data="partnersConnectedCOD"
        :disabled-drop="loading"
        :item-show="{
          text: 'name',
          value: 'id',
        }"
        :is-delete="true"
        :is-info="true"
        @delete="handleDeleteCOD"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  useStore,
  ref,
  computed,
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
    const partnersConnectedCOD = computed(
      () => storeMarketplaces.state.marketplaces.marketplaces.marketplacesCOD
    )
    // end manage store marketplaces

    const userSelected = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })
    const isActiveForm = ref(!!userSelected.value.codPartner.partnerID)
    const handleSelectionCOD = () => {
      isActiveForm.value = true
    }
    const handleDeleteCOD = () => {
      const codIsExist = !!userSelected.value.codPartner.partnerID

      /* if cod is not exist just hide a form
       * else show modal
       */
      if (!codIsExist) {
        isActiveForm.value = false
        userSelected.value.codPartner = {
          partnerID: '',
        }
      } else {
        emit('handleDeleteCOD')

        if (!userSelected.value.codPartner.partnerID) isActiveForm.value = false
      }
    }

    return {
      // manage store marketplaces
      partnersConnectedCOD,
      // end manage store marketplaces
      userSelected,
      isActiveForm,
      handleSelectionCOD,
      handleDeleteCOD,
    }
  },
})
</script>
