<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseHeadlinePage
      title="Partner Profiles"
      subtitle="Manage profile of partner to present and inform potential clients about the services provided."
    >
      <template slot="addition">
        <span class="text--secondary font-weight-medium title">
          &bull; {{ meta.totalCount }} Total Partner Profiles
        </span>
      </template>
    </BaseHeadlinePage>

    <v-row>
      <v-col v-if="partnerProfiles.length === 0" cols="12">
        <h2 class="subtitle-1 font-weight-bold text-center">
          No partner profiles available
        </h2>
      </v-col>

      <v-col
        v-for="partner in partnerProfiles"
        v-else
        :key="partner.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-hover>
          <template #default="{ hover }">
            <!-- card just images with three dots button -->
            <v-card elevation="0" tile>
              <v-img
                :gradient="
                  hover
                    ? 'to bottom, rgba(0, 0, 0, 0.4) 0%, transparent 72px'
                    : ''
                "
                src="https://cdn.vuetifyjs.com/images/cards/forest-art.jpg"
              >
                <v-fade-transition hide-on-leave>
                  <v-app-bar
                    v-if="hover && selected !== partner.id"
                    flat
                    color="rgba(0, 0, 0, 0)"
                  >
                    <v-spacer />

                    <v-btn
                      color="white"
                      icon
                      @click="doShowDetails(partner.id)"
                    >
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </v-app-bar>
                </v-fade-transition>

                <v-expand-transition>
                  <!-- card partner profile details -->
                  <v-card
                    v-if="selected === partner.id"
                    v-click-outside="onClickOutside"
                    tile
                    class="transition-fast-in-fast-out v-card--reveal"
                    style="height: 100%"
                  >
                    <v-card-text>
                      <div class="d-flex align-center justify-space-between">
                        <h2 class="text-h6 primary--text text-truncate">
                          {{ partner.title }}
                        </h2>

                        <v-menu
                          bottom
                          left
                          eager
                          tile
                          transition="slide-y-transition"
                        >
                          <template #activator="{ on, attrs }">
                            <v-btn
                              icon
                              v-bind="attrs"
                              :ripple="{ class: `primary--text` }"
                              v-on="on"
                            >
                              <v-icon> mdi-dots-vertical </v-icon>
                            </v-btn>
                          </template>

                          <v-list dense>
                            <v-list-item
                              dense
                              link
                              nuxt
                              :ripple="{ class: `primary--text` }"
                              :to="`/partners/profiles/edit/${partner.id}`"
                            >
                              <v-list-item-title> Edit </v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>

                      <span class="line-clamp-3">
                        {{ partner.description }}
                      </span>
                    </v-card-text>

                    <v-card-actions class="pt-0">
                      <v-btn
                        tile
                        elevation="0"
                        text
                        nuxt
                        color="primary"
                        :to="`/partners/portals/${partner.id}/incoming-orders`"
                      >
                        Get Into Portal
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-expand-transition>
              </v-img>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>

    <v-row align="center" justify="space-between" class="white my-8 mx-0">
      <v-col cols="12" sm="auto">
        <v-select
          v-model="pagination.itemsPerPage"
          :items="paginationItems"
          dense
          outlined
          single-line
          hide-details
          item-text="title"
          item-value="value"
          :style="$vuetify.breakpoint.xsOnly ? '' : 'max-width: 50%'"
          class="ml-3"
        />
      </v-col>

      <v-col cols="12" sm="auto">
        <v-pagination
          v-model="pagination.page"
          :length="meta.totalPage"
          :total-visible="7"
        />
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  useStore,
  useMeta,
  useFetch,
  watch,
  reactive,
} from '@nuxtjs/composition-api'
// Interfaces and types
import { VuexModulePartnerProfiles } from '~/types/partnerProfiles'
import { VuexModuleApplications } from '~/types/applications'

export default defineComponent({
  name: 'PartnersPages',
  middleware: 'partner',
  setup() {
    useMeta({ titleTemplate: '%s | Partner Profiles' })
    // store partner profiles
    const storePartnerProfiles = useStore<VuexModulePartnerProfiles>()
    const storeApplications = useStore<VuexModuleApplications>()
    const partnerProfiles = computed(
      () => storePartnerProfiles.state.partnerProfiles.partnerProfiles
    )
    const meta = computed(() => storePartnerProfiles.state.partnerProfiles.meta)
    const pagination = ref({
      ...storeApplications.state.applications.pagination,
    })

    // manage pagination items
    const paginationText = 'items/page'
    const paginationItems = reactive([
      {
        title: `5 ${paginationText}`,
        value: 5,
      },
      {
        title: `10 ${paginationText}`,
        value: 10,
      },
      {
        title: `15 ${paginationText}`,
        value: 15,
      },
      {
        title: `20 ${paginationText}`,
        value: 20,
      },
      {
        title: `All ${paginationText}`,
        value: -1,
      },
    ])
    const selected = ref('')
    const doShowDetails = (id: string) => {
      selected.value = id
    }
    const onClickOutside = () => {
      selected.value = ''
    }

    watch(
      pagination,
      (newPagination) => {
        storeApplications.commit('applications/SET_PAGINATION', {
          ...newPagination,
        })
      },
      { deep: true }
    )

    useFetch(() => {
      storePartnerProfiles.commit('partnerProfiles/SET_PARTNER_PROFILES', [
        {
          id: '6abf8aa4-f1ed-4bc1-8990-2707f287d778',
          title: 'RayRay Global',
          description:
            'RayRay Global is a portfolio of East Ventures in First Mile and Last Mile logistic services in Indonesia.',
        },
        {
          id: '3b391ee9-42a4-47a3-8fb6-7d6605c7038d',
          title: 'World Asia Logistics',
          description: `World Asia Logistics, a total logistics service provider, was established in 2011. Our main philosophy of existence is not only to make sure that our clients’ cargos get delivered on time – with the help of our team of experts who have more than 20 years of experience – but also to make sure that our service is implemented in the best way possible.
        WAL is moving 650 tonnes and 2,568 monthly. World Asia Express brings you the best one stop solution for handling e-commerce shipments to domestic and international destinations. The commodities can be general shipments to high value items`,
        },
      ])
    })

    return {
      partnerProfiles,
      meta,
      pagination,
      selected,
      paginationItems,
      doShowDetails,
      onClickOutside,
    }
  },
  head: {},
})
</script>
