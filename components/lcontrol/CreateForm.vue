<template>
  <div>
    <v-dialog v-model="dialogComp" persistent max-width="600">
      <v-card
        class="rounded-xl pa-6"
      >
        <LcontrolDropdownCustom
          v-model="selectedCountry.value"
          :label="'Country'"
          :placeholder="'Country'"
          :data="zones"
          :item-show="{text: 'country', value: 'country'}"
          class="pb-3"
        />
        <LcontrolDropdownCustom
          v-model="selectedService.value"
          :label="'Service Type'"
          :placeholder="'Service Type'"
          :data="serviceTypes"
          :item-show="{text: 'name', value: 'name'}"
          class="pb-3"
        />
        <LcontrolDropdownCustom
          v-model="selectedDefaultPartner.value"
          :label="'Default Partner'"
          :placeholder="'Default Partner'"
          :data="marketplaces"
          :item-show="{text: 'name', value: 'id'}"
          class="pb-3"
        />
        <!-- <LcontrolBorderHorizontal
          class="my-6"
        /> -->
        <!-- <div
          v-if="!isAddRule.status"
        >
          <div
            class="subtitle-2"
          >
            Optional*
          </div>
          <v-btn
            color="blue darken-1 white--text"
            @click="actionAddRule()"
          >
            + Add Rule
          </v-btn>
        </div>
        <div
          v-else
        >
          <div
            class="h-5 font-weight-medium"
          >
            Rule
          </div>
          <div>
            <LcontrolRulePartner
              v-for="(x, i) in arrPartner.data"
              :key="i"
              v-model="x.ruleDefinitions"
              :index="i"
            />
          </div>
          <v-btn
            v-if="arrPartner.data.length < 3"
            color="blue darken-1 white--text"
            @click="addDeleteRule('+')"
          >
            + add network partner
          </v-btn>
        </div> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="toggle()"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1 white--text"
            :disabled="disabledBtn()"
            @click="addRuleGroup()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useFetch,
  useStore,
  reactive,
  watch,
  ref,
  useMeta,
  useRouter,
} from '@nuxtjs/composition-api'
// Interfaces or types
import { PropType } from 'vue'
import { VuexModuleFilters, Zone, ServiceType} from '~/types/filters'
import { Marketplace, VuexModuleMarketplaces,FilterDetails, PartnerServiceZone } from '~/types/marketplace/marketplace'
import { RuleDefinitions,Rules,LControl } from '~/types/lcontrolOld'


export default defineComponent({
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({}),
    }
  },
  setup(props, {emit}) {
    // store manage
    const storeMarketplaces = useStore<VuexModuleMarketplaces>()
    const storeFilters= useStore<VuexModuleFilters>()
    const serviceTypes = ref([ ...storeFilters.state.filters.serviceTypes ])
    const zones = ref([...storeFilters.state.filters.zones ])
    const marketplaces = computed(() => storeMarketplaces.state.marketplaces.marketplaces.marketplaces)

    const selectedCountry = reactive ({
      value: ''
    })
    const selectedService = reactive ({
      value: ''
    })
    const selectedDefaultPartner = reactive ({
      value: ''
    })

    const arrPartner = reactive({
      data: [
        {
          "priority": 1,
          "partnerID": "partner1",
          "ruleDefinitions": []
        }
      ] as Rules[]
    })

    const dialogComp = computed({
      get: () => props.dialog,
      set: (value: boolean) => emit('input', value)
    })
    const isAddRule = reactive({
      status: false
    })
    const toggle = () => {
      emit('toggle')
    }
    const addRuleGroup = () => {
      emit('addRuleGroup', {
        defaultPartnerID: selectedDefaultPartner.value,
        serviceType: selectedService.value,
        countryCode: selectedCountry.value
      })
    }
    const actionAddRule = () => {
      isAddRule.status = !isAddRule.status
    }

    const addDeleteRule = (status: String, index: number)=> {
      switch (status) {
        case '+':
          arrPartner.data.push({
            "priority": arrPartner.data.length + 1,
            "partnerID": ``,
            "ruleDefinitions": []
          })
          break;
        case '-':
          arrPartner.data.splice(index,1);
          break;
        default:
          break;
      }
    }
    const fetchZones= async () => {
      try {
        $fetchState.pending = true

        await storeFilters.dispatch('filters/getZones')
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const fetchServices = async () => {
      try {
        $fetchState.pending = true

        await storeFilters.dispatch('filters/getServiceTypes')
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }

    const fetchMarketplace = async (country: string, service: string) => {
      const dataParams = {
        page:1,
        perPage: 100,
        country,
        service
      }

      try {
        $fetchState.pending = true

        await storeFilters.dispatch('marketplaces/marketplaces/getMarketplaces', { params: dataParams })
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }

    const { $fetchState, fetch } = useFetch(async () => {
      await fetchZones()
      await fetchServices()
      await fetchMarketplace(
        selectedCountry.value,
        selectedService.value
      )
      zones.value =  [ ...storeFilters.state.filters.zones]
      serviceTypes.value =  [ ...storeFilters.state.filters.serviceTypes]
    })

    const disabledBtn = () => {
      if(
        !selectedCountry.value ||
        !selectedService.value ||
        !selectedDefaultPartner.value
      ) {
        return true
      } else {
        return false
      }
    }

    watch(
      dialogComp,
      (newDialogComp) => {
        if(newDialogComp) {
          fetch()
          selectedCountry.value = ''
          selectedService.value = ''
          selectedDefaultPartner.value = ''
        }
      },
      { deep: true }
    )
    watch(
      [selectedService, selectedCountry],
      ([newSelectedService, newSelectedCountry]) => {
        fetchMarketplace(newSelectedCountry.value, newSelectedService.value)
        selectedDefaultPartner.value = ''
      },
      { deep: true }
    )
    return {
      toggle,
      dialogComp,
      isAddRule,
      actionAddRule,
      arrPartner,
      addDeleteRule,
      addRuleGroup,
      serviceTypes,
      zones,
      marketplaces,
      selectedCountry,
      selectedService,
      selectedDefaultPartner,
      disabledBtn
    }
  },
})
</script>
