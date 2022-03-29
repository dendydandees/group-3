<template>
  <v-row align="center" class="ma-0">
    <!-- order code -->
    <v-col cols="12" md="3">
      <v-text-field
        v-model="filterOrder.orderCode"
        clearable
        outlined
        dense
        rounded
        single-line
        hide-details
        label="Order code"
        placeholder="Enter your order code..."
        background-color="white"
        type="search"
        class="input-filter elevation-1"
      />
    </v-col>

    <!-- batch id -->
    <v-col cols="12" md="3">
      <v-text-field
        v-model="filterOrder.batchId"
        clearable
        outlined
        dense
        rounded
        single-line
        hide-details
        label="Batch code"
        placeholder="Enter your batch code..."
        background-color="white"
        type="search"
        class="input-filter elevation-1"
      />
    </v-col>

    <!-- origin country -->
    <v-col cols="12" md="3">
      <v-autocomplete
        v-model="filterOrder.originCountry"
        :items="country"
        :search-input.sync="search.originCountry"
        clearable
        cache-items
        outlined
        rounded
        dense
        single-line
        hide-details
        item-text="name"
        item-value="value"
        background-color="white"
        label="Origin country"
        placeholder="Enter your origin country..."
        class="input-filter elevation-1"
      />
    </v-col>

    <!-- destination country -->
    <v-col cols="12" md="3">
      <v-autocomplete
        v-model="filterOrder.destinationCountry"
        :items="country"
        :search-input.sync="search.destinationCountry"
        clearable
        cache-items
        outlined
        rounded
        dense
        single-line
        hide-details
        item-text="name"
        item-value="value"
        background-color="white"
        label="Destination country"
        placeholder="Enter your destination country..."
        class="input-filter elevation-1"
      />
    </v-col>

    <!-- service type -->
    <v-col cols="12" md="3">
      <v-autocomplete
        v-model="filterOrder.serviceType"
        :items="serviceTypes"
        :search-input.sync="search.serviceType"
        clearable
        cache-items
        outlined
        rounded
        dense
        single-line
        hide-details
        background-color="white"
        label="Service type"
        placeholder="Enter your service type..."
        class="input-filter elevation-1"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  useFetch,
  useStore,
  ref,
  Ref,
  useContext,
} from '@nuxtjs/composition-api'
// types
import { CountryCode, ServiceType, VuexModuleFilters } from '~/types/filters'
import { FilterOrders } from '~/types/orders'

export default defineComponent({
  props: {
    value: {
      type: Object as PropType<FilterOrders>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { app } = useContext()
    const storeFilter = useStore<VuexModuleFilters>()
    const filterOrder = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })
    const search = ref({
      originCountry: '',
      destinationCountry: '',
      serviceType: '',
    })
    const serviceTypes = ref([]) as Ref<ServiceType[]>
    const country = ref([]) as Ref<CountryCode[]>

    useFetch(async () => {
      await storeFilter.dispatch('filters/getServiceTypes')
      await storeFilter.dispatch('filters/getZones', { params: {} })
      await storeFilter.dispatch('filters/getCountryCodes')

      // format service types
      const formatServiceTypes = storeFilter.state.filters.serviceTypes.map(
        (type) => app.$customUtils.setServiceType(type.name)
      )

      serviceTypes.value = formatServiceTypes

      /* format country
       * filter duplicate zone country
       * filter country list based on zone country filtered before
       */
      const countryList = storeFilter.state.filters.zones
        .filter(
          (value, index, array) =>
            array.findIndex(
              (valueArray) => valueArray.country === value.country
            ) === index
        )
        .map((zone) => zone.country)
      const formatCountry = storeFilter.state.filters.countryCodes.filter(
        (country) => countryList.includes(country.value)
      )

      country.value = formatCountry
    })

    return {
      filterOrder,
      search,
      serviceTypes,
      country,
    }
  },
})
</script>
