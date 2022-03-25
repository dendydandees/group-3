<template>
  <section class="pa-4 pa-md-10 py-8 l-control">
    <v-card
      elevation="2"
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
            <v-breadcrumbs
              :items="breadcrumbs"
              divider=">"
              class="pa-0"
            >
              <template #item="{ item }">
                <v-breadcrumbs-item
                  :href="item.href"
                  :disabled="item.disabled"
                  :class="`${!item.first ? 'active-bread' : ''}`"
                >
                  {{ item.text.toUpperCase() }}
                </v-breadcrumbs-item>
              </template>
            </v-breadcrumbs>
            <!-- ZONE
            <span>
              <v-icon
                large
                color="black"
              >
                mdi-menu-left
              </v-icon>
              <span>
                KUALA LUMPUR
              </span>
            </span> -->
          </div>

        </div>
      </div>
      <div
        class="content-wrapper"
      >
        <div class="country-wrapper-content scroller">
          <div
            v-for="(el, i) in 20"
            :key="i"
            :class="`text padding-text-country ${ selected.countryIndex && selected.countryIndex.index === i ? 'service-color' : ''}`"
            @click="indexSelect({index: i, value: ''}, 'country')"
          >
            <div
              :class="`${selected.countryIndex && selected.countryIndex.index === i ? 'red-color' : ''}`"
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
        <div class="service-wrapper-content service-color scroller blue-scroller">

            <div
              v-for="(el, i) in 3"
              :key="i"
              :class="`text ${selected.serviceIndex && selected.serviceIndex.index === i ? 'red-color' : ''} ${selected.useBOB ? 'disabled' : ''}`"
              :style="`${selected.countryIndex === null ? 'visibility: hidden;' : ''}line-height: 36px`"
              @click="indexSelect({index: i, value: ''}, 'service')"
            >
              First Mile
            </div>
            <div
              v-if="selected.countryIndex !== null"
            >
              <v-switch
                v-model="selected.useBOB"
                inset
                color="#FF3D17"
                :style="`${selected.countryIndex === null ? 'visibility: hidden;' : ''}`"
                class="ma-0"
              >
                <template #label>
                  <span
                    :style="`color: ${selected.useBOB ? '#FF3D17' : '#1961E4'}; font-weight: 500;white-space: nowrap`"
                  >
                    BOB {{selected.useBOB ? 'Activated' : 'Inactive'}}
                  </span>
                  <NuxtImg
                    src="/images/qMark.svg"
                    preload
                    :height="18"
                    class="ml-2"
                  />
                </template>
              </v-switch>
              <v-card
                class="pa-4"
                elevation="3"
                style="height: 100%;"
              >
                <div
                  class="d-flex align-center mb-3"
                >
                  <NuxtImg
                    src="/images/qMark.svg"
                    preload
                    :height="18"
                    class="mr-1 "
                  />
                  <span
                    style="color: #FF3D17;font-size: 13px;line-height: 16px;"
                  >
                    What is BOB?
                  </span>
                </div>
                <div
                  style="color: #1961E4;font-size: 14px;line-height: 17px;"
                >
                  BOB will help you select the most suitable network partner based on our analytical data
                </div>
              </v-card>
            </div>

        </div>
        <div
          :class="`zone-wrapper-content ${selected.useBOB ? 'd-flex align-center justify-center' : ''} scroller`"
        >
          <div
            v-if="selected.zoneIndex === null && !selected.useBOB"
            :class="`zone-text`"
          >
            <div
              v-for="(el, i) in 5"
              :key="i"
              :class="`text`"
              :style="`${selected.serviceIndex === null ? 'visibility: hidden;' : ''}`"
            >
              <div
                :class="`d-flex align-center justify-space-between`"
              >
                <div>
                  Kuala Lumpur
                </div>
                <div>
                  <span
                    v-if="true"
                    style="font-size: 15px; line-height: 18px; color: #575757"
                  >
                    Waiting for Setup
                  </span>
                  <v-btn
                    color="primary darken-1 white--text ml-6"
                    @click="indexSelect({index: i, value: '', name: 'kUALA lUMPUR'}, 'zone')"
                  >
                    {{false ? 'SETUP' : 'UPDATE'}}
                  </v-btn>

                </div>
              </div>

            </div>
          </div>
          <div
            v-else-if="selected.useBOB"
            :class="`d-flex flex-column align-center justify-center`"
            style="width: 400px"
          >
            <!-- <div> -->
              <NuxtImg
                src="/images/BOB.svg"
                preload
                :width="400"
                class="mb-4"
              />
              <div
                style="text-align: center; font-size: 14px; line-height: 20px;"
              >
                BOB is Luwjistik’s own in-house tool that simplifies your shipping process by giving you a fixed end-to-end rate instead of a modular rate. Using our machine learning we will automatically choose the best freight forwarder, custom broker and last mile provider for needs. With BOB, you would not need to connect to different partners in multiple countries as we will do that on your behalf.
              </div>
            <!-- </div> -->
          </div>
          <div
            v-else
            class="content-zone-selected"
          >
            <v-btn
              icon
              color="primary"
              @click="backBtnHandler()"
            >
              <v-icon>
                mdi-arrow-left-thick
              </v-icon>
            </v-btn>
            <div
              class="zone-column-right"
            >
              <div>
                <div
                  style="line-height: 36px;font-size: 18px;font-weight: 700;"
                  class="mb-3"
                >
                  {{selected.zoneIndex && selected.zoneIndex.name}}
                </div>
                <LcontrolDropdownCustom
                  :label="'Zone Default Network Partner'"
                  :placeholder="'Default Partner'"
                  :data="[]"
                  :item-show="{text: 'name', value: 'id'}"
                />
              </div>
              <v-btn
                color="primary darken-1 white--text"
                style="align-self: end"
              >
                SAVE CHANGES
              </v-btn>

            </div>
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
  onUnmounted
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
      countryIndex: null as {index: number, value: string} | null,
      serviceIndex: null as {index: number, value: string} | null,
      zoneIndex: null as {index: number, value: string, name?: string} | null,
      useBOB: false as boolean
    })

    const breadcrumbs = ref([
      {
        text: 'ZONE',
        disabled: false,
        first: true
        // href: 'breadcrumbs_dashboard',
      },
    ]) as Ref<{text?: string, disabled: boolean, first?: boolean, href?: string}[]>

    const indexSelect = (data:{index: number, value: string, name?: string}, type: string) => {
      switch (type) {
        case 'country':
          selected.value.countryIndex = {index: data.index, value: data.value}
          // FETCH SERVICE if vuex is still empty
          break;
        case 'service':
          selected.value.serviceIndex = {index: data.index, value: data.value}
          // FETCH ZONE BY COUNTRY
          break;
        case 'zone':
          selected.value.zoneIndex = {index: data.index, value: data.value, name: data.name}
          breadcrumbs.value = [...breadcrumbs.value, {
            text: data.name,
            disabled: false,
            // href: 'breadcrumbs_link_1',
          }]
          // FETCH PARTNER BY COUNTRY, SERVICE, ZONE
          break;
        default:
          break;
      }
    }

    const { $fetchState, fetch } = useFetch(async () => {
      // FETCH COUNTRY
    })


    const backBtnHandler = () => {
      selected.value.zoneIndex = null
      breadcrumbs.value = [breadcrumbs.value[0]]
    }

    onUnmounted(() => {
      // DELETE SERVICE ON VUEX
    })

    watch(
      () => [selected.value.useBOB],
      ([newUseBOB]) => {
        if(newUseBOB) {
          breadcrumbs.value = [breadcrumbs.value[0]]
          selected.value.zoneIndex = null
          selected.value.serviceIndex = null
        }
      },
      { deep: true }
    )

    watch(
      () => [selected.value.countryIndex],
      ([newCountryIndex]) => {
        if(newCountryIndex !== null) {
          breadcrumbs.value = [breadcrumbs.value[0]]
          selected.value.zoneIndex = null
          selected.value.serviceIndex = null
          selected.value.useBOB = false
        }
      },
      { deep: true }
    )

    watch(
      selected,
      (newSelected) => {
        console.log(newSelected)
      },
      { deep: true }
    )

    return {
      selected,
      breadcrumbs,
      indexSelect,
      backBtnHandler
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
      height: calc(100vh - 144px);;
      max-height: 798px;
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
        font-weight: 500;
      }
      .country-wrapper, .service-wrapper {
        min-width: 250px;
      }
      .zone-wrapper {
        width: 100%;
        .v-breadcrumbs {
          li {
            font-size: 20px;
            line-height: 24px;
          }
          .active-bread {
            color: $primary;
          }
        }
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
      .disabled {
        pointer-events: none;
        opacity: .4;
        cursor: not-allowed;
      }
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
        padding: 40px 44px;
      }

      .scroller {
          &::-webkit-scrollbar {
              width: .2em; /* counts only for the vertical scrollbar */
              height: .2em; /* counts only for the horizontal scrollbar */
          }
          &::-webkit-scrollbar-thumb {
            background: #c9e1ff;
          }
          &::-webkit-scrollbar-thumb:hover {
            background: $primary;
            opacity: .8;
          }
      }
      .blue-scroller {
          &::-webkit-scrollbar-track {
            background: #EDF5FF;
          }
      }

      .country-wrapper-content {
        min-width: calc(250px + 44px);
        overflow-y: scroll;
      }
      .service-wrapper-content {
          min-width: 250px;
          width: 250px;
          overflow-y: scroll;


      }
      .service-wrapper-content {
        & > * {
          padding: 25px 30px;
          &:first-child {
            padding-top: 50px;
          }
          &:last-child {
              margin-right: 0px;
          }
        }
      }

      .zone-wrapper-content {
        width: 100%;
        overflow-y: scroll;
        .text {
          cursor: unset;
          &:hover {

              opacity: 1;
              background: unset;
          }

        }
        .zone-text {
          & > * {
            padding: 25px 30px;
            &:first-child {
              padding-top: 50px;
            }
            &:last-child {
                margin-right: 0px;
            }
          }
        }
        .content-zone-selected {
          height: 100%;
          padding: 50px 30px;
          display: flex;
          & > * {
            &:first-child {

              margin-right: 15px;
            }
            &:last-child {
                width: 100%;
            }
          }
          .zone-column-right {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
          }
        }
      }


    }

  }
</style>
