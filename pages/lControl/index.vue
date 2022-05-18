<template>
  <section class="pa-4 pa-md-10 py-8 l-control">
    <v-card elevation="2">
      <div class="header">
        <div class="text">L-CONTROL</div>
      </div>
      <div class="body-wrapper border-bottom">
        <div class="country-wrapper">
          <div class="text">COUNTRY</div>
        </div>
        <div class="service-wrapper service-color">
          <div class="text">SERVICE</div>
        </div>
        <div class="zone-wrapper">
          <div class="text">
            <v-breadcrumbs :items="breadcrumbs" divider=">" class="pa-0">
              <template #item="{ item }">
                <v-breadcrumbs-item
                  :href="item.href"
                  :disabled="item.disabled"
                  :class="`${!item.first ? 'active-bread' : ''}`"
                >
                  {{ item.text.toUpperCase() }}
                </v-breadcrumbs-item>
              </template>
            </v-breadcrumbs>
            <!-- ZONE
            <span>
              <v-icon
                large
                color="black"
              >
                mdi-menu-left
              </v-icon>
              <span>
                KUALA LUMPUR
              </span>
            </span> -->
          </div>
        </div>
      </div>
      <div class="content-wrapper">
        <div class="country-wrapper-content scroller">
          <div
            v-for="(el, i) in countryCodes"
            :key="i"
            :class="`text padding-text-country ${
              selected.countryIndex && selected.countryIndex.index === i
                ? 'service-color'
                : ''
            }`"
            @click="indexSelect({ index: i, value: el.value }, 'country')"
          >
            <div
              :class="`${
                selected.countryIndex && selected.countryIndex.index === i
                  ? 'red-color'
                  : ''
              }`"
            >
              {{ el.name }}
            </div>
            <div class="text-sub">Manually Updated</div>
          </div>
        </div>
        <div
          class="service-wrapper-content service-color scroller blue-scroller"
        >
          <div
            v-for="(el, i) in serviceTypes"
            :key="i"
            :class="`text ${
              selected.serviceIndex && selected.serviceIndex.index === i
                ? 'red-color'
                : ''
            } ${selected.useBOB ? 'disabled' : ''}`"
            :style="`${
              selected.countryIndex === null ? 'visibility: hidden;' : ''
            }line-height: 36px`"
            @click="indexSelect({ index: i, value: el.name }, 'service')"
          >
            {{ $customUtils.setServiceType(el.name) }}
          </div>
          <div v-if="selected.countryIndex !== null">
            <v-switch
              v-model="selected.useBOB"
              inset
              color="#FF3D17"
              :style="`${
                selected.countryIndex === null ? 'visibility: hidden;' : ''
              }`"
              class="ma-0"
              @change="handleBob"
            >
              <template #label>
                <span
                  :style="`color: ${
                    selected.useBOB ? '#FF3D17' : '#1961E4'
                  }; font-weight: 500;white-space: nowrap`"
                >
                  BOB {{ selected.useBOB ? 'Activated' : 'Inactive' }}
                </span>
                <NuxtImg
                  src="/images/qMark.svg"
                  preload
                  :height="18"
                  class="ml-2"
                />
              </template>
            </v-switch>
            <v-card class="pa-4" elevation="3" style="height: 100%">
              <div class="d-flex align-center mb-3">
                <NuxtImg
                  src="/images/qMark.svg"
                  preload
                  :height="18"
                  class="mr-1"
                />
                <span
                  style="color: #ff3d17; font-size: 13px; line-height: 16px"
                >
                  What is BOB?
                </span>
              </div>
              <div style="color: #1961e4; font-size: 14px; line-height: 17px">
                BOB will help you select the most suitable network partner based
                on our analytical data
              </div>
            </v-card>
          </div>
        </div>
        <div
          :class="`zone-wrapper-content ${
            selected.useBOB ? 'd-flex align-center justify-center' : ''
          } scroller`"
        >
          <div
            v-if="selected.zoneIndex === null && !selected.useBOB"
            :class="`zone-text`"
          >
            <div
              v-for="(el, i) in zonesCust"
              :key="i"
              :class="`text`"
              :style="`${
                selected.serviceIndex === null ? 'visibility: hidden;' : ''
              }`"
            >
              <div :class="`d-flex align-center justify-space-between`">
                <div style="max-width: 50%">
                  {{ isCustoms() ? el.name : el.zoneName }}
                </div>
                <div>
                  <span
                    v-if="true"
                    style="font-size: 15px; line-height: 18px; color: #575757"
                  >
                    {{ !el.partnerID ? 'Waiting for Setup' : el.partnerName }}
                  </span>
                  <v-btn
                    color="primary darken-1 white--text ml-6"
                    @click="
                      indexSelect(
                        {
                          index: i,
                          value: el.id,
                          name: isCustoms() ? el.name : el.zoneName,
                          data: el,
                        },
                        'zone'
                      )
                    "
                  >
                    {{ !el.partnerID ? 'SETUP' : 'UPDATE' }}
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else-if="selected.useBOB"
            :class="`d-flex flex-column align-center justify-center`"
            style="width: 400px"
          >
            <!-- <div> -->
            <NuxtImg src="/images/BOB.svg" preload :width="400" class="mb-4" />
            <div style="text-align: center; font-size: 14px; line-height: 20px">
              BOB is Luwjistik’s own in-house tool that simplifies your shipping
              process by giving you a fixed end-to-end rate instead of a modular
              rate. Using our machine learning we will automatically choose the
              best freight forwarder, custom broker and last mile provider for
              needs. With BOB, you would not need to connect to different
              partners in multiple countries as we will do that on your behalf.
            </div>
            <!-- </div> -->
          </div>
          <div v-else class="content-zone-selected">
            <v-btn icon color="primary" @click="backBtnHandler()">
              <v-icon> mdi-arrow-left-thick </v-icon>
            </v-btn>
            <div class="zone-column-right">
              <div>
                <div
                  style="line-height: 36px; font-size: 18px; font-weight: 700"
                  class="mb-3"
                >
                  {{ selected.zoneIndex && selected.zoneIndex.name }}
                </div>
                <div>
                  <LcontrolDropdownCustom
                    v-model="selected.partnerID"
                    :label="`${
                      isCustoms() ? 'Port' : 'Zone'
                    } Default Network Partner`"
                    :placeholder="'Default Partner'"
                    :data="marketplaces"
                    :disabled-drop="$fetchState.pending"
                    :item-show="{ text: 'name', value: 'id' }"
                  />
                  <div
                    v-if="selected.partnerID && selected.serviceIndex.value === 'LAST_MILE' "
                    class="primary--text"
                    style="font-size: 12px;margin-top: 5px;justify-content: end;display: flex;"
                  >
                    <span
                      v-if="handleInfoCOD(selected.partnerID)"
                    >
                      Partner available for COD service
                    </span>
                    <span
                      v-else
                      class="error--text"
                    >
                      Partner not available for COD service
                    </span>
                  </div>
                  <div
                    v-if="!CODpartnerSelected.status && selected.serviceIndex.value === 'LAST_MILE'"
                    :class="`primary--text btn-COD ${ selected.partnerID ? '' : 'disabled'}`"
                    style="cursor: pointer"
                    @click="handleCOD"
                  >
                    + Add COD Default Network Partner
                  </div>
                  <div
                    v-if="CODpartnerSelected.status && selected.serviceIndex.value === 'LAST_MILE'"
                    class="d-flex mt-2"
                  >
                    <LcontrolDropdownCustom
                      v-model="CODpartnerSelected.partnerID"
                      :label="`COD Default Network Partner`"
                      :placeholder="'COD Default Partner'"
                      :data="marketplacesCOD"
                      :disabled-drop="$fetchState.pending"
                      :item-show="{ text: 'name', value: 'id' }"
                      :is-delete="true"
                      @delete="handleDeleteRule({isCOD: true})"
                    />
                  </div>
                </div>
              </div>
              <v-btn
                color="primary darken-1 white--text"
                style="align-self: end"
                :disabled="!selected.partnerID"
                :loading="$fetchState.pending"
                @click="btnAction"
              >
                SAVE CHANGES
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </v-card>
    <BaseModalConfirm
      v-model="dialog.deleteRule"
      :dialog-settings="dialogSettings"
      @doSubmit="deleteRules({idRule: CODpartnerSelected.idRule})"
    />
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useFetch,
  useStore,
  watch,
  ref,
  Ref,
  onUnmounted,
} from '@nuxtjs/composition-api'
// Interfaces or types
import { VuexModuleFilters } from '~/types/filters'
import {
  VuexModuleLControls,
  Definition,
  Rule,
  RuleGroup,
} from '~/types/lControl/lControl'
import { VuexModuleMarketplaces } from '~/types/marketplace/marketplace'
import { ModalConfirm } from '~/types/applications'

export interface RulePayload {
  data: {
    definitions: Definition[]
    partnerID: string
    priority: number
  }
  id?: string
  idRule?: string
}

export default defineComponent({
  name: 'LControl',
  layout: 'default',
  setup() {
    const storeMarketplaces = useStore<VuexModuleMarketplaces>()
    const storeFilters = useStore<VuexModuleFilters>()
    const storeLControls = useStore<VuexModuleLControls>()
    const countryCodes = computed(() => storeFilters.state.filters.countryCodes)
    const serviceTypes = computed(() => storeFilters.state.filters.serviceTypes)
    const zones = computed(() => storeFilters.state.filters.zones)
    const ports = computed(() => storeFilters.state.filters.ports?.data) as any
    const marketplacesAll = computed(
      () => storeMarketplaces.state.marketplaces.marketplaces.marketplacesAll
    )
    const marketplaces = computed(
      () => storeMarketplaces.state.marketplaces.marketplaces.marketplaces
    )
    const marketplacesCOD = computed(
      () => storeMarketplaces.state.marketplaces.marketplaces.marketplacesCOD
    )
    const lControls = computed(() => {
      return computeLControls(
        storeLControls.state.lControls.lControls.lControls
      )
    })
    const dialog = ref({
      deleteRule: false,
    })
    const dialogSettings = ref({
      loading: false,
      title: 'Are you sure you want to delete this COD?',
      content: '',
      cancelText: 'Cancel',
      submitText: 'Delete',
      submitColor: 'red white--text',
    }) as Ref<ModalConfirm>
    const lControlsCust = ref([]) as Ref<RuleGroup[] | []>
    const zonesCust = ref([]) as Ref<any>

    const CODpartnerSelected = ref({
      status: false,
      partnerID: '',
      idRule: ''
    }) as Ref<{status: boolean, partnerID: string, idRule: string | unknown}>
    const rulesComp = ref([]) as Ref<RulePayload[] | []>

    const selected = ref({
      countryIndex: null as { index: number; value: string } | null,
      serviceIndex: null as { index: number; value: string } | null,
      zoneIndex: null as { index: number; value: string; name?: string } | null,
      portIndex: null as { index: number; value: string; name?: string } | null,
      partnerID: '' as string,
      useBOB: false as boolean,
      ruleGroupID: '' as string,
      rules: [] as any,
      totalRulesPerZone: 0 as number,
      ruleID: '' as string,
      isUpdate: false as boolean,
      priority: null as number | null,
    })

    const rulesByZone = ref({}) as any

    const breadcrumbs = ref([
      {
        text: isCustoms() ? 'PORT' : 'ZONE',
        disabled: false,
        first: true,
        // href: 'breadcrumbs_dashboard',
      },
    ]) as Ref<
      { text?: string; disabled: boolean; first?: boolean; href?: string }[]
    >
    watch(
      () => [selected.value.serviceIndex],
      ([newService]) => {
        if (newService?.value === 'CUSTOMS') {
          breadcrumbs.value = [
            {
              text: 'PORT',
              disabled: false,
              first: true,
              // href: 'breadcrumbs_dashboard',
            },
          ]
        } else {
          breadcrumbs.value = [
            {
              text: 'ZONE',
              disabled: false,
              first: true,
              // href: 'breadcrumbs_dashboard',
            },
          ]
        }
      },
      { deep: true }
    )

    const fetchCountryCodes = async () => {
      try {
        $fetchState.pending = true

        await storeFilters.dispatch('filters/getCountryCodes', {
          params: { isActive: true },
        })
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
    const getPorts = async () => {
      await storeFilters.dispatch('filters/getPorts', {
        params: {
          page: 1,
          perPage: 1000,
        },
        country: selected.value.countryIndex?.value,
      })
    }
    const fetchZones = async () => {
      try {
        $fetchState.pending = true
        const params = {
          country: selected.value.countryIndex?.value,
        }
        await storeFilters.dispatch('filters/getZones', { params })
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
      isCOD?: Boolean
    }) => {
      let dataParams = {
        page: 1,
        perPage: 100,
        country: params.country,
        service: params.service ? [params.service] : [],
        zone: params.zone,
      } as {
        page?: number
        perPage?: number
        country?: string
        service?: string[]
        zone?: string
        port?: string
      }
      if (isCustoms()) {
        delete dataParams?.zone
        dataParams = {
          ...dataParams,
          port: params.zone,
        }
      }

      try {
        $fetchState.pending = true
        let routePath = 'getMarketplaces'
        if(params.isCOD) routePath = 'getMarketplacesConnected'
        await storeFilters.dispatch(
          `marketplaces/marketplaces/${routePath}`,
          { params: dataParams, isLControl: params.isLControl, isCOD: params.isCOD }
        )
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const fetchMarketplaceAll = async () => {
      try {
        $fetchState.pending = true

        await storeFilters.dispatch(
          'marketplaces/marketplaces/getMarketplacesAll'
        )
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const fetchRuleGroups = async () => {
      try {
        $fetchState.pending = true

        await storeLControls.dispatch('lControls/lControls/getLControls', {
          params: {},
        })
        if(selected.value.zoneIndex?.value) {
          selected.value.rules= parsingRulesPayload(rulesByZone.value[(selected.value.zoneIndex?.value) as string].rules)
          rulesComp.value = parsingRulesPayload(rulesByZone.value[(selected.value.zoneIndex?.value) as string].rules) as RulePayload[]
        }
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }

    const indexSelect = async (
      data: { index: number; value: string; name?: string; data?: any },
      type: string
    ) => {
      switch (type) {
        case 'country':
          selected.value.countryIndex = { index: data.index, value: data.value }
          // FETCH SERVICE if vuex is still empty
          if (serviceTypes.value?.length === 0) {
            await fetchServices()
          }
          break
        case 'service':
          selected.value.serviceIndex = { index: data.index, value: data.value }
          // FETCH ZONE BY COUNTRY
          if (selected.value.serviceIndex.value === 'CUSTOMS') {
            await getPorts()
          } else {
            await fetchZones()
          }
          break
        case 'zone':
          selected.value.zoneIndex = {
            index: data.index,
            value: data.value,
            name: data.name,
          }
          breadcrumbs.value = [
            ...breadcrumbs.value,
            {
              text: data.name,
              disabled: false,
              // href: 'breadcrumbs_link_1',
            },
          ]
          // FETCH PARTNER BY COUNTRY, SERVICE, ZONE
          await fetchMarketplace({
            country: selected.value.countryIndex?.value,
            service: selected.value.serviceIndex?.value,
            zone: selected.value.zoneIndex.value,
          })
          if (selected.value.serviceIndex?.value === 'LAST_MILE') {
            await fetchMarketplace({
              country: selected.value.countryIndex?.value,
              service: selected.value.serviceIndex?.value,
              zone: selected.value.zoneIndex.value,
              isCOD: true
            })
          }

          selected.value.partnerID = data.data.partnerID
          selected.value.ruleGroupID = data.data.ruleGroupID
          selected.value.totalRulesPerZone = data.data.totalRulesPerZone
          selected.value.rules = data.data.rules
          selected.value.ruleID = data.data.ruleID
          // selected.value.priority = data.data.priority
          selected.value.isUpdate = !!data.data.partnerID

          if(checkDefinition({data: [...selected.value.rules].map(y => y.data), type: 'RULE_TYPE_IS_COD'}))  {
            const dataCOD = checkDefinition({data: [...selected.value.rules].map(y => y.data), type: 'RULE_TYPE_IS_COD', isFilter: true}) as Rule

            CODpartnerSelected.value.partnerID = dataCOD.partnerID
            CODpartnerSelected.value.status = true
          }
          break
        default:
          break
      }
    }
    function checkDefinition({data, type, isFilter}: {data: Rule[], type: string, isFilter?: boolean}) {
      if(isFilter) {
      return [...data].filter((x: Rule) =>x.definitions && x.definitions.some(y => y.type === type))[0] ?? {}
      } else {
        return [...data].some((x: Rule) =>{

          return x.definitions && x.definitions.some(y => {

            return y.type === type
            }
          )
        })
      }
    }
    // LOGIC FETCH DATA
    watch(
      () => [
        storeLControls.state.lControls.lControls.lControls,
        selected.value.countryIndex?.value,
        selected.value.serviceIndex?.value,
        selected.value.partnerID, CODpartnerSelected.value.partnerID,
        selected.value.ruleGroupID,
        dialog.value.deleteRule,
        selected.value.rules,
        selected.value.totalRulesPerZone,
        selected.value.priority
      ],
      ([
        newLControl,
        countryValue,
        serviceValue,
        partnerDefault,
        CODpartner,
        newRGID,
        newDialogDelete,
        newRules,
        newTotalRules,
        newPriority
      ]) => {

      let rules = [...newRules] as any
      const totalRules = newTotalRules as number
      const priorityTemp = newPriority ?? 0
      const temp =
        {
          id: selected.value.ruleGroupID,
          data: {
            partnerID: selected.value.partnerID,
            priority: priorityTemp + 1,
            definitions: [
              {
                type: 'RULE_TYPE_ZONE',
                value: selected.value.zoneIndex?.value,
              },
            ],
          }
        }
      if(
        !checkDefinition({data: [...rules].map(y => y.data), type: 'RULE_TYPE_ZONE'})
      ) {
        rules = [...rules, temp]
      } else if(checkDefinition({data: [...rules].map(y => y.data), type: 'RULE_TYPE_ZONE'})) {
          const indexCOD = rules.findIndex((el: any) => el.data.definitions.some((x: any) => x.type === 'RULE_TYPE_ZONE'))
          rules[indexCOD].data.partnerID = partnerDefault
      }

      if(
        CODpartnerSelected.value.partnerID
        && !checkDefinition({data: [...rules].map(y => y.data), type: 'RULE_TYPE_IS_COD'})
      ) {
        const cod = {
          id: selected.value.ruleGroupID,
          data: {
            partnerID: CODpartnerSelected.value.partnerID,
            priority: (priorityTemp + 1),
            definitions: [
              {
                type: 'RULE_TYPE_IS_COD',
                value: selected.value.zoneIndex?.value,
              },
            ],
          }
        }
        rules = [...rules, cod]
      } else if(checkDefinition({data: [...rules].map(y => y.data), type: 'RULE_TYPE_IS_COD'})) {
          const indexCOD = rules.findIndex((el: any) => el.data.definitions.some((x: any) => x.type === 'RULE_TYPE_IS_COD'))
          rules[indexCOD].data.partnerID = CODpartner
      }

        rulesComp.value = rules
      },
      { deep: true }
    )


    const addRules = async (
      data: any
    ) => {
      try {
        const payload = data


        $fetchState.pending = true

        await storeLControls.dispatch('lControls/lControls/addRules', payload)
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const updateRules = async (
      data: any
    ) => {
      try {
        const payload = {
          id: data.idRule,
          data: {
            partnerID: data.data.partnerID ,
            priority: data.data.priority,
          },
        }

        $fetchState.pending = true

        await storeLControls.dispatch(
          'lControls/lControls/updateRules',
          payload
        )
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const addRuleGroup = async () => {
      try {
        const data = {
          defaultPartnerID: selected.value.partnerID,
          serviceType: selected.value.serviceIndex?.value,
          countryCode: selected.value.countryIndex?.value,
        }

        $fetchState.pending = true

        const res = await storeLControls.dispatch(
          'lControls/lControls/addRuleGroup',
          data
        )
        if (res) {
          selected.value.ruleGroupID = res?.id
        }
      } catch (error: any) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const updateRuleGroup = async () => {
      try {
        const data = {
          defaultPartnerID: selected.value.partnerID,
          ruleGroupID: selected.value.ruleGroupID,
        }

        $fetchState.pending = true

        await storeLControls.dispatch(
          'lControls/lControls/updateRuleGroup',
          data
        )
      } catch (error: any) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const addBOB = async () => {
      try {
        const payload = selected.value.countryIndex?.value

        $fetchState.pending = true

        await storeLControls.dispatch(`lControls/lControls/addBOB`, payload)
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const deleteBOB = async () => {
      try {
        const payload = selected.value.countryIndex?.value
        $fetchState.pending = true

        await storeLControls.dispatch('lControls/lControls/deleteBOB', payload)
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const { $fetchState } = useFetch(async () => {
      // FETCH COUNTRY
      await fetchMarketplaceAll()
      await fetchCountryCodes()
      await fetchRuleGroups()
      lControlsCust.value = [
        ...storeLControls.state.lControls.lControls.lControls,
      ]
    })


    const deleteRules = async ({idRule} : {idRule?: string}) => {
      try {
        dialogSettings.value.loading = true

        $fetchState.pending = true


        await storeLControls.dispatch('lControls/lControls/deleteRules', {
          ruleID: idRule,
        })
        await fetchRuleGroups()
        CODpartnerSelected.value.idRule = ''
        CODpartnerSelected.value.partnerID = ''
        CODpartnerSelected.value.status = false
      } catch (error) {
        return error
      } finally {
        dialogSettings.value.loading = false
        dialog.value.deleteRule = false
        $fetchState.pending = false
      }
    }
    const handleInfoCOD = (partnerID: string) => {
      return marketplacesCOD.value.some(x => x.id === partnerID)
    }

    const btnAction = async () => {
      try {
        if (selected.value.isUpdate) {
          await updateRuleGroup()
        }
        if (!selected.value.ruleGroupID) {
          await addRuleGroup()
        }

          await Promise.all(rulesComp.value.map(async (el: any) => {
            try {
              if(el.idRule && selected.value.isUpdate) {
                await updateRules(el)
              } else {
                await addRules(el)
              }
            } catch (error) {
              console.log('error'+ error);
            }
          }))


        await fetchRuleGroups()
      } catch (error) {
        return error
      }
    }

    const handleBob = async (e: boolean) => {
      try {
        if (e) {
          await addBOB()
        } else {
          await deleteBOB()
        }
        await fetchRuleGroups()
      } catch (error) {
        return error
      }
    }

    const backBtnHandler = () => {
      selected.value.zoneIndex = null
      breadcrumbs.value = [breadcrumbs.value[0]]
    }

    function computeLControls(data: RuleGroup[]) {
      return data
    }

    function findNamePartner(id: string) {
      if (marketplacesAll.value && marketplacesAll.value.length > 0) {
        return marketplacesAll.value.filter((x) => x.id === id)[0]?.name
      }
    }

    function isCustoms() {
      return selected.value.serviceIndex?.value === 'CUSTOMS'
    }

    function handleCOD () {
      CODpartnerSelected.value.status = !CODpartnerSelected.value.status
    }
    function handleDeleteRule ({isCOD}: {isCOD?: Boolean}) {
      if(
        isCOD
      ) {
        const indexCOD = selected.value.rules.findIndex((el: RulePayload) => el.data.definitions.some((x: Definition) => x.type === 'RULE_TYPE_IS_COD'))
        const idRule = selected.value.rules[indexCOD]?.idRule
        if(indexCOD === -1 || selected.value.rules.some((el: RulePayload) => !el.idRule)) {
            CODpartnerSelected.value.status = false
            CODpartnerSelected.value.partnerID = ''
          } else {
          dialog.value.deleteRule = true

        }
        CODpartnerSelected.value.idRule = idRule

      }
    }

    onUnmounted(() => {
      // DELETE SERVICE ON VUEX
    })

    watch(
      () => [selected.value.useBOB],
      ([newUseBOB]) => {
        if (newUseBOB) {
          breadcrumbs.value = [breadcrumbs.value[0]]
          selected.value.zoneIndex = null
          selected.value.serviceIndex = null
        }
      },
      { deep: true }
    )

    watch(
      () => [selected.value.countryIndex],
      ([newCountryIndex]) => {
        if (newCountryIndex !== null) {
          breadcrumbs.value = [breadcrumbs.value[0]]
          selected.value.zoneIndex = null
          selected.value.serviceIndex = null
          selected.value.useBOB = false
        }

        if (newCountryIndex) {
          const countryID = newCountryIndex.value
          if (lControls.value && lControls.value.length > 0) {
            const temp = [...lControls.value]
            let isUseBOB = false
            temp.forEach((el: RuleGroup) => {
              if (el.countryCode === countryID && el.useBOB) {
                isUseBOB = true
              }
            })
            selected.value.useBOB = isUseBOB
          }
        }
      },
      { deep: true }
    )

    watch(
      () => [selected.value.serviceIndex],
      () => {
        backBtnHandler()
      },
      { deep: true }
    )

    watch(
      () => [
        selected.value.countryIndex,
        selected.value.serviceIndex,
        selected.value.zoneIndex,
      ],
      () => {
        selected.value.partnerID = ''
        CODpartnerSelected.value.status = false
        CODpartnerSelected.value.partnerID = ''
        CODpartnerSelected.value.idRule = ''
        rulesComp.value = []
      },
      { deep: true }
    )

    function parsingRulesPayload (data: Rule[]) {
        const rules = data && [...data].map(el => {
          return {
            id: el.ruleGroupID,
            idRule: el.id ,
            data: {
              partnerID: el.partnerID,
              priority: el.priority,
              definitions: el.definitions && el.definitions.length > 0
              ? el.definitions.map(x => {
                  return {
                    type: x.type,
                    value: x.value,
                  }
                })
              : null,
            }
          }
        })
      return rules ?? []
    }

    watch(
      () => [
        selected.value.countryIndex,
        selected.value.serviceIndex,
        selected.value.zoneIndex,
        selected.value.portIndex,
        zones,
        ports,
        storeLControls.state.lControls.lControls.lControls,
      ],
      ([
        newCountryIndex,
        newServiceIndex,
        newZoneIndex,
        newPortIndex,
        newZones,
        newPorts,
        newLControl
      ]) => {
        let temp = [...lControls.value] as RuleGroup[]
        if (newCountryIndex) {
          temp = temp.filter(
            (el: RuleGroup) => el.countryCode === newCountryIndex?.value
          )
        }
        if (newServiceIndex) {
          temp = temp.filter(
            (el: RuleGroup) => el.serviceType === newServiceIndex?.value
          )
        }

        const tempNewData = isCustoms() ? newPorts : newZones

        if (tempNewData && tempNewData.value?.length > 0) {
          let computeZone = isCustoms()
            ? [...newPorts.value]
            : [...newZones.value]

          const ObjRulesByZone = {} as any
          computeZone = computeZone.map((el: any) => {
            let partnerID = '' as any
            let partnerName = '' as any
            let ruleID = '' as any
            let ruleGroupID = '' as any
            let serviceType = '' as any
            let priority = null as any
            let totalRulesPerZone = 0 as number
            // let definitions = [] as any
            let rules = [] as any
            ObjRulesByZone[el.id] = {
              rules: temp.map((d: RuleGroup) => {

                const filter = d.Rules && d.Rules.filter((x: Rule) => x.definitions.some((y: Definition) => y.value === el.id))
                return filter
              } )[0]
            }
            selected.value.priority = temp.map((d: RuleGroup) => {

                const filter = d.Rules && [...d.Rules].sort((a, b) => b.priority - a.priority)[0]
                return filter?.priority
            })[0]
            ? temp.map((d: RuleGroup) => {
                const filter = d.Rules && [...d.Rules].sort((a, b) => b.priority - a.priority)[0]
                return filter?.priority
              })[0]
            : 0
            if (temp && temp.length > 0) {
              temp.forEach((d: RuleGroup) => {
                ruleGroupID = d.id
                serviceType = d.serviceType
                if(d.Rules && d.Rules.length > 0) totalRulesPerZone = d.Rules.length
                rules = parsingRulesPayload(ObjRulesByZone[el.id].rules)


                if (ObjRulesByZone[el.id].rules && ObjRulesByZone[el.id].rules.length > 0) {
                  // selected.value.priority = Math.max(...ObjRulesByZone[el.id].rules.map((o: any) => o.priority))
                  // const highestPriority = [...ObjRulesByZone[el.id].rules].sort((a, b) => b.priority - a.priority)
                  // console.log({priority: Math.max(...ObjRulesByZone[el.id].rules.map((o: any) => o.priority)), highestPriority})
                  ObjRulesByZone[el.id].rules && ObjRulesByZone[el.id].rules.forEach((c: Rule) => {
                    if (c.definitions && c.definitions.length > 0) {
                      c.definitions.forEach((e: Definition) => {
                        if (e.value === el.id) {
                          const indexZone = ObjRulesByZone[el.id].rules.findIndex((el: Rule) => el.definitions.some((x: Definition) => x.type === 'RULE_TYPE_ZONE'))
                          partnerID = ObjRulesByZone[el.id].rules[indexZone]?.partnerID
                          partnerName = findNamePartner(partnerID)
                          priority = c.priority
                          ruleID = e.ruleID
                        }
                      })
                    }
                  })
                }
              })
            }
            return {
              ...el,
              partnerID,
              partnerName,
              ruleID,
              ruleGroupID,
              priority,
              rules,
              totalRulesPerZone,
              // definitions,
              serviceType,
            }
          })
          rulesByZone.value = ObjRulesByZone
          if (isCustoms()) {
            zonesCust.value = computeZone
          } else {
            zonesCust.value = computeZone
          }


        }
      },
      { deep: true }
    )

    watch(
      selected,
      () => {

      },
      { deep: true }
    )

    return {
      selected,
      breadcrumbs,
      countryCodes,
      serviceTypes,
      ports,
      zones,
      zonesCust,
      marketplaces,
      indexSelect,
      backBtnHandler,
      btnAction,
      handleBob,
      isCustoms,
      CODpartnerSelected,
      handleCOD,
      marketplacesCOD,
      handleInfoCOD,

      dialog,
      dialogSettings,
      deleteRules,
      handleDeleteRule
    }
  },
  head: {},
})
</script>

<style lang="scss">
@import '~/assets/scss/color.module.scss';
.l-control {
  .v-card {
    overflow: hidden;
    height: calc(100vh - 144px);
    max-height: 798px;
  }
  .header {
    padding: 33px 44px 20px 44px;
    .text {
      color: $primary;
      font-size: 25px;
      line-height: 30px;
    }
  }
  .service-color {
    background: #edf5ff !important;
  }
  .border-bottom {
    border-bottom: 1px dashed red;
  }
  .body-wrapper {
    display: flex;
    width: 100%;
    padding: 0 44px;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    /* height: 100%; */
    .text {
      font-size: 20px;
      line-height: 24px;
      font-weight: 500;
    }
    .country-wrapper,
    .service-wrapper {
      min-width: 250px;
    }
    .zone-wrapper {
      width: 100%;
      .v-breadcrumbs {
        li {
          font-size: 20px;
          line-height: 24px;
        }
        .active-bread {
          color: $primary;
        }
      }
    }
    .country-wrapper,
    .service-wrapper,
    .zone-wrapper {
      padding-top: 31px;
      padding-bottom: 23px;
      /* border-bottom: 1px dashed red; */
    }
    .zone-wrapper,
    .service-wrapper {
      padding-left: 30px;
    }
  }
  .red-color {
    color: #ff3d17;
  }
  .content-wrapper {
    display: flex;
    height: calc(100% - 162px);
    width: 100%;
    /* padding: 0 44px; */
    /* height: 100%; */
    .disabled {
      pointer-events: none;
      opacity: 0.4;
      cursor: not-allowed;
    }
    .text {
      font-size: 18px;
      line-height: 22px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        opacity: 0.8;
        background: #edf5ff73;
      }

      .text-sub {
        font-size: 15px;
        line-height: 18px;
        margin-top: 15px;
        color: #aaaaaa;
      }
    }
    .padding-text-country {
      padding: 40px 44px;
    }

    .scroller {
      &::-webkit-scrollbar {
        width: 0.2em; /* counts only for the vertical scrollbar */
        height: 0.2em; /* counts only for the horizontal scrollbar */
      }
      &::-webkit-scrollbar-thumb {
        background: #c9e1ff;
      }
      &::-webkit-scrollbar-thumb:hover {
        background: $primary;
        opacity: 0.8;
      }
    }
    .blue-scroller {
      &::-webkit-scrollbar-track {
        background: #edf5ff;
      }
    }

    .country-wrapper-content {
      min-width: calc(250px + 44px);
      overflow-y: scroll;
    }
    .service-wrapper-content {
      min-width: 250px;
      width: 250px;
      overflow-y: scroll;
    }
    .service-wrapper-content {
      & > * {
        padding: 25px 30px;
        &:first-child {
          padding-top: 50px;
        }
        &:last-child {
          margin-right: 0px;
        }
      }
    }

    .zone-wrapper-content {
      width: 100%;
      overflow-y: scroll;
      .text {
        cursor: unset;
        &:hover {
          opacity: 1;
          background: unset;
        }
      }
      .zone-text {
        & > * {
          padding: 25px 30px;
          &:first-child {
            padding-top: 50px;
          }
          &:last-child {
            margin-right: 0px;
          }
        }
      }
      .content-zone-selected {
        height: 100%;
        padding: 50px 30px;
        display: flex;
        & > * {
          &:first-child {
            margin-right: 15px;
          }
          &:last-child {
            width: 100%;
          }
        }
        .zone-column-right {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }
      }
    }
  }
  .btn-COD {
    margin-top: 10px;
    transition: all .3s;
    &:hover {
      opacity: .8;
    }
  }
  .disabled {
    &.btn-COD {
      cursor: not-allowed
    }
    opacity: .5;
    pointer-events: none;
  }
}
</style>
