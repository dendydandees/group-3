<template>
  <section class="pa-4 pa-md-10 py-8 marketplace">
    <BaseBackButton
      v-if="!isOnMarketplaces"
      :text="'Back to Marketplaces'"
      @doBackTo="pageView = 'marketplaces'"
    />

    <BaseHeadlinePage
      :title="isOnMarketplaces ? 'Marketplace' : 'My Network Partners'"
      :subtitle="
        isOnMarketplaces
          ? 'Find and connect with our best vendors'
          : 'List of all partners that connected to you'
      "
    />

    <v-row class="mt-6">
      <v-col cols="7">
        <BaseSearchFieldCustom
          v-model="filter.search"
          :loading="$fetchState.pending"
          class="mb-14"
        />

        <div
          v-if="
            !filter.search &&
            !filter.country &&
            filter.service.length === 0 &&
            isOnMarketplaces
          "
        >
          <h1 class="title mb-2 text-capitalize">
            Featured Network <br />
            Partners
          </h1>

          <BaseLoading v-if="$fetchState.pending" />

          <template v-else>
            <carousel-3d
              v-if="marketplaces.length"
              :perspective="0"
              :space="200"
              :display="3"
              :height="475"
              :width="586"
              :autoplay="true"
              :on-main-slide-click="changePage"
            >
              <slide
                v-for="(slide, i) in marketplaces"
                :key="i"
                :index="i"
                style="cursor: pointer"
              >
                <v-hover v-slot="{ hover }">
                  <v-img
                    height="100%"
                    class="align-end opacity opacity-custom custom-slide"
                    :style="`${hover && 'filter: brightness(95%);'}`"
                    :src="
                      slide.partnerGallery[0]
                        ? slide.partnerGallery[0].path
                        : null
                    "
                  >
                    <div class="gradation-custom">
                      <!-- this is for gradation -->
                    </div>

                    <div
                      class="py-7 px-10 text-custom d-flex align-center justify-space-between"
                    >
                      <v-col class="text-h4 white--text pa-0">
                        {{ slide.name }}
                      </v-col>

                      <v-col
                        v-if="slide.partnerServiceTypes.length > 0"
                        cols="6"
                        class="pa-0"
                      >
                        <v-chip
                          v-for="(mile, index) in slide.partnerServiceTypes"
                          :key="index"
                          class="mr-1 my-1"
                          :color="
                            $customUtils.setColorServiceType(mile.name, 'chip')
                          "
                          text-color="white"
                          small
                          disabled
                          :style="{
                            opacity: 1,
                            border: '1px solid white !important',
                          }"
                        >
                          {{ $customUtils.setServiceType(mile.name) }}
                        </v-chip>
                      </v-col>
                    </div>
                  </v-img>
                </v-hover>
              </slide>
            </carousel-3d>
          </template>
        </div>
      </v-col>

      <v-col class="ml-15" style="max-width: calc(100% - 711px)">
        <v-card class="pa-4 d-flex" elevation="3">
          <v-card-text>
            <v-row>
              <v-col class="pa-0" cols="12" md="2">
                <div
                  class="d-flex align-center primary--text font-weight-bold subtitle-1"
                  style="height: 40px"
                >
                  Filter
                </div>
              </v-col>

              <v-col cols="12" md="10" class="pa-0">
                <v-row>
                  <v-col cols="12" md="12">
                    <v-select
                      v-model="selectedZone.value"
                      :items="countryCodes"
                      :disabled="$fetchState.pending"
                      item-text="name"
                      item-value="value"
                      label="Country"
                      outlined
                      rounded
                      dense
                      color="primary"
                      class="custom-select"
                      clearable
                    />
                  </v-col>

                  <v-col v-if="false" cols="12" md="6">
                    <v-select
                      v-model="selectedPort.value"
                      :items="!selectedZone.value ? [] : ports"
                      :disabled="$fetchState.pending"
                      item-text="name"
                      item-value="id"
                      label="Ports"
                      outlined
                      rounded
                      dense
                      color="primary"
                      :class="`custom-select ${
                        !selectedZone.value ? 'disabled-drop' : ''
                      }`"
                      clearable
                    />
                  </v-col>
                </v-row>

                <div class="mt-3">
                  <v-col
                    v-if="serviceTypes && serviceTypes.length > 0"
                    align-self="center"
                    class="pa-0"
                  >
                    <div class="primary--text font-weight-bold subtitle-2 mb-3">
                      Types
                    </div>

                    <div class="chip-group-custom">
                      <v-chip-group
                        v-model="selectedServiceTypes.arrValue"
                        multiple
                        active-class="primary accent-4 white--text"
                        column
                      >
                        <v-chip
                          v-for="(chip, i) in serviceTypes"
                          :key="i"
                          :value="chip.name"
                          :disabled="$fetchState.pending"
                          small
                          class="custom-chips mb-2"
                        >
                          {{ $customUtils.setServiceType(chip.name) }}
                        </v-chip>
                      </v-chip-group>
                    </div>
                  </v-col>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <div
          v-if="
            !filter.search &&
            !filter.country &&
            filter.service.length === 0 &&
            isOnMarketplaces &&
            marketplacesConnected.length
          "
        >
          <h1 class="title mb-6 mt-16 text-capitalize">
            Your Network <br />
            Partners
          </h1>

          <div class="container-your-partner">
            <div class="wrapper-your-partner">
              <v-row>
                <v-col
                  v-for="(x, i) in marketplacesConnected"
                  :key="i"
                  cols="4"
                >
                  <v-tooltip bottom color="primary">
                    <template #activator="{ on, attrs }">
                      <v-hover v-slot="{ hover }">
                        <v-img
                          :aspect-ratio="156 / 156"
                          :class="`rounded-circle ${hover && 'elevation-6'}`"
                          :src="`data:image/png;base64,${x.logo}`"
                          v-bind="attrs"
                          contain
                          :style="`${
                            hover
                              ? 'cursor: pointer; transform: scale(1.1); filter: brightness(95%);'
                              : ''
                          } border: 1px solid #1961e4;`"
                          v-on="on"
                          @click="changePage(x.id)"
                        />
                      </v-hover>
                    </template>

                    <span>{{ x.name }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </div>

            <div class="button-your-partner d-flex justify-center mt-6">
              <v-btn
                text
                color="secondary"
                :disabled="$fetchState.pending || !marketplacesConnected.length"
                @click="pageView = 'networkPartners'"
              >
                View your connected partners
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="isOnMarketplaces">
      <v-col>
        <h1
          v-if="!filter.search && !filter.country && !filter.service"
          class="title mb-2 text-capitalize"
        >
          Network Partners in<br />
          your area
        </h1>

        <div v-else class="primary--text subtitle-2 pl-1">
          {{ meta.totalCount }} RESULTS
        </div>

        <BaseLoading v-if="$fetchState.pending" />

        <v-container v-else fluid class="px-0">
          <v-row>
            <v-col
              v-for="(partner, u) in marketplaces"
              :key="u"
              cols="3"
              class="d-flex align-center justify-space-between pa-4"
            >
              <v-hover v-slot="{ hover }">
                <v-card
                  :elevation="hover ? 6 : 2"
                  :disabled="$fetchState.pending"
                  shaped
                  tile
                  class="rounded-xl d-flex flex-column justify-space-between card-partner-custom"
                  :style="`${
                    hover && 'transform: scale(1.1); filter: brightness(95%);'
                  }`"
                  width="100%"
                  height="245px"
                  color="white"
                  @click="changePage(partner.id)"
                >
                  <!-- :src="`data:image/png;base64,${partner.logo}`" -->
                  <v-img
                    height="100%"
                    width="100%"
                    class="align-end"
                    :src="`data:image/png;base64,${partner.logo}`"
                    contain
                  >
                    <!-- :src="
                    partner.partnerGallery[0]
                      ? partner.partnerGallery[0].path
                      : null
                  " -->
                    <!-- <v-col class="pa-0 wrapper-service" cols="7">
                    <div>
                      <v-chip
                        v-for="(mile, i) in partner.partnerServiceTypes"
                        :key="i"
                        class="mr-1 my-0 custom-chip"
                        text-color="white"
                        x-small
                        disabled
                      >
                        {{ $customUtils.setServiceType(mile.name) }}
                      </v-chip>
                    </div>
                  </v-col> -->
                    <v-col
                      class="body-2 white--text align-center d-flex pa-0 wrapper-service"
                      cols="7"
                    >
                      <NuxtImg
                        v-if="partner.partnerServiceZones.length > 0"
                        src="/images/mapLocation.svg"
                        preload
                        height="22.69"
                        class="mr-2"
                      />

                      <div
                        class="primary--text"
                        style="word-break: break-word; font-size: 10px"
                      >
                        {{ locationMapping(partner.partnerServiceZones) }}
                      </div>
                    </v-col>

                    <div>
                      <!-- this is for gradation -->
                      <!-- <div class="gradation-custom">
                    </div> -->
                      <div
                        class="pa-4 d-flex align-center justify-space-between primary"
                      >
                        <v-col
                          class="white--text pa-0 title"
                          :cols="!partner.partnerServiceZones ? 12 : 0"
                        >
                          {{ partner.name }}
                        </v-col>

                        <!-- v-if="partner.partnerServiceZones" -->
                        <!-- <v-col
                        v-if="false"
                        class="body-2 white--text align-center d-flex pa-0 ml-3"
                        cols="4"
                      >
                        <NuxtImg
                          v-if="partner.partnerServiceZones.length > 0"
                          src="/images/mapLocation.svg"
                          preload
                          height="22.69"
                          class="mr-2"
                        />
                        <div
                          style="word-break: break-word; font-size: 10px">
                          {{ locationMapping(partner.partnerServiceZones) }}
                        </div>
                      </v-col> -->
                      </div>
                    </div>

                    <v-btn
                      v-if="partner.status !== 'connected'"
                      fab
                      small
                      plain
                      absolute
                      top
                      right
                      class="pt-12"
                      :disabled="partner.status === 'pending'"
                      @click.stop="addPartner(partner)"
                    >
                      <v-icon
                        v-if="partner.status === 'none'"
                        dense
                        color="white"
                      >
                        mdi-account-plus
                      </v-icon>

                      <v-icon
                        v-else-if="partner.status === 'pending'"
                        dense
                        color="white"
                      >
                        mdi-account-clock
                      </v-icon>

                      <v-icon v-else dense color="white">
                        mdi-account-multiple-check
                      </v-icon>
                    </v-btn>

                    <v-chip
                      v-if="partner.status === 'connected'"
                      color="success"
                      text-color="white"
                      x-small
                      disabled
                      class="custom-chip-connected"
                      title="Connected"
                    />
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>

          <div class="d-flex align-center justify-center pt-4">
            <div>
              <v-btn
                fab
                small
                plain
                :disabled="pagination.page === 1 || $fetchState.pending"
                @click="nextOrPrev('-')"
              >
                <v-icon dense color="black"> mdi-menu-left </v-icon>
              </v-btn>
            </div>
            <div class="px-3">
              {{ meta.page }}
            </div>
            <div>
              <v-btn
                fab
                small
                plain
                :disabled="
                  pagination.page >= meta.totalPage || $fetchState.pending
                "
                @click="nextOrPrev('+')"
              >
                <v-icon dense color="black"> mdi-menu-right </v-icon>
              </v-btn>
            </div>
          </div>
        </v-container>
      </v-col>
    </v-row>

    <template v-if="!isOnMarketplaces">
      <NetworkPartnersList
        :loading="$fetchState.pending"
        class="mt-8 mb-10"
        @handleToPartnerDetails="changePage"
      />

      <BasePaginationOnCenter
        v-model="pagination"
        :meta="meta"
        :loading="$fetchState.pending"
        :per-page-options="{
          data: [5, 10, 15, 20, 25],
          text: 'Partners / Page',
        }"
        :total-items="marketplacesConnected.length"
        @handlePagination="nextOrPrev"
        @resetPage="pagination.page = 1"
      />
    </template>

    <MarketplaceAddForm
      :dialog="dialog"
      :data="idPartner"
      :error="errorAdd.value"
      @toggle="toggle()"
      @add="addConnection(idPartner.id)"
    />
  </section>
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
  useRouter,
  Ref,
  useMeta,
  ComputedRef,
  useContext,
} from '@nuxtjs/composition-api'
// components
import NetworkPartnersList from '@/components/marketplace/networkPartners/List.vue'
// Interfaces or types
import {
  Marketplace,
  VuexModuleMarketplaces,
  FilterDetails,
  PartnerServiceZone,
} from '~/types/marketplace/marketplace'
import { ServiceType, VuexModuleFilters } from '~/types/filters'
import { VuexModuleApplications } from '~/types/applications'

export default defineComponent({
  name: 'MarketPlace',
  components: {
    NetworkPartnersList,
  },
  layout: 'default',
  setup() {
    const router = useRouter()
    const { app } = useContext()
    // store manage
    const storeMarketplaces = useStore<VuexModuleMarketplaces>()
    const storeFilters = useStore<VuexModuleFilters>()
    const storeApplications = useStore<VuexModuleApplications>()
    const marketplaces = computed(
      () => storeMarketplaces.state.marketplaces.marketplaces.marketplaces
    )
    const marketplacesConnected = computed(
      () =>
        storeMarketplaces.state.marketplaces.marketplaces.marketplacesConnected
    )
    const meta = computed(
      () => storeMarketplaces.state.marketplaces.marketplaces.meta
    )
    const countryCodes = computed(() => storeFilters.state.filters.countryCodes)
    const ports = computed(() => storeFilters.state.filters.ports?.data) as any
    const pagination = ref({
      ...storeApplications.state.applications.pagination,
    })
    const filter = ref({
      ...storeMarketplaces.state.marketplaces.marketplaces.filter,
    })
    const zones = computed(() => storeFilters.state.filters.zones)
    const serviceTypes = computed(
      () =>
        app.$customUtils.sortServiceTypes([
          ...storeFilters.state.filters.serviceTypes,
        ]) as ServiceType[]
    ) as ComputedRef<ServiceType[]>
    const idPartner = ref({}) as Ref<Marketplace | {}>

    // manage view
    const pageView = ref(
      storeMarketplaces.state.marketplaces.marketplaces.pageView
    )
    const isOnMarketplaces = computed(() => pageView.value === 'marketplaces')

    // status connect - none - pending - connected
    const statusConnect = reactive({
      status: 'none',
    })
    const selectedZone = reactive({
      value: '',
    })
    const selectedPort = reactive({
      value: '',
    })
    const selectedServiceTypes = reactive({
      arrValue: [],
    })

    const slides = 7
    const chips = 6
    const method = reactive({
      opt: 'add',
    })
    const dialog = reactive({
      status: false,
    })
    const errorAdd = reactive({
      value: '',
    })
    const toggle = () => {
      if (method.opt === 'add' || method.opt === 'edit') {
        dialog.status = !dialog.status
      }
    }
    const addPartner = (partner: Marketplace) => {
      // idPartner.value = partner.id
      // idPartner.name = partner.name
      idPartner.value = partner
      toggle()
    }
    const addConnection = async (id: String) => {
      try {
        $fetchState.pending = true

        const res = await storeMarketplaces.dispatch(
          'marketplaces/marketplaces/addConnection',
          { id }
        )
        if (res?.error) throw res?.error
        dialog.status = false
        fetch()
      } catch (error: any) {
        errorAdd.value = error
        return error
      } finally {
        setTimeout(() => {
          $fetchState.pending = false
        }, 1500)
      }
    }

    watch(
      [dialog],
      ([newDialog]) => {
        if (!newDialog.status) {
          idPartner.value = {}
          errorAdd.value = ''
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
        setTimeout(() => {
          $fetchState.pending = false
        }, 1500)
      }
    }
    const getPorts = async () => {
      await storeFilters.dispatch('filters/getPorts', {
        params: {
          page: 1,
          perPage: 100,
        },
        country: selectedZone.value,
      })
    }

    const fetchMarketplace = async (params: FilterDetails) => {
      const { page, search, country, service, port } = params
      // const { page, itemsPerPage, search, country, service, port } = params
      // const perPage = itemsPerPage !== -1 ? itemsPerPage : meta.value.totalCount
      const dataParams = {
        page,
        perPage: 8,
        search,
        country,
        service,
        port,
      }

      try {
        $fetchState.pending = true

        await storeMarketplaces.dispatch(
          'marketplaces/marketplaces/getMarketplaces',
          { params: dataParams }
        )
      } catch (error) {
        return error
      } finally {
        setTimeout(() => {
          $fetchState.pending = false
        }, 1500)
      }
    }
    const fetchMarketplaceConnected = async (params: FilterDetails) => {
      const { page, itemsPerPage, search, country, service } = params
      // const { page, itemsPerPage, search, country, service } = params
      // const perPage = itemsPerPage !== -1 ? itemsPerPage : meta.value.totalCount
      const dataParams = {
        page,
        perPage: isOnMarketplaces.value ? 6 : itemsPerPage,
        search,
        country,
        service,
      }

      try {
        $fetchState.pending = true

        await storeMarketplaces.dispatch(
          'marketplaces/marketplaces/getMarketplacesConnected',
          { params: dataParams, isOnNetworkPartners: !isOnMarketplaces.value }
        )
      } catch (error) {
        return error
      } finally {
        setTimeout(() => {
          $fetchState.pending = false
        }, 1500)
      }
    }

    const fetchServiceZoneOnce = async () => {
      try {
        $fetchState.pending = true

        await storeMarketplaces.dispatch('filters/getOnce')
      } catch (error) {
        return error
      } finally {
        setTimeout(() => {
          $fetchState.pending = false
        }, 1500)
      }
    }
    const { $fetchState, fetch } = useFetch(async () => {
      if (isOnMarketplaces.value) {
        await fetchMarketplace({
          ...filter.value,
          ...pagination.value,
        })
      }

      await fetchMarketplaceConnected({
        ...filter.value,
        ...pagination.value,
      })
      await fetchCountryCodes()
      await fetchServiceZoneOnce()
      // zones.value =  [ ...storeFilters.state.filters.zones]
      // serviceTypes.value =  [ ...storeFilters.state.filters.serviceTypes]
    })

    const locationMapping = (partnerServiceZones: PartnerServiceZone[]) => {
      if (partnerServiceZones && partnerServiceZones.length > 0) {
        const temp = [] as string[]
        partnerServiceZones.forEach(
          (el: { id: string; zone_country: string }) => {
            if (!temp.includes(el.zone_country)) {
              temp.push(el.zone_country)
            }
          }
        )
        return temp.join(', ')
      } else {
        return ''
      }
    }

    const nextOrPrev = (type: string) => {
      switch (type) {
        case '+':
          pagination.value = {
            ...pagination.value,
            page: pagination.value.page + 1,
          }
          break
        case '-':
          pagination.value = {
            ...pagination.value,
            page: pagination.value.page - 1,
          }
          break
        default:
          break
      }
    }

    // watching a changes state of page view
    watch(pageView, (newValue) => {
      pagination.value = {
        ...pagination.value,
        page: 1,
        itemsPerPage: 5,
      }

      storeFilters.commit('marketplaces/marketplaces/SET_PAGE_VIEW', newValue)
    })
    watch(
      [filter],
      ([newFilter]) => {
        pagination.value = {
          ...pagination.value,
          page: 1,
        }

        storeFilters.commit('marketplaces/marketplaces/SET_FILTER', {
          ...newFilter,
        })

        // fetch()
        fetchMarketplace({
          ...filter.value,
          ...pagination.value,
        })
      },
      { deep: true }
    )

    // manage pagination on changed
    watch(
      pagination,
      (newPagination) => {
        storeApplications.commit('applications/SET_PAGINATION', {
          ...newPagination,
        })
        fetch()
      },
      { deep: true }
    )

    watch(
      selectedServiceTypes,
      (newService) => {
        // filter.value.service = newService.arrValue.join(',')
        filter.value.service = newService.arrValue
      },
      { deep: true }
    )

    watch(
      selectedZone,
      (newZone) => {
        filter.value.country = newZone.value
        getPorts()
        filter.value.port = ''
        selectedPort.value = ''
      },
      { deep: true }
    )
    watch(
      selectedPort,
      (newPort) => {
        filter.value.port = newPort.value
      },
      { deep: true }
    )

    const changePage = (id: string | { index: number }) => {
      let tempId = id
      if (typeof id === 'object') {
        tempId = marketplaces.value[id.index].id
      }
      router.push(`/marketplace/${tempId}`)
    }

    // manage meta
    useMeta(() => ({
      title: `Client Portal | ${
        pageView.value === 'marketplaces'
          ? 'Marketplaces'
          : 'My Network Partners'
      }`,
    }))

    return {
      marketplaces,
      pageView,
      isOnMarketplaces,
      filter,
      dialog,
      method,
      toggle,
      addPartner,
      slides,
      chips,
      locationMapping,
      meta,
      nextOrPrev,
      statusConnect,
      zones,
      selectedZone,
      serviceTypes,
      selectedPort,
      selectedServiceTypes,
      addConnection,
      idPartner,
      pagination,
      changePage,
      countryCodes,
      ports,
      marketplacesConnected,
      errorAdd,
    }
  },
  head: {},
})
</script>

<style lang="scss">
@import '~/assets/scss/color.module.scss';
.marketplace {
  .carousel-3d-slide {
    border: unset;
    border-radius: 20px;
    /* padding: 20px; */
    background: $primary;
    color: white;
    box-shadow: 0px 0px 40px 0px #36363626;
    &.current {
      background: $primary;
      .opacity-custom {
        opacity: 1;
      }
    }
    .opacity-custom {
      opacity: 0.7;
    }
  }
  .custom-select {
    &.disabled-drop {
      cursor: not-allowed;
      opacity: 0.5;
      .v-input__control {
        pointer-events: none;
      }
    }
    .v-select__slot {
      label {
        font-size: 12px;
        color: $secondary;
        font-weight: bold;
      }
    }
    .v-input__slot {
      margin-bottom: unset !important;
      /* outline: 1px solid #2196F3; */
      fieldset {
        border-color: $primary;
      }
    }
    .v-text-field__details {
      display: none;
    }
  }

  .custom-slide {
    .gradation-custom {
      background: linear-gradient(0deg, $primary, transparent);
      height: 90px;
    }
    .text-custom {
      background: $primary;
    }
  }

  .card-partner-custom {
    .gradation-custom {
      background: linear-gradient(0deg, $primary, transparent);
      height: 90px;
    }

    .custom-chip-connected {
      position: absolute !important;
      top: 20px;
      right: 20px;
      opacity: 1 !important;
    }

    .wrapper-service {
      position: absolute;
      left: 20px;
      top: 18px;
    }

    .custom-chip {
      background-color: unset !important;
      backdrop-filter: blur(100px);
      opacity: 1;
    }
  }

  // .chip-custom-types {
  // }

  .chip-group-custom {
    .card-chip-group {
      .v-slide-group__next,
      .v-slide-group__prev {
        min-width: unset;
        flex: unset;
        i {
          color: rgba(255, 255, 255, 0.534);
          font-size: 18px;
        }
      }

      .v-chip--disabled {
        opacity: 1;
      }
      .v-slide-group__prev--disabled,
      .v-slide-group__next--disabled {
        display: none;
      }
    }
    .custom-chip-connected {
      position: absolute !important;
      top: 20px;
      right: 20px;
      opacity: 1 !important;
    }
    .v-slide-group__content {
      padding: unset;
      .custom-chips {
        color: $primary;
        background: transparent !important;
        border: 1px solid $primary;
        margin: 0px 8px 0px 0;

        &.v-chip--active {
          background: $primary !important;
        }

        &.blue {
          background: $primary !important;
          border: 1px solid $primary !important;
        }
      }
    }
  }
}
</style>
