<template>
  <div>
    <BaseLoadingLinear
      v-if="$fetchState.pending || loading"
      :title="'Getting partners connected data...'"
    />

    <template v-else>
      <template v-for="marketplace in marketplacesConnected">
        <v-hover v-slot="{ hover }" :key="marketplace.id">
          <v-card
            :elevation="hover ? 6 : 2"
            class="my-4"
            style="transition: all 0.3s ease-in-out"
            @click="$emit('handleToPartnerDetails', marketplace.id)"
          >
            <v-card-text>
              <v-row
                align="center"
                align-md="start"
                justify="center"
                justify-md="space-between"
              >
                <v-col cols="12" md="auto" class="text-center">
                  <v-avatar
                    :size="$vuetify.breakpoint.mobile ? 120 : 100"
                    class="elevation-2"
                  >
                    <v-img
                      v-if="marketplace.logo"
                      :src="`data:image/png;base64,${marketplace.logo}`"
                      :lazy-src="`data:image/png;base64,${marketplace.logo}`"
                      contain
                    />

                    <v-icon
                      v-else
                      dark
                      :size="$vuetify.breakpoint.mobile ? 80 : 60"
                      color="primary"
                      class="mt-0 mt-md-1"
                    >
                      {{
                        $vuetify.breakpoint.mobile
                          ? 'mdi-account-circle'
                          : '$profile'
                      }}
                    </v-icon>
                  </v-avatar>
                </v-col>

                <v-col order="3" order-md="2">
                  <div class="text-center text-md-left mb-8 mb-md-4">
                    <h3 class="title font-weight-bold mb-4 mb-md-2">
                      {{ marketplace.name }}
                    </h3>

                    <v-chip
                      v-for="(
                        serviceType, serviceTypeIndex
                      ) in marketplace.partnerServiceTypes"
                      :key="serviceTypeIndex"
                      :color="
                        $customUtils.setColorServiceType(serviceType.name)
                      "
                      class="mr-2 mb-2"
                      small
                    >
                      {{ $customUtils.setServiceType(serviceType.name) }}
                    </v-chip>
                  </div>

                  <div class="mb-6">
                    <div
                      class="d-flex d-md-inline-flex mr-0 mr-md-10 mb-4 mb-md-0"
                    >
                      <NuxtImg
                        src="/images/mapLocation.svg"
                        preload
                        height="24"
                        width="24"
                        class="mr-2"
                      />

                      <div>
                        <p class="subtitle-2 font-weight-bold mb-2">
                          COUNTRY OF SERVICE
                        </p>

                        <span class="d-block body-2 text-capitalize">
                          {{
                            setServicePartner(
                              marketplace.partnerServiceZones,
                              'country'
                            )
                          }}
                        </span>
                      </div>
                    </div>

                    <!-- COMING SOON -->
                    <!-- <div class="d-flex d-md-inline-flex">
                      <v-icon
                        size="24"
                        color="primary"
                        class="mr-2"
                        v-text="'$clientConnections'"
                      />

                      <div>
                        <p class="subtitle-2 font-weight-bold mb-2">
                          PORT OF SERVICE
                        </p>

                        <span class="d-block body-2 text-capitalize">
                          {{
                            setServicePartner(
                              marketplace.partnerServiceZones,
                              'port'
                            )
                          }}
                        </span>
                      </div>
                    </div> -->
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  md="auto"
                  order="2"
                  order-md="3"
                  class="text-center"
                >
                  <v-chip
                    :color="isConnected ? 'primary' : 'secondary'"
                    outlined
                  >
                    <span class="font-weight-bold">
                      {{ isConnected ? 'Connected' : 'Pending' }}
                    </span>
                  </v-chip>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-hover>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  useStore,
  useFetch,
  ref,
  Ref,
} from '@nuxtjs/composition-api'
// types
import { Ports, VuexModuleFilters } from '~/types/filters'
import {
  Marketplace,
  PartnerServiceZone,
  VuexModuleMarketplaces,
} from '~/types/marketplace/marketplace'

export default defineComponent({
  name: 'NetworkPartnersList',
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    // manage store
    const storeFilters = useStore<VuexModuleFilters>()
    const storeMarketplaces = useStore<VuexModuleMarketplaces>()
    const countryCodes = computed(() => storeFilters.state.filters.countryCodes)
    const marketplacesConnected = computed(
      () =>
        storeMarketplaces.state.marketplaces.marketplaces.marketplacesConnected
    )
    const stateStore = { marketplacesConnected }
    // end manage store

    const ports = ref({}) as Ref<Ports>
    const isConnected = (data: Marketplace) => {
      return data.status === 'connected'
    }
    // methods to show a available country or port on partners connected list
    const setServicePartner = (zones: PartnerServiceZone[], type: string) => {
      const defaultMessage = 'Not Available'
      const zonesFiltered = [...new Set(zones.map((zone) => zone.zone_country))]

      if (type !== 'port' && type !== 'country') return defaultMessage

      if (type === 'port') {
        const portFiltered = ports.value.data
          .filter((port) => zonesFiltered.includes(port.countryCode))
          .map((port) => port.name.toLowerCase())

        return portFiltered.join(', ') || defaultMessage
      }

      if (type === 'country') {
        const countryFiltered = countryCodes.value
          .filter((country) => zonesFiltered.includes(country.value))
          .map((country) => country.name.toLowerCase())

        return countryFiltered.join(', ') || defaultMessage
      }
    }
    const stateOther = { ports }
    const functionOther = { isConnected, setServicePartner }

    useFetch(async () => {
      ports.value = await storeFilters.dispatch('filters/getPorts', {
        params: {
          page: 1,
          perPage: 100,
        },
      })
    })

    return { ...stateStore, ...stateOther, ...functionOther }
  },
})
</script>
