<template>
  <v-card-text class="px-6">
    <v-row>
      <v-col cols="12" md="12" class="px-2 py-4">
        <ValidationProvider
          v-slot="{ errors }"
          slim
          name="New Status"
          rules="required"
          tag="div"
        >
          <v-autocomplete
            v-model="selected.status"
            :error-messages="errors"
            :items="dataStatuses"
            :search-input.sync="search.statuses"
            clearable
            cache-items
            outlined
            rounded
            dense
            single-line
            hide-details
            item-text="Remarks"
            item-value="Status"
            background-color="white"
            label="New Status"
            placeholder="Enter your status..."
            class="input-filter elevation-1"
          />
        </ValidationProvider>
      </v-col>
    </v-row>
    <v-row>
      <!-- created from  -->
      <v-col cols="12" md="8" class="px-2 py-4">
        <v-menu
          v-model="menuUpdateDate"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template #activator="{ on, attrs }">
            <ValidationProvider
              v-slot="{ errors }"
              slim
              name="Update Date"
              rules="required"
              tag="div"
            >
              <v-text-field
                :error-messages="errors"
                :value="date.updateDate"
                v-bind="attrs"
                readonly
                clearable
                single-line
                outlined
                rounded
                dense
                hide-details
                label="Update Date"
                placeholder="Enter your update date..."
                class="input-filter elevation-1"
                v-on="on"
                @click:clear="selected.updateDate = ''"
              />
            </ValidationProvider>
          </template>

          <v-date-picker
            v-model="selected.updateDate"
            show-adjacent-months
            @input="menuUpdateDate = false"
          />
        </v-menu>
      </v-col>
      <v-col cols="12" md="4" class="px-2 py-4">
        <v-menu
          ref="menu"
          v-model="menuUpdateTime"
          :close-on-content-click="false"
          :return-value.sync="selected.updateTime"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template #activator="{ on, attrs }">
            <ValidationProvider
              v-slot="{ errors }"
              slim
              name="Time"
              rules="required"
              tag="div"
            >
              <v-text-field
                v-model="selected.updateTime"
                :error-messages="errors"
                :label="'Time'"
                readonly
                clearable
                single-line
                outlined
                rounded
                dense
                hide-details
                v-bind="attrs"
                placeholder="Enter your update time..."
                class="input-filter elevation-1"
                v-on="on"
              />
            </ValidationProvider>
          </template>
          <v-time-picker
            v-if="menuUpdateTime"
            v-model="selected.updateTime"
            full-width
            @click:minute="$refs.menu.save(selected.updateTime)"
          />
        </v-menu>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  PropType,
  useStore,
  useContext,
  ref,
  Ref,
  useFetch,
  watch,
} from '@nuxtjs/composition-api'
import { ValidationProvider } from 'vee-validate'
import { VuexModuleFilters, Statuses } from '~/types/filters'

interface StatusUpdate {
  status: string
  updateDate: string
  updateTime: string
}

export default defineComponent({
  components: {
    ValidationProvider,
  },
  props: {
    value: {
      type: Object as PropType<StatusUpdate>,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { app, $dateFns } = useContext()

    const storeFilter = useStore<VuexModuleFilters>()
    const selected = computed({
      get: (): StatusUpdate => {
        return props.value
      },
      set: (value: StatusUpdate) => {
        return emit('input', value)
      },
    })

    const menuUpdateTime = ref(false)
    const menuUpdateDate = ref(false)

    const date = computed(() => ({
      updateDate: selected.value.updateDate
        ? $dateFns.format(
            $dateFns.parseISO(selected.value.updateDate),
            'MMMM do yyyy'
          )
        : '',
    }))
    const dataStatuses = computed(() => {
      return formatStatuses()
    })

    // manage filter
    const search = ref({
      statuses: null,
    })

    // manage statuses
    function formatStatuses() {
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

      let currentType = ''
      status.forEach((item, index) => {
        const serviceType = app.$customUtils.setServiceType(item.ServiceType)

        if (currentType === serviceType) return

        currentType = serviceType
        status.splice(index, 0, { header: serviceType } as any)
      })

      return status
    }

    watch(
      () => [props.isOpen],
      ([newIsOpen]) => {
        if (newIsOpen) {
          storeFilter.dispatch('filters/getStatuses')
        } else {
          selected.value.status = ''
          selected.value.updateDate = ''
          selected.value.updateTime = ''
        }
      },
      { deep: true }
    )

    return {
      selected,
      dataStatuses,
      search,
      date,
      menuUpdateTime,
      menuUpdateDate,
    }
  },
})
</script>
