<template>
  <section class="pa-4 pa-md-10 py-8 l-control">
    <v-card
      elevation="2"
      height="798"
    >
      <div class="header">
        <div
          class="text"
        >
          L-CONTROL
        </div>
      </div>
      <div
        class="body-wrapper border-bottom"
      >
        <div class="country-wrapper">
          <div
            class="text"
          >
            COUNTRY
          </div>
        </div>
        <div class="service-wrapper service-color">
          <div
            class="text"
          >
            SERVICE
          </div>

        </div>
        <div class="zone-wrapper">
          <div
            class="text"
          >
            ZONE
          </div>

        </div>
      </div>
      <div
        class="content-wrapper"
      >
        <div class="country-wrapper-content ">
          <div
            v-for="(el, i) in 20"
            :key="i"
            :class="`text padding-text-country ${ selected.countryIndex === i ? 'service-color' : ''}`"
            @click="indexSelect(i, 'country')"
          >
            <div
              :class="`${selected.countryIndex === i ? 'red-color' : ''}`"
            >
              INDONESIA
            </div>
            <div
              class="text-sub"
            >
              Manually Updated
            </div>
          </div>
        </div>
        <div class="service-wrapper-content service-color">

            <div
              v-for="(el, i) in 3"
              :key="i"
              :class="`text ${selected.serviceIndex === i ? 'red-color' : ''}`"
              :style="`${selected.countryIndex === null ? 'visibility: hidden;' : ''}`"
              @click="indexSelect(i, 'service')"
            >
              First Mile
            </div>
            <v-switch
              v-model="selected.useBOB"
              inset
              color="#FF3D17"
              :style="`${selected.countryIndex === null ? 'visibility: hidden;' : ''}`"
              class="ma-0"
            >
              <template #label>
                <span
                  :style="`color: ${selected.useBOB ? '#FF3D17' : '#1961E4'}; font-weight: 500`"
                >
                  BOB {{selected.useBOB ? 'Activated' : 'Inactive'}}
                </span>
              </template>
            </v-switch>

        </div>
        <div class="zone-wrapper-content">
          <div
            class="text"
          >
            ZONE content
          </div>

        </div>
      </div>
    </v-card>
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
  Ref,
  useMeta,
  useRouter,
  PropType,
} from '@nuxtjs/composition-api'
// Interfaces or types
import { VuexModuleLControls,Definition,Rule,RuleGroup } from '~/types/lControl/lControl'
import { VuexModuleApplications, ModalConfirm } from '~/types/applications'
import { Marketplace, VuexModuleMarketplaces, PartnerServiceZone } from '~/types/marketplace/marketplace'


export default defineComponent({
  name: 'LControl',
  layout: 'default',
  setup() {
    const selected = ref({
      countryIndex: null as number | null,
      serviceIndex: null as number | null,
      useBOB: false as boolean
    })

    const indexSelect = (index: number, type: string) => {
      switch (type) {
        case 'country':
          selected.value.countryIndex = index
          break;
        case 'service':
          selected.value.serviceIndex = index
          break;
        default:
          break;
      }
    }

    return {
      selected,
      indexSelect
    }
  },
  head: {},
})
</script>

<style lang="scss">
@import "~/assets/scss/color.module.scss";
  .l-control {
    .v-card {
      overflow: hidden;
    }
    .header {
      padding: 33px 44px 20px 44px;
      .text {
        color: $primary;
        font-size: 25px;
        line-height: 30px;
      }
    }
    .service-color {
      background: #EDF5FF !important;
    }
    .border-bottom{
      border-bottom: 1px dashed red;
    }
    .body-wrapper{
      display: flex;
      width: 100%;
      padding: 0 44px;
      border-bottom-left-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      /* height: 100%; */
      .text {
        font-size: 20px;
        line-height: 24px;
      }
      .country-wrapper, .service-wrapper {
        min-width: 250px;
      }
      .zone-wrapper {
        width: 100%;
      }
      .country-wrapper, .service-wrapper, .zone-wrapper {
        padding-top: 31px;
        padding-bottom: 23px;
        /* border-bottom: 1px dashed red; */
      }
      .zone-wrapper, .service-wrapper {
        padding-left: 30px;
      }
    }
    .red-color {
      color: #FF3D17;
    }
    .content-wrapper {
      display: flex;
      height: calc(100% - 162px);
      width: 100%;
      /* padding: 0 44px; */
      /* height: 100%; */
      .text {
        font-size: 18px;
        line-height: 22px;
        cursor: pointer;
        transition: all .3s;

        &:hover {
          opacity: .8;
          background: #edf5ff73;
        }



        .text-sub {
          font-size: 15px;
          line-height: 18px;
          margin-top: 15px;
          color: #AAAAAA;
        }
      }
      .padding-text-country {
        min-width: calc(250px + 44px);
        padding: 44px;
      }

      .country-wrapper-content {
        overflow-y: scroll;
      }
      .service-wrapper-content {
        & > * {
          padding: 35px 30px;
          min-width: 250px;
          &:first-child {
            padding-top: 50px;
          }
          &:last-child {
              margin-right: 0px;
          }
        }
      }


    }

  }
</style>
