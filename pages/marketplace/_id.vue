<template>
  <section class="pa-4 pa-md-10 py-8 detail-marketplace">
    <div class="top-row d-flex align-center mb-9">
      <div class="d-flex align-center mr-8">
        <v-card
          color="transparent"
          width="100px"
          height="100px"
          class="rounded-circle mr-4"

        >
          <v-img
            :aspect-ratio="100 / 100"
            class="rounded-circle"
            :src="`data:image/png;base64,${
              detailMarketplace.logo ? detailMarketplace.logo : ''
            }`"
            contain
            style="border: 3px solid #1961e4"
          >
          </v-img>
        </v-card>
        <div class="profile-text">
          <div class="headline font-weight-bold">
            {{ detailMarketplace.name }}
          </div>
          <v-chip-group
            v-if="
              detailMarketplace.serviceType &&
              detailMarketplace.serviceType.length > 0
            "
          >
            <v-chip
              v-for="(mile, i) in detailMarketplace.partnerServiceTypes"
              :key="i"
              small
            >
              {{ mile.name }}
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
              ? 'Connect with Vendor'
              : detailMarketplace.status
          }}
        </v-btn>
        <!-- <v-btn color="white darken-1 red--text " rounded class="custom-btn-red">
          Add to Compare
        </v-btn> -->
      </div>
    </div>
    <v-row class="middle-row d-flex align-start">
      <v-col class="rate d-flex flex-column align-center" cols="3">
        <div class="text-star-wrapper">
          <div
            v-for="(u, n) in tempData.rateDetail"
            :key="n"
            :class="`text-star d-flex align-center ${
              tempData.rateDetail.length - 1 !== n ? 'mb-3' : ''
            }`"
          >
            <v-col class="mr-3 primary--text" cols="3">
              {{ u.name }}
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
          :disabled="!isRatesAvailable"
          color="white darken-1"
          rounded
          :class="`my-13 btn-rate-sheet custom-btn-primary`"
          @click="handleDownloadNP"
        >
          Download Rate Sheet
        </v-btn>
        <!-- <NuxtImg src="/images/logo-detail.svg" width="290" preload /> -->
      </v-col>
      <v-col class="detailed-info" cols="5">
        <!-- <v-row
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
        </v-row> -->

        <v-row
          v-for="(y, p) in detailProfileHeaderComputed"
          :key="p"
          class="d-flex"
        >
          <v-col class="detailed-text font-weight-bold text-no-wrap" cols="5">
            {{ y.name }}
          </v-col>
          <v-col class="detailed-description">
            <!-- {{y.value}} -->
            {{ convertDetailData(detailMarketplace[y.value]) }}
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4" class="gallery">
        <div class="mb-4 font-weight-bold">Gallery</div>
        <div style="width: 100%">
          <!-- <PhotoCollageWrapper
            v-bind="collage"
            @itemClick="itemClickHandler"
          /> -->
          <MasonryWall
            :items="detailGalleries"
            :ssr-columns="2"
            :column-width="160"
            :gap="8"
          >
            <template #default="{ item, index }">
              <div>
                <NuxtImg
                  v-if="index < 8"
                  :src="item.src"
                  preload
                  width="170px"
                  :style="`borderRadius: 20px;cursor: pointer; marginBottom: 8px`"
                  @click="itemClickHandler(index)"
                />
                <div
                  v-if="index === 8"
                  :style="`padding: 30px 20px ; display: flex; width: 170px; justifyContent: center; borderRadius: 20px;cursor: pointer; backgroundColor: #1961e4; overflow: hidden`"
                  @click="itemClickHandler(index)"
                >
                  <span class="white--text font-weight-bold text-h5">
                    {{ detailGalleries.length - index }} +
                  </span>
                </div>
              </div>
            </template>
          </MasonryWall>
        </div>
      </v-col>
    </v-row>
    <v-row
      v-if="detailMarketplace.companyBrief"
      class="mt-8"
    >
      <v-col
        cols="12"
        md="12"
      >
        <div
          class="font-weight-bold mb-2 title"
        >
          Company Brief
        </div>
        <div
          style="text-align: justify"
        >
          {{detailMarketplace.companyBrief}}
        </div>
      </v-col>
    </v-row>
    <div class="bottom-row  mt-16">
      <div class="title-filter primary--text display-1 mb-2">Coverage Area</div>
      <!-- <div class="btn-filter-map d-flex align-center">
        <v-btn
          color="white darken-1 red--text"
          rounded
          class="mr-3 custom-btn-red"
        >
          Download Coverage Area
        </v-btn>
        <v-btn color="white darken-1 red--text" rounded class="custom-btn-red">
          Download SLA
        </v-btn>
      </div> -->
      <v-row v-if="partnerServiceZones" align="center" class="mt-0">
        <v-col cols="12">
          <BaseTable
            item-key="id"
            :items="partnerServiceZones"
            :headers="headers"
            :options="pagination"
            :loading="$fetchState.pending"
          />
          <!-- @fetch="fetchIncomingOrders" -->
        </v-col>
      </v-row>
    </div>
    <CoolLightBox
      :items="imagesLightBox(detailGalleries)"
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
  Ref,
} from '@nuxtjs/composition-api'
// Interfaces or types
import MasonryWall from '@yeger/vue2-masonry-wall'
// import { PhotoCollageWrapper } from 'vue-photo-collage'
import CoolLightBox from 'vue-cool-lightbox'
import { VuexModuleApplications } from '~/types/applications'
import { VuexModuleMarketplaces } from '~/types/marketplace/marketplace'
import tempData from '~/static/tempData'
import { VuexModuleFilters, Zone } from '~/types/filters'
import { DetailMarketplace } from '~/types/marketplace/detail'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
import partner from '~/middleware/partner'

