<template>
  <div class="mb-6">
    <!-- country -->
    <v-col cols="12">
      <v-row align="center">
        <v-col cols="12" md="2" class="d-flex align-center">
          <label
            for="country"
            class="primary--text subtitle-1 font-weight-medium"
          >
            Country
          </label>
        </v-col>

        <v-col cols="12" md="3">
          <ValidationProvider
            v-slot="{ errors }"
            slim
            name="Country"
            rules="required"
            tag="div"
          >
            <v-autocomplete
              id="country"
              v-model="select.country"
              :items="selectData.countries"
              :search-input.sync="searchSelect.country"
              :error-messages="errors"
              :hide-details="errors.length === 0"
              clearable
              cache-items
              outlined
              rounded
              dense
              single-line
              item-text="name"
              item-value="value"
              background-color="white"
              label="Country"
              placeholder="Enter your country..."
              class="input-filter"
              :class="errors.length === 0 ? 'elevation-1' : ''"
            />
          </ValidationProvider>
        </v-col>

        <v-col cols="12" md="7">
          <v-expand-transition>
            <v-alert
              v-if="currentExistZones"
              type="warning"
              rounded="xl"
              class="ma-0"
            >
              <span> We currently only offer pickup/drop-off from </span>

              <span class="font-weight-bold text-capitalize">
                {{ currentExistZones }}
              </span>

              <span> in </span>

              <span class="font-weight-bold text-capitalize">
                {{
                  searchSelect.country ? searchSelect.country.toLowerCase() : ''
                }}
              </span>
            </v-alert>
          </v-expand-transition>
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
  useFetch,
  useStore,
} from '@nuxtjs/composition-api'
import { ValidationProvider } from 'vee-validate'

// interfaces and types
import { Select } from './Form.vue'
import { VuexModuleFilters } from '~/types/filters'

export default defineComponent({
  components: {
    ValidationProvider,
  },
  props: {
    value: {
      type: Object as PropType<Select>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const storeFilter = useStore<VuexModuleFilters>()

    const select = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })
    const selectData = computed(() => ({
      countries: storeFilter.state.filters.countryCodes,
    }))
    const searchSelect = ref({
      country: '',
    })
    const currentExistZones = computed(() => {
      const zones = [
        {
          country: 'HK',
          city: ['Hongkong'],
        },
        {
          country: 'ID',
          city: ['Great Jakarta'],
        },
        {
          country: 'MY',
          city: ['Klang Valley'],
        },
        {
          country: 'PH',
          city: ['Manila'],
        },
        {
          country: 'SG',
          city: ['Singapore'],
        },
        {
          country: 'TW',
          city: ['Taiwan'],
        },
        {
          country: 'TH',
          city: ['Greater Bangkok'],
        },
        {
          country: 'VN',
          city: ['Hanoi'],
        },
      ]

      return zones
        .filter((zone) => zone.country === select.value.country)
        .map((zone) => zone.city)
        .flat()
        .join(' ')
    })

    useFetch(async () => {
      await storeFilter.dispatch('filters/getCountryCodes', {
        params: { isActive: true },
      })
    })

    return {
      select,
      selectData,
      searchSelect,
      currentExistZones,
    }
  },
})
</script>
