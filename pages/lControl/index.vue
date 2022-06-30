<template>
  <section class="pa-4 pa-md-10 py-8 l-control">
    <v-card elevation="2">
      <div class="header">
        <div class="text">L-CONTROL</div>
      </div>

      <Heading :breadcrumbs="breadcrumbs" />

      <div class="content-wrapper">
        <CountriesWrapper
          :user-selected="userSelected"
          :loading="$fetchState.pending"
          @handleCountrySelection="handleSelections.country"
        />

        <ServicesWrapper
          v-model="userSelected"
          :loading="$fetchState.pending"
          @handleServiceSelections="handleSelections.service"
          @handleBob="handleBob"
        />

        <ZoneWrapper
          :user-selected="userSelected"
          :loading="$fetchState.pending"
          :is-on-service-type="isOnServiceType"
          :ports-meta="portsMeta"
          :show-ports-or-zones="showPortsOrZones"
          @getPorts="getPorts(portsMeta)"
          @changePortsMeta="portsMeta = value"
          @handleZoneSelection="handleSelections.zone"
        >
          <template #form>
            <div class="content-zone-selected">
              <v-btn
                :disabled="$fetchState.pending"
                icon
                color="primary"
                @click="handleBackToZoneSelection"
              >
                <v-icon> mdi-arrow-left-thick </v-icon>
              </v-btn>

              <div class="zone-column-right">
                <div>
                  <div
                    style="line-height: 36px; font-size: 18px; font-weight: 700"
                    class="mb-3"
                  >
                    {{
                      isOnServiceType.customs
                        ? userSelected.port.name
                        : userSelected.zone.zoneName
                    }}
                  </div>

                  <BaseLoadingLinear
                    v-if="$fetchState.pending"
                    :title="'Getting form data...'"
                    class="mt-6"
                  />

                  <div v-else>
                    <!-- handle default -->
                    <DefaultPartnerForm
                      v-model="userSelected"
                      :is-on-service-type="isOnServiceType"
                      :loading="$fetchState.pending"
                    />
                    <!-- end handle default -->

                    <!-- handle cod -->
                    <CODPartnerForm
                      v-model="userSelected"
                      :loading="$fetchState.pending"
                      :is-on-service-type="isOnServiceType"
                      @handleDeleteCOD="handleDeleteForm('cod')"
                    />
                    <!-- end handle cod -->

                    <!-- handle primary, secondary, tertiary network partner -->
                    <OtherPartnerForm
                      v-model="userSelected"
                      :is-on-service-type="isOnServiceType"
                      :loading="$fetchState.pending"
                      @handleDeleteNetworkPartner="handleDeleteForm"
                    />
                    <!-- end handle primary, secondary, tertiary network partner -->
                  </div>
                </div>

                <v-btn
                  color="primary"
                  style="align-self: end"
                  :disabled="isSaveButtonDisabled"
                  @click="handleSubmit"
                >
                  SAVE CHANGES
                </v-btn>
              </div>
            </div>
          </template>
        </ZoneWrapper>
      </div>
    </v-card>

    <BaseModalConfirm
      v-model="dialog.isOpen"
      :dialog-settings="dialogSettings"
      @doSubmit="handleDeleteModal"
    />

    <v-snackbar
      :value="alert.isShow"
      rounded="pill"
      right
      bottom
      :color="alert.type"
    >
      {{ alert.message }}
    </v-snackbar>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useFetch,
  useStore,
  ref,
  Ref,
  onUnmounted,
  ComputedRef,
} from '@nuxtjs/composition-api'
// components
import Heading from '@/components/lcontrol/Heading.vue'
import CountriesWrapper from '@/components/lcontrol/CountriesWrapper.vue'
import ServicesWrapper from '@/components/lcontrol/ServicesWrapper.vue'
import ZoneWrapper from '@/components/lcontrol/ZoneWrapper.vue'
import DefaultPartnerForm from '@/components/lcontrol/DefaultPartnerForm.vue'
import CODPartnerForm from '@/components/lcontrol/CODPartnerForm.vue'
import OtherPartnerForm from '@/components/lcontrol/OtherPartnerForm.vue'
// types
import {
  CountryCode,
  PortData,
  ServiceType,
  VuexModuleFilters,
  ZoneData,
} from '~/types/filters'
import {
  UserSelectedLControl,
  VuexModuleLControls,
} from '~/types/lControl/lControl'
import {
  ModalConfirm,
  Pagination,
  VuexModuleApplications,
} from '~/types/applications'