export default defineComponent({
  name: 'DetailMarketplace',
  components: {
    // PhotoCollageWrapper,
    CoolLightBox,
    MasonryWall,
  },
  layout: 'default',
  setup() {
    const route = useRoute()
    const id = computed(() => route.value.params.id)
    // store manage
    const storeDetailMarketplace = useStore<VuexModuleMarketplaces>()
    const storeApplications = useStore<VuexModuleApplications>()
    const storeFilters = useStore<VuexModuleFilters>()
    const isRatesAvailable = ref(false) as Ref<Boolean>
    const selectedZone = reactive({
      value: '',
    })
    const zones = computed(() => storeFilters.state.filters.zones)
    const detailMarketplace = computed(
      () => storeDetailMarketplace.state.marketplaces.marketplaces.detail
    ) as any
    const partnerServiceZones = computed(() => {
      if (
        detailMarketplace.value &&
        detailMarketplace.value.partnerServiceZones &&
        detailMarketplace.value.partnerServiceZones.length > 0 &&
        zones.value &&
        zones.value.length > 0
      ) {
        const temp1 = [...detailMarketplace.value.partnerServiceZones].map(
          (el) => {
            return {
              countryTable: el.zone_country,
              zoneTable:
                [...zones.value].filter((x) => x.id === el.zone_id)[0]
                  ?.zoneName ?? '',
              slaTable: `${el.sla_from}-${el.sla_to} days`,
              codTable: el.cod,
              color: el.cod ? 'green' : 'error',
            }
          }
        )
        let temp2 = [...zones.value].map((el) => {
          if (
            ![...detailMarketplace.value.partnerServiceZones].some((x) => {
              return el.id === x.zone_id
            }) &&
            temp1.some((y) => y.countryTable === el.country)
          ) {
            return {
              countryTable: el.country,
              zoneTable: el.zoneName,
              slaTable: '',
              codTable: false,
              color: 'error',
            }
          }
        })
        temp2 = temp2.filter((y) => y)
        function compare(a: any, b: any) {
          return (
            a.countryTable.localeCompare(b.countryTable) ||
            b.codTable - a.codTable
          )
        }
        const output = [...temp1, ...temp2].sort(compare)
        let filtered = output
        if (selectedZone.value) {
          filtered = output.filter(
            (el) => el?.countryTable === selectedZone.value
          )
        }
        // console.log({temp2}, [...temp1, ...temp2])
        return filtered
      }
    })
    console.log(partnerServiceZones)
    const detailGalleries = computed(
      () => storeDetailMarketplace.state.marketplaces.marketplaces.galleries
    )
    console.log({ detailGalleries, detailMarketplace })
    // const zones = ref([]) as Ref<Zone[]>

    const detailProfileHeader = reactive([
      // {
      //   name: 'Company Brief',
      //   value: 'companyBrief',
      // },
      // {
      //   name: 'Contact Person',
      //   value: 'contactPerson',
      // },
      // {
      //   name: 'Email',
      //   value: 'emailAddress',
      // },
      // {
      //   name: 'Phone Number',
      //   value: 'phoneNumber',
      // },
      {
        name: 'Code',
        value: 'code',
      },
      {
        name: 'Description',
        value: 'descriptioni',
      },
      {
        name: 'Maximum Dimension',
        value: 'maximumDimension',
      },
      {
        name: 'Maximum Weight',
        value: 'maximumWeight',
      },
      {
        name: 'Pick Up & Drop Off',
        value: 'pikupAndDropOff',
      },
      {
        name: 'Prohibited Item',
        value: 'prohibitedItem',
      },
      {
        name: 'SLA',
        value: 'sla',
      },
    ])
    const detailProfileHeaderComputed = computed(() => {
      return detailProfileHeader.filter(
        (el) =>
          (detailMarketplace.value[
            el.value as keyof typeof detailMarketplace.value
          ] ||
            detailMarketplace.value[
              el.value as keyof typeof detailMarketplace.value
            ] === false) &&
          el
      )
    })
    const method = reactive({
      opt: 'add',
    })
    const dialog = reactive({
      status: false,
    })
    const idPartner = reactive({
      value: '' as String,
      name: '' as String,
    })

    const collage = {
      gapSize: '1em',
      borderRadius: '1em',
      width: 'auto',
      height: ['calc(50vh - 2em)', 'calc(50vh - 1em)'],
      layout: [1, 2, 1],
      // photos: tempData.photos,
      photosMax: detailGalleries.value?.slice(0, 7),
      photos: detailGalleries.value,
      // photos: storeDetailMarketplace.state.marketplaces.marketplaces.galleries,
      showNumOfRemainingPhotos: true,
    }
    const index = ref(null)
    const showImg = (indexInput: any) => {
      index.value = indexInput
    }
    const silentbox = ref(null)
    const itemClickHandler = (
      index: any
      // data: {id: number, source: string}, column: number
    ) => {
      // console.log(tes?.srcElement?.currentSrc)
      // const item = Object.assign({}, data);
      // showImg(item.id)
      showImg(index)
    }

    // START TABLE ZONE COD SLA
    interface Header {
      text: string
      value: string
      sortable?: boolean
    }
    const pagination = ref({
      // ...storeApplications.state.applications.pagination,
      page: 1,
      itemsPerPage: 1000,
    })
    const headers = [
      {
        text: 'Country',
        value: 'countryTable',
        sortable: false,
      },
      {
        text: 'Zone',
        value: 'zoneTable',
        sortable: false,
      },
      {
        text: 'SLA',
        value: 'slaTable',
        sortable: false,
        // width: 150,
      },
      {
        text: 'COD',
        value: 'codTable',
        sortable: false,
        // width: 150,
      },
    ] as Header[]
    // END TABLE ZONE COD SLA

    const imagesLightBox = (data: { src: string }[]) => {
      if (data && data.length > 0) {
        return data.map((el) => {
          return el.src
        })
      } else {
        return []
      }
    }

    // action

    const fetchDetail = async (id: string) => {
      try {
        $fetchState.pending = true

        await storeDetailMarketplace.dispatch(
          'marketplaces/marketplaces/getDetail',
          id
        )
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

        await storeDetailMarketplace.dispatch(
          'marketplaces/marketplaces/addConnection',
          { id }
        )
        dialog.status = false
        fetch()
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const getRatesAvailable = async (id: String) => {
      try {
        $fetchState.pending = true

        const {IsAvailable} = await storeDetailMarketplace.dispatch(
          'marketplaces/marketplaces/getRatesAvailable',
          { partnerID: id }
        )
        isRatesAvailable.value = IsAvailable
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const getRatesDownload = async (id: String) => {
      try {
        $fetchState.pending = true

        const res = await storeDetailMarketplace.dispatch(
          'marketplaces/marketplaces/getRatesDownload',
          { partnerID: id, name: detailMarketplace.value.name + ' rates' }
        )
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    // fetch
    const { $fetchState, fetch } = useFetch(async () => {
      await fetchDetail(id.value)
      await fetchServiceZoneOnce()
      await getRatesAvailable(id.value)
      // zones.value = [...storeFilters.state.filters.zones]
      // detailGalleries.value = [...storeDetailMarketplace.state.marketplaces.marketplaces.galleries]
    })

    function handleDownloadNP() {
      getRatesDownload(id.value)
    }

    const convertDetailData = (data: string | number | boolean) => {
      switch (data) {
        case 0:
          return ''
        case false:
          return 'No'
        default:
          return data
      }
    }

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
      detailGalleries,
      detailProfileHeader,
      convertDetailData,
      detailProfileHeaderComputed,
      // TABLE ZONE COD SLA
      headers,
      pagination,
      partnerServiceZones,
      isRatesAvailable,
      handleDownloadNP
    }
  },
  head: {},
})
</script>

<style lang="scss">
@import '~/assets/scss/color.module.scss';
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
    button[title='Show thumbnails'] {
      display: none;
    }
    button[title='Close'] {
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
  transition: all 0.3s;
  &:hover {
    background: red !important;
    color: white !important;
  }
}
.custom-btn-primary {
  transition: all 0.3s;
  color: $primary !important;
  &:hover {
    background: $primary !important;
    color: white !important;
  }
  &.disabled {
    opacity: .5;
  }
}
.profile-text {
  .headline {
    max-width: 200px;
  }
}
</style>
