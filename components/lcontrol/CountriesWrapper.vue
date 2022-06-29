<template>
  <div class="country-wrapper-content scroller">
    <BaseLoadingLinear
      v-if="$fetchState.pending"
      title="Getting countries data..."
    />

    <template v-else>
      <div
        v-for="(country, countryIndex) in countryCodes"
        :key="countryIndex"
        :class="`text padding-text-country ${
          userSelected.country.value === country.value ? 'service-color' : ''
        }`"
        @click="$emit('handleCountrySelection', { data: country })"
      >
        <div
          :class="`${
            userSelected.country.value === country.value ? 'red-color' : ''
          } ${loading ? 'disabled' : ''}`"
        >
          {{ country.name }}
        </div>

        <div class="text-sub">Manually Updated</div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  useStore,
  useFetch,
  PropType,
} from '@nuxtjs/composition-api'
// types
import { VuexModuleFilters } from '~/types/filters'
import { UserSelectedLControl } from '~/types/lControl/lControl'

export default defineComponent({
  props: {
    userSelected: {
      type: Object as PropType<UserSelectedLControl>,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    // manage store filters
    const storeFilters = useStore<VuexModuleFilters>()
    const countryCodes = computed(() => storeFilters.state.filters.countryCodes)

    // manage fetch data
    useFetch(async () => {
      await storeFilters.dispatch('filters/getCountryCodes', {
        params: { isActive: true },
      })
    })

    return {
      // manage store filters
      countryCodes,
    }
  },
})
</script>
