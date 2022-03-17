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
            {{detailMarketplace.name}}
          </div>
          <v-chip-group
          >
            <v-chip
              v-for="(mile, i) in detailMarketplace.partnerServiceTypes"
              :key="i"
              small
            >
              {{mile.name}}
            </v-chip>

          </v-chip-group>
        </div>
      </div>
      <div class="profile-btn">
        <v-btn
          color="white darken-1 red--text"
          rounded
          class="mr-3 custom-btn-red"
          :disabled="detailMarketplace.status !== 'none'"
          @click="addPartner(detailMarketplace)"
        >
          {{
            detailMarketplace.status === 'none'
            ?
            'Connect with Vendor'
            :
            detailMarketplace.status
          }}
        </v-btn>
        <v-btn
          color="white darken-1 red--text "
          rounded
          class="custom-btn-red"
        >
          Add to Compare
        </v-btn>
      </div>
    </div>
    <v-row
      class="middle-row d-flex align-start mb-16"
    >
      <v-col
        class="rate d-flex flex-column align-center"
        cols="3"
      >
        <div class="text-star-wrapper">
          <div
            v-for="(u, n) in tempData.rateDetail"
            :key="n"
            :class="`text-star d-flex align-center ${tempData.rateDetail.length - 1 !== n ? 'mb-3' : ''}`"
          >
            <v-col
              class="mr-3 blue--text"
              cols="3"
            >
              {{u.name}}
            </v-col>
            <v-col>
              <NuxtImg
                v-for="(x, i) in u.rate"
                :key="i"
                class="mr-2"
                src="/images/star-detail.svg"
                height="21.4"
                preload
              />
            </v-col>
          </div>
        </div>
        <v-btn
          color="white darken-1 blue--text"
          rounded
          class="my-13 btn-rate-sheet custom-btn-blue"
        >
          Download Rate Sheet
        </v-btn>
        <NuxtImg
          src="/images/logo-detail.svg"
          width="290"
          preload
        />
      </v-col>
      <v-col
        class="detailed-info"
        cols="5"
      >
        <v-row
          v-for="(y, p) in tempData.infoDetail"
          :key="p"
          class="d-flex"
        >
          <v-col
            class="detailed-text font-weight-bold text-no-wrap"
            cols="4"
          >
            {{y.name}}
          </v-col>
          <v-col class="detailed-description">

            {{y.desc}}
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
          v-model="selectedZone.value"
          :items="zones"
          item-text="country"
          item-value="country"
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
          class="mr-3 custom-btn-red"
        >
          Download Coverage Area
        </v-btn>
        <v-btn
          color="white darken-1 red--text"
          rounded
          class="custom-btn-red"
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
  useRoute,
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
import { VuexModuleMarketplaces} from '~/types/marketplace/marketplace'
import tempData from '~/static/tempData'
import { VuexModuleFilters, Zone, ServiceType} from '~/types/filters'
import { DetailMarketplace, Gallery} from '~/types/marketplace/detail'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'


export default defineComponent({
  name: 'DetailMarketplace',
  components: {
    PhotoCollageWrapper,
    CoolLightBox
  },
  layout: 'default',
  setup() {
    const route = useRoute()
    const id = computed(() => route.value.params.id)
    // store manage
    const storeDetailMarketplace = useStore<VuexModuleMarketplaces>()
    const storeFilters= useStore<VuexModuleFilters>()
    const detailMarketplace = computed(() => storeDetailMarketplace.state.marketplaces.marketplaces.detail)
    const detailGalleries = computed(() => storeDetailMarketplace.state.marketplaces.marketplaces.galleries)
    // const detailGalleries = ref([]) as Ref<Gallery[]>
    const zones = ref([]) as Ref<Zone[]>

    const selectedZone = reactive ({
      value: ''
    })
    const method = reactive({
      opt: 'add'
    })
    const dialog = reactive({
      status: false
    })
    const idPartner = reactive ({
      value: '' as String,
      name: '' as String
    })

    const collage = {
      gapSize: "1em",
      borderRadius: "1em",
      width: "auto",
      height: ["calc(50vh - 2em)", "calc(50vh - 1em)"],
      layout: [1, 2, 1],
      photos: tempData.photos,
      // photos: detailGalleries.value,
      // photos: storeDetailMarketplace.state.marketplaces.marketplaces.galleries,
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
      if(data && data.length > 0) {
        return data.map((el, i) => {
          return el.source
        })

      } else {
        return []
      }
    }

    // action

    const fetchDetail = async (id: string) => {

      try {
        $fetchState.pending = true

        await storeDetailMarketplace.dispatch('marketplaces/marketplaces/getDetail', id)
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const fetchGalleries = async (id: string) => {

      try {
        $fetchState.pending = true

        await storeDetailMarketplace.dispatch('marketplaces/marketplaces/getGalleries', id)
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const fetchServiceZoneOnce = async () => {
      try {
        $fetchState.pending = true

        await storeDetailMarketplace.dispatch('filters/getOnce')
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const toggle = () => {
      if (method.opt === 'add' || method.opt === 'edit') {
        dialog.status = !dialog.status
      }
    }
    const addPartner = (partner: DetailMarketplace) => {
      idPartner.value = partner.id
      idPartner.name = partner.name
      toggle()
    }
    const addConnection = async (id: String) => {
      try {
        $fetchState.pending = true

        await storeDetailMarketplace.dispatch('marketplaces/marketplaces/addConnection', {id})
        dialog.status = false
        fetch()
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    // fetch
    const { $fetchState, fetch } = useFetch(async () => {
      await fetchDetail(id.value)
      await fetchGalleries(id.value)
      await fetchServiceZoneOnce()
      zones.value =  [ ...storeFilters.state.filters.zones]
      // detailGalleries.value = [...storeDetailMarketplace.state.marketplaces.marketplaces.galleries]
    })


    return {
      collage,
      itemClickHandler,
      index,
      showImg,
      silentbox,
      imagesLightBox,
      detailMarketplace,
      addConnection,
      addPartner,
      idPartner,
      dialog,
      toggle,
      zones,
      selectedZone,
      tempData,
      detailGalleries
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
  .text-star-wrapper {
    width: 100%;
  }
  .btn-rate-sheet {
    width: 100%;
  }
  .custom-btn-red {
    transition: all .3s;
    &:hover {
      background: red !important;
      color: white !important;
    }
  }
  .custom-btn-blue {
    transition: all .3s;
    &:hover {
      background: blue !important;
      color: white !important;
    }
  }
  .profile-text {
    .headline {
      max-width: 200px;
    }
  }
</style>
