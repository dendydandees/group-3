<template>
  <section class="pa-4 pa-md-10 py-8 marketplace">
    <BaseHeadlinePageCustom
      title="Marketplace"
      subtitle="Find and connect with our best vendors"
    >
    </BaseHeadlinePageCustom>
    <v-row
      class="mt-6"
    >
      <v-col
        cols="7"
        class="pa-0"
      >
        <BaseSearchFieldCustom
          v-model="filter.search"
          class="mb-14"
        />
        <div
          v-if="!filter.search && !filter.country && !filter.service"
        >
          <h1 class="headline font-weight-bold mb-2 text-capitalize">
            Featured Network <br>
            Partners
          </h1>
          <carousel-3d
            :perspective="0"
            :space="200"
            :display="3"
            :height="475"
            :width="586"
            :autoplay="false"
            :on-main-slide-click="changePage"
          >
            <slide
              v-for="(slide, i) in marketplaces.slice(0, 5)"
              :key="i"
              :index="i"
              style="cursor:pointer"
            >
              <v-img
                height="100%"
                class="align-end opacity opacity-custom custom-slide"

                :src="slide.partnerGallery[0] ? slide.partnerGallery[0].path : null"
              >
                <div class="gradation-custom">
                  <!-- this is for gradation -->
                </div>
                <div
                  class="py-7 px-10 text-custom d-flex align-center justify-space-between"
                >
                  <v-col
                    class="text-h4 white--text pa-0"
                  >
                    {{slide.name}}
                  </v-col>
                  <v-col
                    v-if="slide.partnerServiceTypes.length > 0"
                    cols="6"
                    class="pa-0"
                  >
                    <div>
                      <v-chip
                        v-for="(mile, i) in slide.partnerServiceTypes"
                        :key="i"
                        class="mr-1 my-1"
                        color="pink"
                        text-color="white"
                        small
                        disabled
                        style="opacity: 1"
                      >
                        {{$customUtils.setServiceType(mile.name)}}
                      </v-chip>

                    </div>
                  </v-col>
                </div>
              </v-img>
            </slide>
          </carousel-3d>

        </div>
      </v-col>
      <v-col
        class="pa-0 ml-15"
      >
        <v-card
          class="pa-6 d-flex"
          elevation="3"
        >
          <v-col
            class="pa-0 mr-6"
            cols="1"
          >
            <div
              class="d-flex align-center primary--text"
              style="height: 40px"
            >
              Filter
            </div>
          </v-col>
          <v-col
            class="pa-0"
          >
            <div
              class="d-flex align-center justify-space-between mb-4"
            >
              <v-select
                v-model="selectedZone.value"
                :items="zones"
                item-text="country"
                item-value="country"
                label="Country"
                outlined
                rounded
                dense
                color="primary"
                class="custom-select mr-4"
                clearable
              >
              </v-select>
              <v-select
                :items="[]"
                label="Ports"
                outlined
                rounded
                dense
                color="primary"
                class="custom-select"
                clearable
              >
              </v-select>
            </div>
            <div>
              <v-col
                v-if="serviceTypes && serviceTypes.length > 0"
                align-self="center"
                class="pa-0"
              >
                <div
                  class="red--text font-weight-bold subtitle-2 mb-3"
                >
                  Types
                </div>
                <div
                  class="chip-group-custom"
                >
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
                      small
                      class="custom-chips"
                    >
                      {{$customUtils.setServiceType(chip.name)}}
                    </v-chip>

                  </v-chip-group>
                </div>
              </v-col>
            </div>
          </v-col>
        </v-card>
        <div
          v-if="!filter.search && !filter.country && !filter.service"
        >
          <h1 class="headline font-weight-bold mb-6  mt-16 text-capitalize">
            Your Network <br>
            Partners
          </h1>
          <div class="container-your-partner">
            <div
              class="wrapper-your-partner"
            >
              <v-row>
                <v-col
                  v-for="(x, i) in 6"
                  :key="i"
                  cols="4"
                >
                  <v-img
                    :aspect-ratio="156/156"
                    class="rounded-circle"
                    src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
                  >
                  </v-img>
                </v-col>
              </v-row>
            </div>
            <div class="button-your-partner d-flex justify-center mt-6">
              <v-btn
                plain
                color="red"
              >
                View your connected vendors
              </v-btn>
            </div>
          </div>

        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h1 v-if="!filter.search && !filter.country && !filter.service" class="headline font-weight-bold mb-2 text-capitalize">
          Network Partners in<br>
          your area
        </h1>
        <div
          v-else
          class="primary--text subtitle-2 pl-1"
        >
          {{meta.totalCount}} RESULTS
        </div>
        <v-container
          fluid
          class="px-0"
        >
          <v-row
          >
            <v-col
              v-for="(partner, u) in marketplaces"
              :key="u"
              cols="3"
              class="d-flex align-center justify-space-between pa-4"
            >

              <v-card
                elevation="1"
                shaped
                tile
                class="rounded-xl d-flex flex-column justify-space-between  card-partner-custom"
                width="100%"
                height="245px"
                color="primary"

                :disabled="$fetchState.pending"
                @click="changePage(partner.id)"
              >
                  <!-- :src="`data:image/png;base64,${partner.logo}`" -->
                <v-img
                  height="100%"
                  width="100%"
                  class="align-end "
                  :src="partner.partnerGallery[0] ? partner.partnerGallery[0].path : null"
                >
                  <v-col
                    class="pa-0 wrapper-service"
                    cols="7"
                  >
                      <div>
                        <v-chip
                          v-for="(mile, i) in partner.partnerServiceTypes"
                          :key="i"
                          class="mr-1 my-0 custom-chip"
                          text-color="white"
                          x-small
                          disabled
                        >
                          {{$customUtils.setServiceType(mile.name)}}
                        </v-chip>

                      </div>
                  </v-col>
                  <div>
                    <div class="gradation-custom">
                      <!-- this is for gradation -->
                    </div>
                    <div
                      class="pa-4 d-flex align-center justify-space-between primary"
                    >
                      <v-col
                        class="white--text pa-0"
                        style="font-size: 33px"
                        :cols="!partner.partnerServiceZones ? 12 : 0"
                      >
                        {{partner.name}}
                      </v-col>
                      <v-col
                        v-if="partner.partnerServiceZones"
                        class="body-2 white--text aling-center d-flex pa-0 ml-3"
                        cols="4"
                      >
                        <!-- <v-icon
                          v-if="partner.partnerServiceTypes.length > 0"
                          small
                          color="white"
                          class="mr-1"
                        >
                          mdi-pin
                        </v-icon> -->
                        <NuxtImg
                          v-if="partner.partnerServiceTypes.length > 0"
                          src="/images/mapLocation.svg"
                          preload
                          height="22.69"
                          class="mr-2"
                        />
                        <div
                          style="word-break: break-word;font-size: 10px"
                        >
                          {{locationMapping(partner.partnerServiceZones)}}
                        </div>
                      </v-col>

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
                    <v-icon
                      v-else
                      dense
                      color="white"
                    >
                      mdi-account-multiple-check
                    </v-icon>
                  </v-btn>
                  <v-chip
                    v-if="partner.status === 'connected'"
                    color="green"
                    text-color="white"
                    x-small
                    disabled

                    class="custom-chip-connected"
                  >
                    <!-- Connected -->
                  </v-chip>
                </v-img>
              </v-card>
            </v-col>
          </v-row>
          <div
            class="d-flex align-center justify-center pt-4"
          >
            <div>
              <v-btn
                fab
                small
                plain
                :disabled="(pagination.page === 1) || $fetchState.pending"
                @click="nextOrPrev('-')"
              >
                <v-icon
                  dense
                  color="black"
                >
                  mdi-menu-left
                </v-icon>
              </v-btn>
            </div>
            <div
              class="px-3"
            >
              {{meta.page}}
            </div>
            <div>
              <v-btn
                fab
                small
                plain
                :disabled="(pagination.page >= meta.totalPage) || $fetchState.pending"
                @click="nextOrPrev('+')"
              >
                <v-icon
                  dense
                  color="black"
                >
                  mdi-menu-right
                </v-icon>
              </v-btn>
            </div>
          </div>
        </v-container>
      </v-col>
    </v-row>
    <MarketplaceAddForm
      :dialog="dialog"
      :data="idPartner"
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
  useMeta,
  useRouter,
  Ref,
  useRoute
} from '@nuxtjs/composition-api'
// Interfaces or types
import { Marketplace, VuexModuleMarketplaces,FilterDetails, PartnerServiceZone } from '~/types/marketplace/marketplace'
import { VuexModuleFilters, Zone, ServiceType} from '~/types/filters'
import { VuexModuleApplications } from '~/types/applications'


