<template>
  <section class="pa-4 pa-md-10 py-8 marketplace">
    <BaseHeadlinePageCustom
      title="Marketplace"
      subtitle="Find and connect with our best vendors"
    >
    </BaseHeadlinePageCustom>
    <v-row align="center">
      <v-col cols="12" md="7">
        <!-- Search filter field -->
        <BaseSearchFieldCustom
          v-model="filter.search"
          :filter="showFilter"
          :icon="filterIcon"
        />
      </v-col>
    </v-row>
    <v-row
      v-if="filter.search || showFilter.status"
    >
      <v-col cols="4" md="3">
        <v-select
          v-model="selectedZone.value"
          :items="zones"
          item-text="country"
          item-value="country"
          label="Country"
          outlined
          rounded
          dense
          color="blue"
          class="custom-select pb-3"
          clearable
        >
        </v-select>
        <v-select
          :items="[]"
          label="Ports"
          outlined
          rounded
          dense
          color="blue"
          class="custom-select"
          clearable
        >
        </v-select>
      </v-col>
      <v-col
        v-if="serviceTypes && serviceTypes.length > 0"
        align-self="center"
        cols="4"
        md="4"
      >
        <div
          class="red--text font-weight-bold subtitle-2"
        >
          Types
        </div>
        <div
        >
          <v-chip-group
            v-model="selectedServiceTypes.arrValue"
            multiple
            active-class="blue accent-4 white--text"

            column
          >
            <v-chip
              v-for="(chip, i) in serviceTypes"
              :key="i"
              :value="chip.name"
              small
              class="custom-chips"
            >
              {{chip.name}}
            </v-chip>

          </v-chip-group>
        </div>
      </v-col>
    </v-row>
    <v-row
      class="mt-6"
    >
      <v-col v-if="!filter.search && !filter.country && !filter.service" cols="12" md="12">
        <h1 class="headline font-weight-bold mb-2 text-capitalize">
          Featured Network <br>
          Partners
        </h1>
        <carousel-3d
          :perspective="0"
          :space="330"
          :display="5"
          :height="350"
          :width="500"
          :autoplay="true"
        >
          <slide
            v-for="(slide, i) in slides"
            :key="i"
            :index="i"
          >
            <!-- <span class="title">Featured Partners #{{i + 1}}</span>
            <p>Ninja Van</p> -->
            <v-img
              height="100%"
              class="align-end opacity opacity-custom"

              src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
            >
              <div
                class="pa-4 "
              >
                <div
                  class="title white--text"
                >
                  Ninja Van
                </div>
                <div
                  class="pb-1 body-2 white--text aling-center d-flex"
                >
                  <v-icon
                    small
                    color="white"
                    class="mr-1"
                  >
                    mdi-pin
                  </v-icon>
                  Malaysia - Kuala Lumpur
                </div>
                <div
                  class="d-flex"
                >
                  <v-chip-group
                    class="card-chip-group"
                  >
                    <v-chip
                      v-for="(mile, i) in 4"
                      :key="i"
                      class="mr-1 my-0"
                      color="pink"
                      text-color="white"
                      x-small
                      disabled
                    >
                      First Mile
                    </v-chip>
                  </v-chip-group>
                </div>
              </div>
            </v-img>
          </slide>
        </carousel-3d>
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
          class="blue--text subtitle-2 pl-1"
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
                class="rounded-xl d-flex flex-column justify-space-between"
                width="100%"
                color="blue"
                :disabled="$fetchState.pending"
                @click="changePage(partner.id)"
              >
                <v-img
                  height="250"
                  src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
                ></v-img>
                <div
                  class="pa-4 "
                >
                  <div
                    class="title white--text  text-truncate"
                  >
                    {{partner.name}}
                  </div>
                  <div
                    class="pb-1 body-2 white--text aling-center d-flex"
                  >
                    <v-icon
                      v-if="partner.partnerServiceTypes.length > 0"
                      small
                      color="white"
                      class="mr-1"
                    >
                      mdi-pin
                    </v-icon>
                    {{locationMapping(partner.partnerServiceZones)}}
                  </div>
                  <div
                    class="d-flex"
                  >
                    <v-chip-group
                      class="card-chip-group"

                    >
                      <v-chip
                        v-for="(mile, i) in partner.partnerServiceTypes"
                        :key="i"
                        class="mr-1 my-0"
                        color="pink"
                        text-color="white"
                        x-small
                        disabled
                      >
                        {{mile.name}}
                      </v-chip>
                    </v-chip-group>
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
                    mdi-account-minus
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
                  Connected
                </v-chip>
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
      @add="addConnection(idPartner.value)"
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
    const idPartner = reactive ({
      value: '' as String,
      name: '' as String
    })
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
    const showFilter = reactive({
      status: false
    })
    const filterIcon = reactive({
      active: 'mdi-view-stream',
      passive: 'mdi-view-stream-outline'
    })
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
      idPartner.value = partner.id
      idPartner.name = partner.name
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
          idPartner.value = ''
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
        filter.value.service = newService.arrValue.join(',')
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

    const changePage = (id: string) => {
      router.push(`/marketplace/${id}`)
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
      showFilter,
      filterIcon,
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
  .marketplace {
    .carousel-3d-slide {
      border: unset;
      border-radius: 20px;
      /* padding: 20px; */
      background: #48a3ee;
      color: white;
      box-shadow: 0px 0px 40px 0px #36363626;
      &.current {
        background: #2196F3;
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
          border-color: #2196F3;
        }
      }
      .v-text-field__details {
        display: none;
      }
    }

    .custom-chips {
      color: #2196F3;
      background: transparent !important;
      border: 1px solid #2196F3;
    }
  }
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
    position: absolute;
    top: 20px;
    right: 20px;
    opacity: 1;
  }
</style>
