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
      <v-col class="gallery" cols="5">
        <div
          class="mb-4 font-weight-bold"
        >
          Gallery
        </div>
        <div>
          <PhotoCollageWrapper v-bind="collage" @itemClick="itemClickHandler" />
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
    <CoolLightBox
      :items="imagesLightBox(collage.photos)"
      :index="index"
      :slideshow="false"
      @close="index = null"
    >
    </CoolLightBox>
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
import { PhotoCollageWrapper, } from "vue-photo-collage";
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'


export default defineComponent({
  name: 'DetailMarketplace',
  components: {
    PhotoCollageWrapper,
    CoolLightBox
  },
  layout: 'default',
  setup() {

    const collage = {
      gapSize: "1em",
      borderRadius: "1em",
      width: "auto",
      height: ["calc(50vh - 2em)", "calc(50vh - 1em)"],
      layout: [1, 2, 1],
      photos: [
        {
          source:
            "https://images.unsplash.com/photo-1517088455889-bfa75135412c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e5548929376f93d8b1b7a21097df03bd&auto=format&fit=crop&w=749&q=80",
        },
        {
          source:
            "https://images.unsplash.com/photo-1526656892012-7b336603ed46?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=31c8e58b58c25dfcc18452ed29b52951&auto=format&fit=crop&w=334&q=80",
        },
        {
          source:
            "https://images.unsplash.com/photo-1521024221340-efe7d7fa239b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9ad8a99d809d3fa3a9e8dff3ecc81878&auto=format&fit=crop&w=750&q=80",
        },
        {
          source:
            "https://images.unsplash.com/photo-1523038793606-2fd28f837a85?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=919b76f4229e41416653aeb10e84e94a&auto=format&fit=crop&w=334&q=80",
        },
        {
          source:
            "https://images.unsplash.com/photo-1516832970803-325be7a92aa5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=93d7ac9abad6167aecb49ebd67fd5b6d&auto=format&fit=crop&w=751&q=80",
        },
        {
          source:
            "https://images.unsplash.com/photo-1526938972776-11558ad4de30?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=973795a277e861265b0fabbf4a96afe2&auto=format&fit=crop&w=750&q=80",
        },
        {
          source:
            "https://images.unsplash.com/photo-1464550838636-1a3496df938b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f22dbf6c13ea7c21e803aa721437b691&auto=format&fit=crop&w=888&q=80",
        },
      ],
      showNumOfRemainingPhotos: true,
    }
    const index = ref(null)
    const showImg = (indexInput: any) => {
      index.value = indexInput
    }
    const silentbox = ref(null)
    const itemClickHandler = (data: {id: number, source: string}, column: number) => {
      const item = Object.assign({}, data);
      showImg(item.id)
    }

    const imagesLightBox = (data: {source: string}[]) => {
      return data.map((el, i) => {
        return el.source
      })
    }
    return {
      collage,
      itemClickHandler,
      index,
      showImg,
      silentbox,
      imagesLightBox
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
    .cool-lightbox-toolbar {
      button[title="Show thumbnails"] {
        display: none;
      }
      button[title="Close"] {
        display: none;
      }
    }
    .cool-lightbox__slide__img {
      img {
        border-radius: 20px;
      }
    }
    .cool-lightbox-button__icon {
      border-radius: 20px;
    }
    .cool-lightbox-thumbs {
      display: none;
    }
  }
</style>