export default defineComponent({
  name: 'MarketPlace',
  layout: 'default',
  setup() {
    const router = useRouter()
    // store manage
    const storeMarketplaces = useStore<VuexModuleMarketplaces>()
    const storeFilters= useStore<VuexModuleFilters>()
    const storeApplications = useStore<VuexModuleApplications>()
    const marketplaces = computed(() => storeMarketplaces.state.marketplaces.marketplaces.marketplaces)
    const meta = computed(() => storeMarketplaces.state.marketplaces.marketplaces.meta)
    const pagination = ref({
      ...storeApplications.state.applications.pagination,
    })
    const filter = ref({
      ...storeMarketplaces.state.marketplaces.marketplaces.filter
    })
    const zones = ref([]) as Ref<Zone[]>
    const serviceTypes = ref({ ...storeFilters.state.filters.serviceTypes })
    const idPartner = ref ({}) as Ref<Marketplace | {}>
    // status connect - none - pending - connected
    const statusConnect = reactive ({
      status: 'none'
    })
    const selectedZone = reactive ({
      value: ''
    })
    const selectedServiceTypes = reactive ({
      arrValue: []
    })


    const slides = 7
    const chips = 6
    const method = reactive({
      opt: 'add'
    })
    const dialog = reactive({
      status: false
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

        await storeMarketplaces.dispatch('marketplaces/marketplaces/addConnection', {id})
        dialog.status = false
        fetch()
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }

    watch(
      [dialog],
      ([newDialog]) => {
        if(!newDialog.status) {
          idPartner.value = {}
        }
      },
      { deep: true }
    )

    const fetchMarketplace = async (params: FilterDetails) => {
      const { page, itemsPerPage, search, country,service} = params
      const perPage = itemsPerPage !== -1 ? itemsPerPage : meta.value.totalCount
      const dataParams = {
        page,
        perPage: 8,
        search,
        country,
        service
      }

      try {
        $fetchState.pending = true

        await storeMarketplaces.dispatch('marketplaces/marketplaces/getMarketplaces', { params: dataParams })
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }

    const fetchServiceZoneOnce = async () => {
      try {
        $fetchState.pending = true

        await storeMarketplaces.dispatch('filters/getOnce')
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const { $fetchState, fetch } = useFetch(async () => {
      await fetchMarketplace(
        {
          ...filter.value,
          ...pagination.value
        }
      )
      await fetchServiceZoneOnce()
      zones.value =  [ ...storeFilters.state.filters.zones]
      serviceTypes.value =  [ ...storeFilters.state.filters.serviceTypes]
    })

    const locationMapping = (partnerServiceZones: PartnerServiceZone[]) => {
      if(partnerServiceZones && partnerServiceZones.length > 0) {
        const tempZone = partnerServiceZones.map((el, i) => {
          return el.zone_country
        })
        return tempZone.join(', ')
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
          break;
        case '-':
          pagination.value = {
            ...pagination.value,
            page: pagination.value.page - 1,
          }
          break
        default:
          break;
      }
    }

    watch(
      [filter],
      ([newFilter]) => {
        pagination.value = {
          ...pagination.value,
          page: 1,
        }

        storeFilters.commit('marketplaces/marketplaces/SET_FILTER', {
          ...newFilter
        })

        fetch()
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
      },
      { deep: true }
    )

    const changePage = (id: string | {index: number}) => {
      let tempId = id
      if(typeof id === 'object') {
        tempId = marketplaces.value[id.index].id
      }
      router.push(`/marketplace/${tempId}`)
    }

    return {
      marketplaces,
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
      selectedServiceTypes,
      addConnection,
      idPartner,
      pagination,
      changePage
    }
  },
  head: {},
})
</script>

<style lang="scss">
@import "~/assets/scss/color.module.scss";
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
        opacity: .7;
      }
    }
    .custom-select {
      .v-select__slot {
        label {
          font-size: 12px;
          color: red;
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


    .chip-group-custom {
      .card-chip-group {
        .v-slide-group__next, .v-slide-group__prev {
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
        .v-slide-group__prev--disabled, .v-slide-group__next--disabled {
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
          color: $primary ;
          background: transparent !important;
          border: 1px solid $primary;
          margin: 0px 8px 0px 0;

          &.blue {
            background: $primary !important;
            border: 1px solid $primary !important;
          }
        }
      }

    }
  }
</style>
