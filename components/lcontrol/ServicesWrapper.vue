<template>
  <div class="service-wrapper-content service-color scroller blue-scroller">
    <div
      v-for="(service, serviceIndex) in serviceTypes"
      :key="serviceIndex"
      :class="`text ${
        userSelected.serviceType.name === service.name ? 'red-color' : ''
      } ${userSelected.useBOB || loading ? 'disabled' : ''}`"
      :style="`${
        !isExistServiceTypes ? 'visibility: hidden;' : ''
      } line-height: 36px`"
      @click="$emit('handleServiceSelections', { data: service })"
    >
      {{ $customUtils.setServiceType(service.name) }}
    </div>

    <BOB
      v-if="userSelected"
      v-model="userSelected"
      :loading="loading"
      @handleBob="(value) => $emit('handleBob', value)"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  useStore,
} from '@nuxtjs/composition-api'
// components
import BOB from '~/components/lcontrol/BOB.vue'
import { ServiceType, VuexModuleFilters } from '~/types/filters'
// types
import { UserSelectedLControl } from '~/types/lControl/lControl'

export default defineComponent({
  components: {
    BOB,
  },
  props: {
    value: {
      type: Object as PropType<UserSelectedLControl>,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    // manage store filters
    const storeFilters = useStore<VuexModuleFilters>()
    const serviceTypes = computed(() => {
      const moveItem = (from: number, to: number, data: any) => {
        // remove `from` item and store it
        const fromItem = data.splice(from, 1)[0]
        // insert stored item into position `to`
        data.splice(to, 0, fromItem)
      }
      let filter = storeFilters.state.filters.serviceTypes
      const indexFM = filter.findIndex(
        (x: ServiceType) => x.name === 'FIRST_MILE'
      )
      const indexCM = filter.findIndex((x: ServiceType) => x.name === 'CUSTOMS')

      if (filter && filter.length > 0) {
        filter = filter.filter(
          (x: ServiceType) => x.name !== 'FREIGHT_FORWARDER'
        )

        moveItem(indexFM, 0, filter)
        moveItem(indexCM, 1, filter)
      }

      return filter
    })

    const userSelected = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })
    const isExistServiceTypes = computed(
      () => !!serviceTypes.value.length && !!userSelected.value.country.value
    )

    return {
      serviceTypes,
      isExistServiceTypes,
      userSelected,
    }
  },
})
</script>
