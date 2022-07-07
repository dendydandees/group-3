<template>
  <v-col>
    <v-btn
      v-if="isOnListView"
      :disabled="selectedOrders.length === 0 || loading"
      outlined
      color="primary"
      class="mr-2"
      @click="$emit('doExportOrders')"
    >
      Export Orders
    </v-btn>

    <v-menu v-if="isOnListView" transition="slide-y-transition" bottom offset-y>
      <template #activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :disabled="
            selectedOrders.length === 0 || loading || !isLabelExistOnSelected
          "
          color="primary"
          class="mr-2"
          outlined
          v-on="on"
        >
          <span> Download Labels </span>

          <v-icon right> mdi-chevron-down </v-icon>
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item :ripple="{ class: `primary--text` }">
          <v-list-item-title
            class="text-capitalize text-left"
            tag="button"
            @click="$emit('doDownloadSelectedLabel')"
          >
            All
          </v-list-item-title>
        </v-list-item>

        <v-list-item
          v-for="{ id, name, value } in serviceTypes"
          :key="id"
          :ripple="{ class: `primary--text` }"
        >
          <v-list-item-title
            class="text-capitalize text-left"
            tag="button"
            @click="$emit('doDownloadSelectedLabel', value)"
          >
            {{ `Only ${name}` }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn
      :depressed="isShowFilter"
      :outlined="isShowFilter"
      :disabled="loading || (currentRoute === 'bagging' && !isOnBagsTab.filter)"
      color="primary"
      class="mr-2"
      @click="$emit('doShowFilter')"
    >
      Filter
    </v-btn>

    <span v-if="isOnListView" class="subtitle-2 text--secondary">
      {{ selectedOrders.length }} Orders selected
    </span>

    <span v-if="isOnBagsTab.text" class="subtitle-2 text--secondary">
      {{ selectedOrders.length }} {{ isUnbagged ? 'Unbagged' : 'Bag' }} selected
    </span>
  </v-col>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  useRoute,
  computed,
  useFetch,
  useStore,
  useContext,
} from '@nuxtjs/composition-api'
// types
import { ServiceType, VuexModuleFilters } from '~/types/filters'
import { Order } from '~/types/orders'

export default defineComponent({
  props: {
    isOnListView: {
      type: Boolean,
    },
    isOnBagsTab: {
      type: Object,
      default: () => ({
        text: false,
        filter: false,
      }),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    selectedOrders: {
      type: Array as PropType<Order[]>,
      required: true,
    },
    isShowFilter: {
      type: Boolean,
    },
    isLabelExistOnSelected: {
      type: Boolean,
      default: false,
    },
    isUnbagged: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { app } = useContext()
    // manage route
    const route = useRoute()
    const currentRoute = computed(() => route.value.name)
    // end

    // manage store
    const storeOfFilter = useStore<VuexModuleFilters>()
    const serviceTypes = computed(() => {
      const serviceTypesUnformatted = app.$customUtils.sortServiceTypes([
        ...storeOfFilter.state.filters.serviceTypes,
      ]) as ServiceType[]

      return serviceTypesUnformatted.map((type) => ({
        ...type,
        name: app.$customUtils.capitalize(
          app.$customUtils.setServiceType(type.name)
        ),
        value: type.name,
      }))
    })
    // end

    useFetch(async () => {
      await storeOfFilter.dispatch('filters/getServiceTypes')
    })

    return {
      // manage route
      currentRoute,
      // end
      // manage store
      serviceTypes,
      // end
    }
  },
})
</script>
