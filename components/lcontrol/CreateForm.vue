<template>
  <div>
    <v-dialog v-model="dialogComp" persistent max-width="600">
      <v-card v-if="!isRule" class="rounded-xl pa-6 create-form-wrapper">
        <LcontrolDropdownCustom
          v-model="selectedRuleGroup.country"
          :label="'Country'"
          :placeholder="'Country'"
          :data="countryCodes"
          :item-show="{ text: 'name', value: 'value' }"
          class="pb-3"
        />
        <LcontrolDropdownCustom
          v-model="selectedRuleGroup.service"
          :label="'Service Type'"
          :placeholder="'Service Type'"
          :data="serviceTypes"
          :item-show="{ text: 'name', value: 'name' }"
          class="pb-3"
        />
        <LcontrolDropdownCustom
          v-if="!selectedRuleGroup.useBOB"
          v-model="selectedRuleGroup.defaultPartner"
          :label="'Default Partner'"
          :placeholder="'Default Partner'"
          :data="marketplaces"
          :item-show="{ text: 'name', value: 'id' }"
          class="pb-3"
        />
        <div>
          <v-switch v-model="selectedRuleGroup.useBOB" inset>
            <template #label>
              <span
                :style="`color: ${
                  selectedRuleGroup.useBOB ? '#1961e4' : 'black'
                }; font-weight: 500`"
              >
                BOB {{ selectedRuleGroup.useBOB ? 'Activated' : 'Inactive' }}
              </span>
            </template>
          </v-switch>
          <div style="font-size: 14px; width: 50%; text-align: justify">
            BOB will help you select the most suitable network partner based on
            our analytical data
          </div>
        </div>
        <v-card-actions>
          <v-row v-if="error" class="error-text-span">
            <v-col cols="2" class="px-0"> Failed: </v-col>
            <v-col class="pl-0">
              {{ error }}
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="toggle()"> Cancel </v-btn>
          <v-btn
            color="blue darken-1 white--text"
            :disabled="disabledBtn('ruleGroup')"
            @click="addRuleGroup()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else class="rounded-xl pa-6">
        <LcontrolDropdownCustom
          v-model="selectedRule.zone"
          :label="'Zone'"
          :placeholder="'Zone'"
          :data="zones"
          :item-show="{ text: 'zoneName', value: 'id' }"
          class="pb-3"
        />
        <LcontrolDropdownCustom
          v-model="selectedRule.partnerID"
          :label="'Partner'"
          :placeholder="'Partner'"
          :data="marketplaces"
          :item-show="{ text: 'name', value: 'id' }"
          class="pb-3"
        />
        <LcontrolDropdownCustom
          v-model="selectedRule.priority"
          :label="'Priority'"
          :placeholder="'Priority'"
          :data="priorities"
          :item-show="{ text: 'name', value: 'value' }"
          class="pb-3"
        />
        <v-row class="justify-end">
          <v-btn
            color="blue darken-1 white--text"
            class="mt-5 mr-4"
            :disabled="true"
            @click="addRuleBtn(ruleAdd.length + 1)"
          >
            + Add Rule
          </v-btn>
        </v-row>
        <v-row v-for="(x, i) in ruleAdd" :key="i" class="mt-0">
          <v-col v-if="x.id === i + 1" cols="4">
            <LcontrolDropdownCustom
              v-model="x[`type`]"
              :label="'Type'"
              :placeholder="'Type'"
              :data="ruleType"
              :item-show="{ text: 'name', value: 'value' }"
            />
          </v-col>
          <v-col v-if="x.id === i + 1 && x[`type`]">
            <LcontrolDropdownCustom
              v-model="x[`value`]"
              :label="'Value'"
              :placeholder="'Value'"
              :data="dataOptByType(x[`type`])"
              :item-show="itemShowByType(x[`type`])"
            />
          </v-col>
        </v-row>
        <v-card-actions class="mt-4">
          <v-row v-if="error" class="error-text-span">
            <v-col cols="2" class="px-0"> Failed: </v-col>
            <v-col class="pl-0">
              {{ error }}
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="toggle()"> Cancel </v-btn>
          <v-btn
            color="blue darken-1 white--text"
            :disabled="disabledBtn('rule') || disabledBtn('plusRule')"
            @click="addRules()"
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
  Ref,
} from '@nuxtjs/composition-api'
// Interfaces or types
// import { PropType } from 'vue'
import { VuexModuleFilters } from '~/types/filters'
import {
  // Marketplace,
  VuexModuleMarketplaces,
  // FilterDetails,
  // PartnerServiceZone,
} from '~/types/marketplace/marketplace'
import { Definition } from '~/types/lControl/lControl'

export default defineComponent({
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    isRule: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    error: {
      type: String,
      default: '',
    },
    countryCode: {
      type: String,
      default: '',
    },
    service: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    // store manage
    const storeMarketplaces = useStore<VuexModuleMarketplaces>()
    const storeFilters = useStore<VuexModuleFilters>()
    const serviceTypes = ref([...storeFilters.state.filters.serviceTypes])
    const zones = computed(() => storeFilters.state.filters.zones)
    const countryCodes = computed(() => storeFilters.state.filters.countryCodes)
    const marketplaces = computed(
      () => storeMarketplaces.state.marketplaces.marketplaces.marketplaces
    )
    const ruleAdd = ref([]) as Ref<Definition[]>

    const ruleType = computed(() => [
      {
        name: 'Zone',
        value: 'RULE_TYPE_ZONE',
      },
    ])

    const priorities = computed(() => [
      {
        name: 'Primary',
        value: 1,
      },
      {
        name: 'Secondary',
        value: 2,
      },
      {
        name: 'Tertiary',
        value: 3,
      },
    ])

    const selectedRuleGroup = reactive({
      country: '',
      service: '',
      defaultPartner: '',
      useBOB: false,
    })
    const selectedRule = reactive({
      priority: '',
      partnerID: '',
      definitions: '',
      zone: '',
    })

    const dialogComp = computed({
      get: () => props.dialog,
      set: (value: boolean) => emit('input', value),
    })
    const isAddRule = reactive({
      status: false,
    })
    const toggle = () => {
      emit('toggle')
    }
    const addRuleBtn = (id: number) => {
      const data: Definition = {
        [`type`]: '',
        [`value`]: '',
        id,
      }
      ruleAdd.value = [...ruleAdd.value, data]
    }

    watch(
      ruleAdd,
      (newRuleAdd) => {
        if (newRuleAdd) {
          // alert(JSON.stringify(newRuleAdd))
        }
      },
      { deep: true }
    )
    const addRuleGroup = () => {
      emit('addRuleGroup', {
        defaultPartnerID: selectedRuleGroup.defaultPartner,
        serviceType: selectedRuleGroup.service,
        countryCode: selectedRuleGroup.country,
        useBOB: selectedRuleGroup.useBOB,
      })
    }
    const addRules = () => {
      const data = {
        type: 'RULE_TYPE_ZONE',
        value: selectedRule.zone,
      }
      emit('addRules', {
        partnerID: selectedRule.partnerID,
        priority: selectedRule.priority,
        definitions: [data, ...ruleAdd.value],
        // definitions: ruleAdd.value && ruleAdd.value.length > 0 ? ruleAdd.value : null
      })
    }
    const actionAddRule = () => {
      isAddRule.status = !isAddRule.status
    }

    const dataOptByType = (name: string) => {
      switch (name) {
        case 'RULE_TYPE_ZONE':
          return zones.value

        default:
          return zones.value
      }
    }

    const itemShowByType = (name: string) => {
      switch (name) {
        case 'RULE_TYPE_ZONE':
          return { text: 'zoneName', value: 'zoneName' }

        default:
          return { text: 'zoneName', value: 'zoneName' }
      }
    }
    const fetchCountryCodes = async () => {
      try {
        $fetchState.pending = true

        await storeFilters.dispatch('filters/getCountryCodes', { params: {} })
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const fetchZones = async () => {
      try {
        $fetchState.pending = true
        const params = {
          country: props.countryCode,
        }
        await storeFilters.dispatch('filters/getZones', { params })
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

    const fetchMarketplace = async (params: {
      country?: string
      service?: string
      zone?: string
      isLControl?: Boolean
    }) => {
      const dataParams = {
        page: 1,
        perPage: 100,
        country: params.country,
        service: params.service ? [params.service] : [],
        zone: params.zone,
        // country: '',
        // service: [],
        // zone: 'f56daeb2-7784-4a01-9000-1c0584ab730b'
      }

      // console.log({dataParams})

      try {
        $fetchState.pending = true

        await storeFilters.dispatch(
          'marketplaces/marketplaces/getMarketplaces',
          { params: dataParams, isLControl: params.isLControl }
        )
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }

    const { $fetchState, fetch } = useFetch(async () => {
      await fetchZones()
      await fetchCountryCodes()
      await fetchServices()
      // await fetchMarketplace(
      //   selectedRuleGroup.country,
      //   selectedRuleGroup.service,
      // )
      await fetchMarketplace({
        isLControl: true,
      })
      // zones.value =  [ ...storeFilters.state.filters.zones]
      serviceTypes.value = [...storeFilters.state.filters.serviceTypes]
    })

    const disabledBtn = (name: string) => {
      if (name === 'rule') {
        if (
          !selectedRule.zone ||
          !selectedRule.partnerID ||
          !selectedRule.priority
        ) {
          return true
        } else {
          return false
        }
      } else if (name === 'plusRule') {
        return false
        // if(
        //   !selectedRule.partnerID ||
        //   !selectedRule.priority ||
        //   (ruleAdd.value.filter(x => (Object.values(x)).filter(o => !o)).length > 0)
        // ) {
        //   console.log(ruleAdd.value.filter(x => (Object.values(x)).filter(o => !o)))
        //   return true
        // } else {
        //   return false
        // }
      } else if (name === 'ruleGroup') {
        if (
          !selectedRuleGroup.useBOB &&
          (!selectedRuleGroup.country ||
            !selectedRuleGroup.service ||
            !selectedRuleGroup.defaultPartner)
        ) {
          return true
        } else if (
          selectedRuleGroup.useBOB &&
          (!selectedRuleGroup.country || !selectedRuleGroup.service)
        ) {
          return true
        } else {
          return false
        }
      }
    }

    watch(
      dialogComp,
      (newDialogComp) => {
        if (newDialogComp) {
          if (!props.isRule) {
            fetch()
            selectedRuleGroup.country = ''
            selectedRuleGroup.service = ''
            selectedRuleGroup.defaultPartner = ''
            selectedRuleGroup.useBOB = false
          }

          if (props.isRule) {
            selectedRule.partnerID = ''
            selectedRule.priority = ''
            selectedRule.zone = ''
            ruleAdd.value = []
            fetchZones()
          }
        } else if (!newDialogComp) {
          if (!props.isRule) {
            fetchMarketplace({
              isLControl: true,
            })
          }
        }
      },
      { deep: true }
    )
    // watch(
    //   [() => (selectedRuleGroup.service), () => (selectedRuleGroup.country)],
    //   ([newSelectedService, newSelectedCountry]) => {
    //     fetchMarketplace(newSelectedCountry, newSelectedService)
    //     selectedRuleGroup.defaultPartner = ''
    //   },
    //   { deep: true }
    // )
    watch(
      () => [selectedRuleGroup.service, selectedRuleGroup.country],
      ([newSelectedService, newSelectedCountry]) => {
        fetchMarketplace({
          country: newSelectedCountry,
          service: newSelectedService,
        })
        selectedRuleGroup.defaultPartner = ''
      },
      { deep: true }
    )
    watch(
      () => [selectedRule.zone],
      ([newSelectedZone]) => {
        // const temp = [...zones.value].filter(
        //   (x: any) => x.id === newSelectedZone
        // )

        fetchMarketplace({
          country: props.countryCode,
          service: props.service,
          zone: newSelectedZone,
        })
        selectedRule.partnerID = ''
      },
      { deep: true }
    )
    return {
      toggle,
      dialogComp,
      isAddRule,
      actionAddRule,
      addRuleGroup,
      serviceTypes,
      zones,
      marketplaces,
      selectedRuleGroup,
      disabledBtn,
      selectedRule,
      priorities,
      addRuleBtn,
      ruleAdd,
      ruleType,
      dataOptByType,
      itemShowByType,
      addRules,
      countryCodes,
    }
  },
})
</script>
<style lang="scss">
.create-form-wrapper {
  .error-text-span {
    color: red;
    font-size: 12px;
  }
}
</style>