export interface IsOnServiceType {
  customs: boolean
  lastMile: boolean
}

export default defineComponent({
  name: 'LControl',
  components: {
    Heading,
    CountriesWrapper,
    ServicesWrapper,
    ZoneWrapper,
    DefaultPartnerForm,
    CODPartnerForm,
    OtherPartnerForm,
  },
  layout: 'default',
  setup() {
    // manage store
    const storeOfApplications = useStore<VuexModuleApplications>()
    const storeOfLControls = useStore<VuexModuleLControls>()
    const storeFilters = useStore<VuexModuleFilters>()
    const lControlList = computed(
      () => storeOfLControls.state.lControls.lControls
    )
    const zones = computed(
      () => storeFilters.state.filters.zones
    ) as unknown as ComputedRef<ZoneData[]>
    const ports = computed(
      () => storeFilters.state.filters.ports?.data
    ) as ComputedRef<PortData[]>
    const alert = computed(() => storeOfApplications.state.applications.alert)

    const stateStore = { lControlList, zones, alert, ports }
    // end manage store

    const userSelected = ref({
      useBOB: false,
      country: {},
      serviceType: {},
      zone: {},
      port: {},
      defaultPartner: {
        partnerID: '',
      },
      codPartner: {
        partnerID: '',
      },
      primary: {
        partnerID: '',
        volume: 0,
      },
      secondary: {
        partnerID: '',
        volume: 0,
      },
      tertiary: {
        partnerID: '',
        volume: 0,
      },
    }) as Ref<UserSelectedLControl>
    const resetUserSelected = {
      serviceType: () => (userSelected.value.serviceType = {} as ServiceType),
      zone: () => (userSelected.value.zone = {} as ZoneData),
      port: () => (userSelected.value.port = {} as PortData),
      form: () =>
        (userSelected.value = {
          ...userSelected.value,
          defaultPartner: {
            partnerID: '',
          },
          codPartner: {
            partnerID: '',
          },
          primary: {
            partnerID: '',
            volume: 0,
          },
          secondary: {
            partnerID: '',
            volume: 0,
          },
          tertiary: {
            partnerID: '',
            volume: 0,
          },
        }),
      cod: () =>
        (userSelected.value = {
          ...userSelected.value,
          codPartner: {
            partnerID: '',
          },
        }),
      networkPartner: (index: number) => {
        if (index === -1) return

        if (index === 0) {
          userSelected.value = {
            ...userSelected.value,
            primary: {
              partnerID: '',
              volume: 0,
            },
          }
        } else if (index === 1) {
          userSelected.value = {
            ...userSelected.value,
            secondary: {
              partnerID: '',
              volume: 0,
            },
          }
        } else if (index === 2) {
          userSelected.value = {
            ...userSelected.value,
            tertiary: {
              partnerID: '',
              volume: 0,
            },
          }
        }
      },
    }
    const showPortsOrZones = ref([]) as unknown as Ref<ZoneData[] | PortData[]>
    // checking state for user selection service type
    const isOnServiceType = computed(() => ({
      customs: userSelected.value.serviceType.name === 'CUSTOMS',
      lastMile: userSelected.value.serviceType.name === 'LAST_MILE',
    })) as ComputedRef<IsOnServiceType>
    const isSaveButtonDisabled = computed(
      () => $fetchState.pending || !userSelected.value.defaultPartner.partnerID
    )

    // handle breadcrumbs
    const breadcrumbs = ref([
      {
        text: isOnServiceType.value.customs ? 'PORT' : 'ZONE',
        disabled: false,
        first: true,
      },
    ]) as Ref<
      { text?: string; disabled: boolean; first?: boolean; href?: string }[]
    >
    const resetBreadcrumbs = () =>
      (breadcrumbs.value = [
        {
          text: isOnServiceType.value.customs ? 'PORT' : 'ZONE',
          disabled: false,
          first: true,
        },
      ])
    // end handle breadcrumbs

    // manage modal
    const dialog = ref({
      isOpen: false,
      deleteOn: '',
      indexNetworkPartner: -1,
    })
    const dialogSettings = ref({
      loading: false,
      title: 'Are you sure to delete this ?',
      content: 'The data will be deleted permanently!',
      cancelText: 'Cancel',
      submitText: 'Delete',
      submitColor: 'secondary white--text',
    }) as Ref<ModalConfirm>
    const stateModal = { dialog, dialogSettings }
    // end manage modal

    const handleSelections = {
      // function for handle user country selection
      country: async ({ data }: { data: CountryCode }) => {
        // set country data based on user selected and reset service type, port, zone and form
        userSelected.value.country = data
        resetUserSelected.serviceType()
        resetUserSelected.zone()
        resetUserSelected.port()
        resetUserSelected.form()

        try {
          $fetchState.pending = true

          // fetch service type and lcontrol data
          await fetchServices()
          await getLControl({
            country: data.value,
            serviceType: 'LAST_MILE',
          })
        } catch (error) {
          return error
        } finally {
          setTimeout(() => {
            $fetchState.pending = false
          }, 1500)
        }
      },
      // function for handle user service selection
      service: async ({ data }: { data: ServiceType }) => {
        // set service type data based on user selected and reset zone, port, and form
        userSelected.value.serviceType = data
        resetBreadcrumbs()
        resetUserSelected.zone()
        resetUserSelected.port()
        resetUserSelected.form()

        try {
          $fetchState.pending = true

          // for customs will fetch ports, else will fetch zones
          if (data.name === 'CUSTOMS') {
            portsMeta.value = {
              page: 1,
              itemsPerPage: 10,
            }
            await getPorts(portsMeta.value)
            showPortsOrZones.value = ports.value
          } else {
            await fetchZones()
            showPortsOrZones.value = zones.value
          }

          // fetch partners connected and lcontrol data
          await fetchMarketplace({
            country: userSelected.value.country.value,
            service: userSelected.value.serviceType.name,
            isConnected: true,
          })
          await getLControl({
            country: userSelected.value.country.value,
            serviceType: data.name,
          })
        } catch (error) {
          return error
        } finally {
          setTimeout(() => {
            $fetchState.pending = false
          }, 1500)
        }
      },
      // function for handle user zone selection
      zone: async ({ data }: { data: ZoneData | PortData }) => {
        breadcrumbs.value = [
          ...breadcrumbs.value,
          {
            text: isOnServiceType.value.customs
              ? (data as PortData).name
              : (data as ZoneData).zoneName,
            disabled: false,
          },
        ]

        // for customs will set to port dara, else will set zone data
        if (isOnServiceType.value.customs) {
          userSelected.value.port = data as PortData
        } else {
          userSelected.value.zone = data as ZoneData
        }

        try {
          $fetchState.pending = true

          // fetch partners connected
          await fetchMarketplace({
            country: userSelected.value.country.value,
            service: userSelected.value.serviceType.name,
            zone: isOnServiceType.value.lastMile
              ? userSelected.value.zone.id
              : userSelected.value.port.id,
            isConnected: true,
          })

          // fetch partners connected on cod for last mile
          if (isOnServiceType.value.lastMile) {
            await fetchMarketplace({
              country: userSelected.value.country.value,
              service: userSelected.value.serviceType.name,
              zone: userSelected.value.zone.id,
              isCOD: true,
              isConnected: true,
            })
          }

          await getLControl({
            country: userSelected.value.country.value,
            serviceType: userSelected.value.serviceType.name,
            isForZone: true,
          })
        } catch (error) {
          return error
        } finally {
          setTimeout(() => {
            $fetchState.pending = false
          }, 1500)
        }
      },
    }
    const handleBackToZoneSelection = () => {
      handleSelections.service({ data: userSelected.value.serviceType })
    }
    const handleDeleteForm = (deleteOn: string, indexNetworkPartner = -1) => {
      dialogSettings.value.loading = true
      dialog.value = {
        isOpen: true,
        deleteOn,
        indexNetworkPartner,
      }

      setTimeout(() => {
        dialogSettings.value.loading = false
      }, 1500)
    }
    const handleDeleteModal = async () => {
      if (!dialog.value.deleteOn) return

      dialogSettings.value.loading = true
      $fetchState.pending = true

      switch (dialog.value.deleteOn) {
        case 'cod':
          resetUserSelected.cod()
          break
        case 'networkPartner':
          resetUserSelected.networkPartner(dialog.value.indexNetworkPartner)
          break
      }

      await handleSubmit()
      setTimeout(() => {
        $fetchState.pending = false
        dialogSettings.value.loading = false
        dialog.value = {
          isOpen: false,
          deleteOn: '',
          indexNetworkPartner: -1,
        }
      }, 1500)
    }
    const handleSubmit = async () => {
      const countryName = `${
        userSelected.value.country.name.charAt(0) +
        userSelected.value.country.name.slice(1).toLowerCase()
      }`
      const { customs, lastMile } = isOnServiceType.value
      const {
        country,
        serviceType,
        zone,
        port,
        defaultPartner,
        codPartner,
        primary,
        secondary,
        tertiary,
      } = userSelected.value
      // set data before hit endpoint
      const data = {
        country: country.value,
        serviceType: serviceType.name,
        zoneID: lastMile ? zone.id : '',
        portID: customs ? port.id : '',
        defaultPartner: {
          partnerID: defaultPartner.partnerID || null,
        },
        codPartner: {
          partnerID: codPartner.partnerID || null,
        },
        primaryPartner: {
          partnerID: primary.partnerID || null,
          volume: primary.volume ? primary.volume?.toString() : null,
        },
        secondaryPartner: {
          partnerID: secondary.partnerID || null,
          volume: secondary.volume ? secondary.volume?.toString() : null,
        },
        tertiaryPartner: {
          partnerID: tertiary.partnerID || null,
          volume: tertiary.volume ? tertiary.volume.toString() : null,
        },
      }

      try {
        $fetchState.pending = true
        storeOfApplications.commit('applications/RESET_ALERT')
        const responseUpdate = await storeOfLControls.dispatch(
          'lControls/updateLControl',
          data
        )

        if (responseUpdate && responseUpdate.response.status >= 400)
          throw responseUpdate.response.data

        await getLControl({
          country: userSelected.value.country.value,
          serviceType: userSelected.value.serviceType.name,
          isForZone: true,
        })
        storeOfApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'success',
          message: `Successfully to updated L-Control rules for ${countryName}!`,
        })
      } catch (error) {
        storeOfApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'error',
          message: `Failed to updated L-Control rules for ${countryName}!`,
        })
        return error
      } finally {
        setTimeout(() => {
          $fetchState.pending = false
        }, 1500)
      }
    }
    const stateOther = {
      userSelected,
      showPortsOrZones,
      isOnServiceType,
      isSaveButtonDisabled,
      handleSelections,
      handleBackToZoneSelection,
      handleDeleteForm,
      handleDeleteModal,
      handleSubmit,
    }

    // manage bob
    const handleBob = async (value: boolean) => {
      try {
        $fetchState.pending = true
        resetUserSelected.serviceType()
        resetUserSelected.port()
        resetUserSelected.zone()
        resetUserSelected.form()

        if (value) {
          // use bob
          await storeOfLControls.dispatch(
            `lControls/addBOB`,
            userSelected.value.country.value
          )
        } else {
          // delete bob
          await storeOfLControls.dispatch(
            'lControls/deleteBOB',
            userSelected.value.country.value
          )
        }

        await handleSelections.country({ data: userSelected.value.country })
      } catch (error) {
        return error
      } finally {
        setTimeout(() => {
          $fetchState.pending = false
        }, 1500)
      }
    }
    // end manage bob

    // manage fetch
    const getLControl = async ({
      country,
      serviceType,
      isForZone = false,
    }: {
      country: string
      serviceType: string
      isForZone?: boolean
    }) => {
      try {
        await storeOfLControls.dispatch('lControls/getAllLControl', {
          country,
          serviceType,
        })
      } catch (error) {
        return error
      }

      const lControlDetail = lControlList.value.find((lcontrol) =>
        isOnServiceType.value.lastMile
          ? lcontrol.zoneID === userSelected.value.zone.id
          : lcontrol.portID === userSelected.value.port.id
      )

      // is useBOB
      userSelected.value.useBOB = lControlList.value.length
        ? lControlList.value.every((lcontrol) => lcontrol.useBOB)
        : false

      if (!lControlList.value.length && lControlDetail && !isForZone) return

      // set a user selected data based on lcontrol detail for the selected zone
      userSelected.value = {
        ...userSelected.value,
        defaultPartner: {
          partnerID: lControlDetail?.defaultPartner.partnerID || '',
        },
        codPartner: {
          partnerID: lControlDetail?.codPartner?.partnerID || '',
        },
        primary: {
          partnerID: lControlDetail?.primaryPartner?.partnerID || '',
          volume: lControlDetail?.primaryPartner?.volume || 0,
        },
        secondary: {
          partnerID: lControlDetail?.secondaryPartner?.partnerID || '',
          volume: lControlDetail?.secondaryPartner?.volume || 0,
        },
        tertiary: {
          partnerID: lControlDetail?.tertiaryPartner?.partnerID || '',
          volume: lControlDetail?.tertiaryPartner?.volume || 0,
        },
      }
    }
    const fetchServices = async () => {
      try {
        return await storeFilters.dispatch('filters/getServiceTypes')
      } catch (error) {
        return error
      }
    }
    const portsMeta = ref({
      page: 1,
      itemsPerPage: 10,
    }) as Ref<Pagination>
    const getPorts = async (params: Pagination) => {
      try {
        const { page, itemsPerPage: perPage } = params

        return await storeFilters.dispatch('filters/getPorts', {
          params: {
            page,
            perPage,
          },
          country: userSelected.value.country.value,
        })
      } catch (error) {
        return error
      }
    }
    const fetchZones = async () => {
      try {
        return await storeFilters.dispatch('filters/getZones', {
          params: {
            country: userSelected.value.country.value,
          },
        })
      } catch (error) {
        return error
      }
    }
    const fetchMarketplace = async (params: {
      country?: string
      service?: string
      zone?: string
      isLControl?: Boolean
      isCOD?: Boolean
      isConnected?: Boolean
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
      if (isOnServiceType.value.customs) {
        delete dataParams?.zone
        dataParams = {
          ...dataParams,
          port: params.zone,
        }
      }

      try {
        let routePath = 'getMarketplaces'

        if (params.isConnected) routePath = 'getMarketplacesConnected'

        await storeFilters.dispatch(`marketplaces/marketplaces/${routePath}`, {
          params: dataParams,
          isLControl: params.isLControl,
          isCOD: params.isCOD,
        })
      } catch (error) {
        return error
      }
    }
    const { $fetchState } = useFetch(() => {
      setTimeout(() => {
        storeOfApplications.commit('applications/RESET_ALERT')
      }, 3000)
    })
    const stateFetch = { getLControl, portsMeta, getPorts }
    // end manage fetch

    onUnmounted(() => {
      storeOfApplications.commit('applications/RESET_ALERT')
    })

    return {
      // manage store
      ...stateStore,
      // handle breadcrumbs
      breadcrumbs,
      // manage bob
      handleBob,
      // manage fetch
      ...stateFetch,
      // manage modal
      ...stateModal,
      ...stateOther,
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
    transition: all 0.3s;
    &:hover {
      opacity: 0.8;
    }
  }
  .disabled {
    &.btn-COD {
      cursor: not-allowed;
    }
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
