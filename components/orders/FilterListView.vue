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
        v-model="filterOrder.batchCode"
        clearable
        outlined
        dense
        rounded
        single-line
        hide-details
        label="Batch Code"
        placeholder="Enter your batch code..."
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
        :items="filterData.country"
        :search-input.sync="search.originCountry"
        clearable
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
      >
        <template #append-item>
          <div v-if="$fetchState.pending" class="d-flex justify-center">
            <v-progress-circular indeterminate color="primary" />
          </div>
        </template>
      </v-autocomplete>
    </v-col>

    <!-- destination country -->
    <v-col cols="12" md="3" class="px-2 py-4">
      <v-autocomplete
        v-model="filterOrder.destinationCountry"
        :items="filterData.country"
        :search-input.sync="search.destinationCountry"
        clearable
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
      >
        <template #append-item>
          <div v-if="$fetchState.pending" class="d-flex justify-center">
            <v-progress-circular indeterminate color="primary" />
          </div>
        </template>
      </v-autocomplete>
    </v-col>

    <!-- origin port -->
    <v-col cols="12" md="3" class="px-2 py-4">
      <v-autocomplete
        v-model="filterOrder.originPortId"
        :items="filterData.ports.data"
        :search-input.sync="search.originPortId"
        clearable
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
          <div v-if="$fetchState.pending" class="d-flex justify-center">
            <v-progress-circular indeterminate color="primary" />
          </div>

          <div v-else v-intersect="portIntersect" />
        </template>
      </v-autocomplete>
    </v-col>

    <!-- destination port -->
    <v-col cols="12" md="3" class="px-2 py-4">
      <v-autocomplete
        v-model="filterOrder.destinationPortId"
        :items="filterData.ports.data"
        :search-input.sync="search.destinationPortId"
        clearable
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
          <div v-if="$fetchState.pending" class="d-flex justify-center">
            <v-progress-circular indeterminate color="primary" />
          </div>

          <div v-else v-intersect="portIntersect" />
        </template>
      </v-autocomplete>
    </v-col>

    <!-- service type -->
    <v-col cols="12" md="3" class="px-2 py-4">
      <v-autocomplete
        v-model="filterOrder.serviceType"
        :items="filterData.serviceTypes"
        :search-input.sync="search.serviceType"
        clearable
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
      >
        <template #append-item>
          <div v-if="$fetchState.pending" class="d-flex justify-center">
            <v-progress-circular indeterminate color="primary" />
          </div>
        </template>
      </v-autocomplete>
    </v-col>

    <!-- statuses -->
    <v-col cols="12" md="3" class="px-2 py-4">
      <v-autocomplete
        v-model="filterOrder.status"
        :items="filterData.statuses"
        :search-input.sync="search.statuses"
        clearable
        outlined
        rounded
        dense
        single-line
        hide-details
        item-text="Remarks"
        item-value="Status"
        background-color="white"
        label="Status"
        placeholder="Enter your status..."
        class="input-filter elevation-1"
      >
        <template #append-item>
          <div v-if="$fetchState.pending" class="d-flex justify-center">
            <v-progress-circular indeterminate color="primary" />
          </div>
        </template>
      </v-autocomplete>
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
import {
  CountryCode,
  VuexModuleFilters,
  Ports,
  Statuses,
  ServiceType,
} from '~/types/filters'
import { FilterOrders } from '~/types/orders'

interface FilterData {
  serviceTypes: {
    text: string
    value: string
  }[]
  country: CountryCode[]
  statuses: Statuses[] | { header: string }[]
  ports: Ports
}

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
      originCountry: null,
      destinationCountry: null,
      serviceType: null,
      originPortId: null,
      destinationPortId: null,
      statuses: null,
    })
    const filterData = ref({
      serviceTypes: [],
      country: [],
      statuses: [],
      ports: {} as Ports,
    }) as Ref<FilterData>

    // manage ports
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
        portsMeta.value.itemsPerPage >= filterData.value.ports.totalCount
      ) {
        return
      }

      portsMeta.value = {
        page: 1,
        itemsPerPage: portsMeta.value.itemsPerPage + 10,
      }

      await getPorts(portsMeta.value)
    }

    // manage service types
    const formatServiceTypes = () => {
      const serviceTypes = app.$customUtils.sortServiceTypes([
        ...storeFilter.state.filters.serviceTypes,
      ]) as ServiceType[]

      return serviceTypes.map((type) => ({
        text: app.$customUtils.setServiceType(type.name),
        value: type.name,
      }))
    }

    // manage statuses
    const formatStatuses = () => {
      const status = [...storeFilter.state.filters.statuses].sort(
        (itemA, itemB) => {
          const nameA = (itemA.ServiceType as string).toUpperCase()
          const nameB = (itemB.ServiceType as string).toUpperCase()

          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }

          return 0
        }
      ) as Statuses[]
      const formattedStatus = [
        ...status.filter((item) => item.ServiceType === 'FIRST_MILE'),
        ...status.filter(
          (item) =>
            item.ServiceType !== 'FIRST_MILE' &&
            item.ServiceType !== 'LAST_MILE'
        ),
        ...status.filter((item) => item.ServiceType === 'LAST_MILE'),
      ]

      let currentType = ''
      formattedStatus.forEach((item, index) => {
        const serviceType = app.$customUtils.setServiceType(item.ServiceType)

        if (currentType === serviceType) return

        currentType = serviceType
        formattedStatus.splice(index, 0, { header: serviceType } as any)
      })

      return formattedStatus
    }

    useFetch(async () => {
      await storeFilter.dispatch('filters/getServiceTypes')
      await storeFilter.dispatch('filters/getCountryCodes', {
        params: { isActive: true },
      })
      await getPorts(portsMeta.value)
      await storeFilter.dispatch('filters/getStatuses')

      filterData.value = {
        // format service types
        serviceTypes: formatServiceTypes(),
        country: [...storeFilter.state.filters.countryCodes],
        // format statuses
        statuses: formatStatuses(),
        ports: { ...storeFilter.state.filters.ports },
      }
    })

    return {
      filterOrder,
      // manage date for filter by created from and to
      menu,
      date,
      // manage filter
      search,
      filterData,
      // manage ports
      portIntersect,
    }
  },
})
</script>
