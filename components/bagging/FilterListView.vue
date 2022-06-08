<template>
  <v-row align="center" class="ma-0" no-gutters>
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
            @click:clear="filterBagging.createdFrom = null"
          />
        </template>

        <v-date-picker
          v-model="filterBagging.createdFrom"
          :max="filterBagging.createdTo"
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
            @click:clear="filterBagging.createdTo = null"
          />
        </template>

        <v-date-picker
          v-model="filterBagging.createdTo"
          :min="filterBagging.createdFrom"
          show-adjacent-months
          @input="menu.createdTo = false"
        />
      </v-menu>
    </v-col>


    <!-- origin country -->
    <v-col cols="12" md="3" class="px-2 py-4">
      <v-autocomplete
        v-model="filterBagging.client"
        :items="[]"
        :search-input.sync="search.client"
        clearable
        outlined
        rounded
        dense
        single-line
        hide-details
        item-text="name"
        item-value="value"
        background-color="white"
        label="Client"
        placeholder="Enter your Client..."
        class="input-filter elevation-1"
      >
        <template #append-item>
          <div v-if="$fetchState.pending" class="d-flex justify-center">
            <v-progress-circular indeterminate color="primary" />
          </div>
        </template>
      </v-autocomplete>
    </v-col>
    <!-- batch id -->
    <v-col cols="12" md="3" class="px-2 py-4">
      <v-text-field
        v-model="filterBagging.destination"
        clearable
        outlined
        dense
        rounded
        single-line
        hide-details
        label="Destination"
        placeholder="Enter your destination..."
        background-color="white"
        type="search"
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
import { FilterBagging, VuexModuleDetailBagging } from '~/types/bagging/bagging'

export default defineComponent({
  props: {
    value: {
      type: Object as PropType<FilterBagging>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { app, $dateFns } = useContext()

    const storeFilter = useStore<VuexModuleDetailBagging>()
    const filterBagging = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })

    // manage date for filter by created from and to
    const menu = ref({
      createdFrom: false,
      createdTo: false,
    })
    const date = computed(() => ({
      createdFrom: filterBagging.value.createdFrom
        ? $dateFns.format(
            $dateFns.parseISO(filterBagging.value.createdFrom),
            'MMMM do yyyy'
          )
        : '',
      createdTo: filterBagging.value.createdTo
        ? $dateFns.format(
            $dateFns.parseISO(filterBagging.value.createdTo),
            'MMMM do yyyy'
          )
        : '',
    }))

    // manage filter
    const search = ref({
      createdFrom: null,
      createdTo: null,
      client: null,
      destination: null
    })

      const { $fetchState, fetch } = useFetch(async () => {
    })

    return {
      filterBagging,
      // manage date for filter by created from and to
      menu,
      date,
      // manage filter
      search,
    }
  },
})
</script>
