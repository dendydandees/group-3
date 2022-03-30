<template>
  <v-row align="center" class="ma-0" no-gutters>
    <!-- order code -->
    <v-col cols="12" md="3" class="px-2 py-4">
      <v-text-field
        v-model="filterOrder.orderCode"
        clearable
        outlined
        dense
        rounded
        single-line
        hide-details
        label="Order ID"
        placeholder="Enter your order id..."
        background-color="white"
        type="search"
        class="input-filter elevation-1"
      />
    </v-col>

    <!-- batch id -->
    <v-col cols="12" md="3" class="px-2 py-4">
      <v-text-field
        v-model="filterOrder.batchId"
        clearable
        outlined
        dense
        rounded
        single-line
        hide-details
        label="Batch ID"
        placeholder="Enter your batch id..."
        background-color="white"
        type="search"
        class="input-filter elevation-1"
      />
    </v-col>

    <!-- created from  -->
    <v-col cols="12" md="3" class="px-2 py-4">
      <v-menu
        v-model="menu.createdFrom"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            :value="date.createdFrom"
            v-bind="attrs"
            readonly
            clearable
            single-line
            outlined
            rounded
            dense
            hide-details
            label="Created From"
            placeholder="Enter your created from..."
            class="input-filter elevation-1"
            v-on="on"
            @click:clear="filterOrder.createdFrom = null"
          />
        </template>

        <v-date-picker
          v-model="filterOrder.createdFrom"
          :max="filterOrder.createdTo"
          show-adjacent-months
          @input="menu.createdFrom = false"
        />
      </v-menu>
    </v-col>

    <!-- created to  -->
    <v-col cols="12" md="3" class="px-2 py-4">
      <v-menu
        v-model="menu.createdTo"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            :value="date.createdTo"
            v-bind="attrs"
            readonly
            clearable
            single-line
            outlined
            rounded
            dense
            hide-details
            label="Created To"
            placeholder="Enter your created to..."
            class="input-filter elevation-1"
            v-on="on"
            @click:clear="filterOrder.createdTo = null"
          />
        </template>

        <v-date-picker
          v-model="filterOrder.createdTo"
          :min="filterOrder.createdFrom"
          show-adjacent-months
          @input="menu.createdTo = false"
        />
      </v-menu>
    </v-col>

    <!-- origin country -->
    <v-col cols="12" md="3" class="px-2 py-4">
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
        label="Origin Country"
        placeholder="Enter your origin country..."
        class="input-filter elevation-1"
      />
    </v-col>

    <!-- destination country -->
    <v-col cols="12" md="3" class="px-2 py-4">
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
        label="Destination Country"
        placeholder="Enter your destination country..."
        class="input-filter elevation-1"
      />
    </v-col>

    <!-- origin port -->
    <v-col cols="12" md="3" class="px-2 py-4">
      <v-autocomplete
        v-model="filterOrder.originPortId"
        :items="ports.data"
        :search-input.sync="search.originPortId"
        clearable
        cache-items
        outlined
        rounded
        dense
        single-line
        hide-details
        item-text="name"
        item-value="id"
        background-color="white"
        label="Origin Port"
        placeholder="Enter your origin port..."
        class="input-filter elevation-1"
      >
        <template #append-item>
          <div v-intersect="portIntersect" />
        </template>
      </v-autocomplete>
    </v-col>

    <!-- destination port -->
    <v-col cols="12" md="3" class="px-2 py-4">
      <v-autocomplete
        v-model="filterOrder.destinationPortId"
        :items="ports.data"
        :search-input.sync="search.destinationPortId"
        clearable
        cache-items
        outlined
        rounded
        dense
        single-line
        hide-details
        item-text="name"
        item-value="id"
        background-color="white"
        label="Destination Port"
        placeholder="Enter your destination port..."
        class="input-filter elevation-1"
      >
        <template #append-item>
          <div v-intersect="portIntersect" />
        </template>
      </v-autocomplete>
    </v-col>

    <!-- service type -->
    <v-col cols="12" md="3" class="px-2 py-4">
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
        multiple
        small-chips
        deletable-chips
        item-text="text"
        item-value="value"
        background-color="white"
        label="Service Type"
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
import { Pagination } from '~/types/applications'
import { CountryCode, VuexModuleFilters, Ports } from '~/types/filters'
import { FilterOrders } from '~/types/orders'

export default defineComponent({
  props: {
    value: {
      type: Object as PropType<FilterOrders>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { app, $dateFns } = useContext()

    const storeFilter = useStore<VuexModuleFilters>()
    const filterOrder = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })

    // manage date for filter by created from and to
    const menu = ref({
      createdFrom: false,
      createdTo: false,
    })
    const date = computed(() => ({
      createdFrom: filterOrder.value.createdFrom
        ? $dateFns.format(
            $dateFns.parseISO(filterOrder.value.createdFrom),
            'MMMM do yyyy'
          )
        : '',
      createdTo: filterOrder.value.createdTo
        ? $dateFns.format(
            $dateFns.parseISO(filterOrder.value.createdTo),
            'MMMM do yyyy'
          )
        : '',
    }))

    // manage filter
    const search = ref({
      originCountry: '',
      destinationCountry: '',
      serviceType: '',
      originPortId: '',
      destinationPortId: '',
    })
    const serviceTypes = ref([]) as Ref<{ text: string; value: string }[]>
    const country = ref([]) as Ref<CountryCode[]>

    // manage ports
    const ports = computed(() => storeFilter.state.filters.ports) as Ref<Ports>
    const portsMeta = ref({
      page: 1,
      itemsPerPage: 10,
    }) as Ref<Pagination>
    const getPorts = async (params: Pagination) => {
      const { page, itemsPerPage: perPage } = params
      await storeFilter.dispatch('filters/getPorts', {
        params: {
          page,
          perPage,
        },
      })
    }
    const portIntersect = async (
      _entries: IntersectionObserverEntry[],
      _observer: IntersectionObserver,
      isIntersecting: boolean
    ) => {
      if (
        !isIntersecting ||
        portsMeta.value.itemsPerPage >= ports.value.totalCount
      ) {
        return
      }

      portsMeta.value = {
        page: 1,
        itemsPerPage: portsMeta.value.itemsPerPage + 10,
      }

      await getPorts(portsMeta.value)
    }

    useFetch(async () => {
      await storeFilter.dispatch('filters/getServiceTypes')
      await storeFilter.dispatch('filters/getZones', { params: {} })
      await storeFilter.dispatch('filters/getCountryCodes')
      await getPorts(portsMeta.value)

      // format service types
      const formatServiceTypes = storeFilter.state.filters.serviceTypes.map(
        (type) => ({
          text: app.$customUtils.setServiceType(type.name),
          value: type.name,
        })
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
      menu,
      search,
      date,
      serviceTypes,
      country,
      ports,
      portIntersect,
    }
  },
})
</script>
