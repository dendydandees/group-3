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
        <BaseSearchFieldCustom v-model="filter.search" />
      </v-col>
    </v-row>
    <v-row
      v-if="filter.search"
    >
      <v-col cols="4" md="3">
        <v-select
          :items="items"
          label="Country"
          outlined
          rounded
          dense
          color="blue"
          class="custom-select pb-3"
        >
        </v-select>
        <v-select
          :items="items"
          label="Ports"
          outlined
          rounded
          dense
          color="blue"
          class="custom-select"
        >
        </v-select>
      </v-col>
      <v-col
        align-self="center"
        cols="4"
        md="4"
      >
        <div
          class="red--text font-weight-bold subtitle-2"
        >
          Types
        </div>
        <div>
          <v-chip-group
            v-model="selection"
            active-class="blue accent-4 white--text"

            column
          >
            <v-chip
              v-for="(chip, i) in chips"
              :key="i"
              small
              class="custom-chips"
            >
              First Mile
            </v-chip>

          </v-chip-group>
        </div>
      </v-col>
    </v-row>

    <v-row
      class="mt-6"
    >
      <v-col v-if="!filter.search" cols="12" md="12">
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
        >
          <slide
            v-for="(slide, i) in slides"
            :key="i"
            :index="i"
          >
            <span class="title">Featured Partners #{{i + 1}}</span>
            <p>Ninja Van</p>
          </slide>
        </carousel-3d>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h1 v-if="!filter.search" class="headline font-weight-bold mb-2 text-capitalize">
          Network Partners in<br>
          your area
        </h1>
        <div
          v-else-if="filter.search"
          class="blue--text subtitle-2 pl-1"
        >
          7 RESULTS
        </div>
        <v-container
          fluid
          class="px-0"
        >
          <v-row
          >
            <v-col
              v-for="(partner, u) in nearPartners"
              :key="u"
              cols="3"
              class="d-flex align-center justify-space-between pa-4"
            >
              <v-card
                elevation="1"
                shaped
                tile
                class="pa-4 rounded-xl d-flex flex-column justify-space-between"
                height="175px"
                width="100%"
                color="blue"
              >
                <div>
                  <div
                    class="d-flex justify-end"
                  >
                    <v-btn
                      fab
                      small
                      plain
                      @click="addPartner"
                    >
                      <v-icon
                        dense
                        color="white"
                      >
                        mdi-account-plus
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
                <div>
                  <div
                    class="title white--text"
                  >
                    Ninja Van
                  </div>
                  <div
                    class="pb-2 body-2 white--text aling-center d-flex"
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
                    <v-chip
                      v-for="(mile, i) in miles"
                      :key="i"
                      class="mr-1"
                      color="pink"
                      text-color="white"
                      x-small
                    >
                      {{mile.name}}
                    </v-chip>
                  </div>
                </div>
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
              >
                <v-icon
                  dense
                  color="black"
                >
                  mdi-arrow-left
                </v-icon>
              </v-btn>
            </div>
            <div
              class="px-3"
            >
              3
            </div>
            <div>
              <v-btn
                fab
                small
                plain
              >
                <v-icon
                  dense
                  color="black"
                >
                  mdi-arrow-right
                </v-icon>
              </v-btn>
            </div>
          </div>
        </v-container>
      </v-col>
    </v-row>
    <MarketplaceAddForm
      :dialog="dialog"
      :item="deletedItem"
      @toggle="toggle()"
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
} from '@nuxtjs/composition-api'
// Interfaces or types


export default defineComponent({
  name: 'MarketPlace',
  layout: 'default',
  setup() {
    const slides = 7
    const chips = 6
    const method = reactive({
      opt: 'add'
    })
    const dialog = reactive({
      status: false
    })
    const filter = reactive({
      search: null,
    })
    const yourPartners =reactive([
      1, 2, 3 , 4, 5, 6
    ])
    const nearPartners =reactive([
      1, 2, 3 , 4, 5, 6, 7, 8, 9, 10, 11, 12
    ])
    const miles =reactive([
      {
        name: 'First Mile'
      },
      {
        name: 'Last Mile'
      },
      {
        name: 'Custom Import'
      },
      // {
      //   name: 'Custom Import'
      // },
      // {
      //   name: 'Custom Import'
      // }
    ])
    const toggle = () => {
      if (method.opt === 'add' || method.opt === 'edit') {
        dialog.status = !dialog.status
      }
    }
    const addPartner = () => {
      toggle()
    }
    return {
      filter,
      dialog,
      yourPartners,
      nearPartners,
      miles,
      method,
      toggle,
      addPartner,
      slides,
      chips
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
      padding: 20px;
      background: #48a3ee;
      color: white;
      box-shadow: 0px 0px 40px 0px #36363626;
      &.current {
        background: #2196F3;
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
</style>
