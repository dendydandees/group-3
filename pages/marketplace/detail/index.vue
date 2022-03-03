<template>
  <section class="pa-4 pa-md-10 py-8 detail-marketplace">
    <div
      class="top-row d-flex align-center mb-9"
    >
      <div
        class="d-flex align-center mr-8"
      >
        <v-card
          color="blue"
          width="100px"
          height="100px"
          class="rounded-circle mr-4"
        >

        </v-card>
        <div class="profile-text">
          <div
            class="headline font-weight-bold"
          >
            Ninja Van
          </div>
          <v-chip-group
          >
            <v-chip
              small
            >
              FIRST MILE
            </v-chip>
            <v-chip
              small
            >
              FIRST MILE
            </v-chip>

          </v-chip-group>
        </div>
      </div>
      <div class="profile-btn">
        <v-btn
          color="white darken-1 red--text"
          rounded
          class="mr-3"
        >
          Connect with Vendor
        </v-btn>
        <v-btn
          color="white darken-1 red--text"
          rounded
        >
          Add to Compare
        </v-btn>
      </div>
    </div>
    <v-row
      class="middle-row d-flex align-start"
    >
      <v-col
        class="rate d-flex flex-column align-center"
        cols="3"
      >
        <div class="text-star-wrapper">
          <div
            v-for="(u, n) in 4"
            :key="n"
            class="text-star d-flex align-center mb-5"
          >
            <div
              class="mr-3 blue--text"
            >
              Overall
            </div>
            <div>
              <v-icon
                v-for="(x, i) in 5"
                :key="i"
                class="mr-2"
              >
                mdi-decagram
                <!-- mdi-decagram-outline -->
              </v-icon>
            </div>
          </div>
        </div>
        <v-btn
          color="white darken-1 blue--text"
          rounded
        >
          Download Rate Sheet
        </v-btn>
        <v-img
          height="100px"
          width="200px"

          src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
          class="mt-7 rounded-lg"
        >
        </v-img>
        <!-- <div class="logo-image">

        </div> -->
      </v-col>
      <v-col
        class="detailed-info"
      >
        <v-row
          v-for="(y, p) in 8"
          :key="p"
          class="d-flex"
        >
          <v-col
            class="detailed-text font-weight-bold text-no-wrap"
            cols="4"
          >
            Company Brief
          </v-col>
          <v-col class="detailed-description">
            Lorem Ipsum is simply dummy text of the printing
          </v-col>
        </v-row>
      </v-col>
      <v-col class="gallery">
        <div
          class="mb-4 font-weight-bold"
        >
          Gallery
        </div>
        <div>
          <v-card
            color="blue"
            width="100px"
            height="100px"
            class="rounded-circle mr-4"
          />
        </div>
      </v-col>
    </v-row>
    <div class="bottom-row">
      <div class="title-filter blue--text display-1 mb-7">
        Coverage Area
      </div>
      <div
        class="btn-filter-map d-flex align-center"
      >
        <v-select
          :items="[]"
          label="Select Country"
          outlined
          rounded
          dense
          color="blue"
          clearable
          class="custom-select mr-3"
          :full-width="true"
        />
        <v-select
          :items="[]"
          label="Select Port"
          outlined
          rounded
          dense
          color="blue"
          clearable
          class="custom-select mr-3"
        />
        <v-btn
          color="white darken-1 red--text"
          rounded
          class="mr-3"
        >
          Download Coverage Area
        </v-btn>
        <v-btn
          color="white darken-1 red--text"
          rounded
        >
          Download SLA
        </v-btn>
      </div>
    </div>
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
  Ref
} from '@nuxtjs/composition-api'
// Interfaces or types


export default defineComponent({
  name: 'DetailMarketplace',
  layout: 'default',
  setup() {

    return {
    }
  },
  head: {},
})
</script>

<style lang="scss">
  .detail-marketplace {
    .custom-select {
      max-width: 200px;
      .v-input__slot {
        margin-bottom: 0px;
      }
      .v-text-field__details {
        display: none;
      }
    }
  }
</style>
