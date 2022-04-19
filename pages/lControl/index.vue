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
                    class="primary--text"
                    style="font-size: 12px;margin-top: 5px;justify-content: end;display: flex;"
                  >
                    <span
                      v-if="true"
                    >
                      Partner not available for COD service
                    </span>
                    <span
                      v-else
                    >
                      Partner available for COD service
                    </span>
                  </div>
                  <div
                    v-if="!CODpartnerSelected.status"
                    class="primary--text btn-COD"
                    style="cursor: pointer"
                    @click="handleCOD"
                  >
                    + Add COD Default Network Partner
                  </div>
                  <div
                    v-if="CODpartnerSelected.status"
                    class="d-flex mt-2"
                  >
                    <LcontrolDropdownCustom
                      v-model="CODpartnerSelected.partnerID"
                      :label="`COD Default Network Partner`"
                      :placeholder="'COD Default Partner'"
                      :data="marketplaces"
                      :disabled-drop="$fetchState.pending"
                      :item-show="{ text: 'name', value: 'id' }"
                      :is-delete="true"
                      @delete="handleCOD"
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
    const lControls = computed(() => {
      return computeLControls(
        storeLControls.state.lControls.lControls.lControls
      )
    })
    const lControlsCust = ref([]) as Ref<RuleGroup[] | []>
    const zonesCust = ref([]) as Ref<any>

    const CODpartnerSelected = ref({
      status: false,
      partnerID: ''
    })

    const selected = ref({
      countryIndex: null as { index: number; value: string } | null,
      serviceIndex: null as { index: number; value: string } | null,
      zoneIndex: null as { index: number; value: string; name?: string } | null,
      portIndex: null as { index: number; value: string; name?: string } | null,
      partnerID: '' as string,
      useBOB: false as boolean,
      ruleGroupID: '' as string,
      rules: [] as any,
      ruleID: '' as string,
      isUpdate: false as boolean,
      priority: null as number | null,
    })

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
          selected.value.partnerID = data.data.partnerID
          selected.value.ruleGroupID = data.data.ruleGroupID
          selected.value.rules = data.data.rules
          selected.value.ruleID = data.data.ruleID
          selected.value.priority = data.data.priority
          selected.value.isUpdate = !!data.data.partnerID
          break
        default:
          break
      }
    }
    const addRules = async () => {
      try {
        const payload = {
          id: selected.value.ruleGroupID,
          data: {
            partnerID: selected.value.partnerID,
            priority: selected.value.rules.length + 1,
            definitions: [
              {
                type: 'RULE_TYPE_ZONE',
                value: selected.value.zoneIndex?.value,
              },
            ],
          },
        }

        $fetchState.pending = true

        await storeLControls.dispatch('lControls/lControls/addRules', payload)
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const updateRules = async () => {
      try {
        const payload = {
          id: selected.value.ruleID,
          data: {
            partnerID: selected.value.partnerID,
            priority: selected.value.priority,
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

    const btnAction = async () => {
      try {
        // const actionRG = addRuleGroup
        let actionR = addRules
        if (selected.value.isUpdate) {
          await updateRuleGroup()
          actionR = updateRules
        }
        // alert(selected.value.ruleGroupID)
        if (!selected.value.ruleGroupID) {
          await addRuleGroup()
        }
        await actionR()
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
        // console.log(
        //   marketplacesAll.value,
        //   marketplacesAll.value.filter((x) => x.id === id)[0]?.name,
        //   id
        // )
        return marketplacesAll.value.filter((x) => x.id === id)[0]?.name
      }
    }

    function isCustoms() {
      return selected.value.serviceIndex?.value === 'CUSTOMS'
    }

    function handleCOD () {
      CODpartnerSelected.value.status = !CODpartnerSelected.value.status
      if(!CODpartnerSelected.value.status) {
        CODpartnerSelected.value.partnerID = ''
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
      },
      { deep: true }
    )

    watch(
      () => [
        selected.value.countryIndex,
        selected.value.serviceIndex,
        selected.value.zoneIndex,
        selected.value.portIndex,
        zones,
        ports,
      ],
      ([
        newCountryIndex,
        newServiceIndex,
        newZoneIndex,
        newPortIndex,
        newZones,
        newPorts,
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
        if (newZoneIndex) {
          // temp = temp.filter((d: RuleGroup) => d.Rules.every((c: Rule) => {
          //   return c.definitions.filter((e: Definition) => {
          //     console.log({e, newZoneIndex: newZoneIndex.value}, e.value === newZoneIndex?.value)
          //     return e.value === newZoneIndex?.value
          //     })
          //   })
          // )
        }
        const tempNewData = isCustoms() ? newPorts : newZones

        if (tempNewData && tempNewData.value?.length > 0) {
          let computeZone = isCustoms()
            ? [...newPorts.value]
            : [...newZones.value]
          computeZone = computeZone.map((el: any) => {
            let partnerID = '' as any
            let partnerName = '' as any
            let ruleID = '' as any
            let ruleGroupID = '' as any
            let serviceType = '' as any
            let priority = null as any
            let definitions = [] as any
            let rules = [] as any
            if (temp && temp.length > 0) {
              temp.forEach((d: RuleGroup) => {
                ruleGroupID = d.id
                serviceType = d.serviceType
                if (d.Rules && d.Rules.length > 0) {
                  rules = d.Rules
                  d.Rules.forEach((c: Rule) => {
                    definitions = [...c.definitions].filter(
                      (e: Definition) => !e.type.includes('ZONE')
                    )
                    if (c.definitions && c.definitions.length > 0) {
                      c.definitions.forEach((e: Definition) => {
                        if (e.value === el.id) {
                          partnerID = c.partnerID
                          partnerName = findNamePartner(c.partnerID)
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
              definitions,
              serviceType,
            }
          })
          if (isCustoms()) {
            zonesCust.value = computeZone
          } else {
            zonesCust.value = computeZone
          }
          console.log({computeZone, zonesCust: zonesCust.value})
        }
      },
      { deep: true }
    )

    watch(
      selected,
      () => {
        // console.log(newSelected)
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
      handleCOD
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
}
</style>
