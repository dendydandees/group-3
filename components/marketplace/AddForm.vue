<template>
  <div>
    <v-dialog v-model="dialogComp" max-width="258" @click:outside="toggle()">
      <v-card class="rounded-xl pa-6 add-form-marketplace">
        <v-alert v-if="error" rounded="xl" type="error">
          {{ error }}
        </v-alert>
        <div class="header d-flex align-center mb-3">
          <!-- {{data}} -->
          <v-img
            :width="53"
            :height="53"
            :min-height="53"
            :max-height="53"
            :min-width="53"
            :max-width="53"
            class="rounded-circle mr-4 white"
            :src="`data:image/png;base64,${data.logo}`"
            contain
          />
          <div class="header-text" style="font-size: 24px">
            {{ data.name }}
          </div>
        </div>
        <div
          v-if="data.partnerServiceTypes && data.partnerServiceTypes.length > 0"
          class="wrapper-your-partner pt-2"
        >
          <v-row>
            <v-col
              v-for="(x, i) in data.partnerServiceTypes"
              :key="i"
              :cols="`${data.partnerServiceTypes.length % 2 !== 0 && i === data.partnerServiceTypes.length - 1 ? '12' : '6'}`"
              class="pa-1"
            >
              <div
                :class="`chip-custom ${$customUtils.setColorServiceType(
                  x.name,
                  'chip'
                )}`"
                :style="{
                  fontSize: '10px',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '100px',
                  background: 'blue',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  marginRight: i !== 1 ? '11px' : 'unset',
                }"
              >
                <span
                :style="{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }"
                >
                  {{ $customUtils.setServiceType(x.name) }}

                </span>
              </div>
            </v-col>
          </v-row>
        </div>
        <div
          v-if="data.description"
          class="description"
          :style="{
            fontSize: '11px',
            lineHeight: '14px',
            marginTop: '21px',
          }"
        >
          {{ data.description }}
        </div>
        <div class="country-port mt-4 mb-4">
          <div
            v-if="
              data.partnerServiceZones && data.partnerServiceZones.length > 0
            "
            class="country d-flex align-start mb-3"
          >
            <NuxtImg
              src="/images/mapLocation.svg"
              preload
              :style="{
                marginRight: '6px',
                minWidth: '22px',
              }"
            />
            <div class="country-text">
              <div
                :style="{
                  fontSize: '8px',
                  lineHeight: '10px',
                  marginBottom: '6px',
                }"
              >
                COUNTRY OF SERVICE
              </div>
              <div
                class="info-country"
                :style="{
                  fontSize: '11px',
                  lineHeight: '14px',
                }"
              >
                <span>
                  {{ locationMapping(data.partnerServiceZones) }}
                </span>
                <!-- <span v-for="(x, i) in data.partnerServiceZones" :key="i">
                  {{ x.zone_country}}
                  {{ data.partnerServiceZones.length - 1 !== i ? ', ' : '' }}
                </span> -->
              </div>
            </div>
          </div>
          <div v-if="false" class="port d-flex align-start">
            <NuxtImg
              src="/images/portIcon.svg"
              preload
              :style="{
                marginRight: '6px',
                minWidth: '22px',
              }"
            />
            <div class="port-text">
              <div
                :style="{
                  fontSize: '8px',
                  lineHeight: '10px',
                  marginBottom: '6px',
                }"
              >
                PORT OF SERVICE
              </div>
              <div
                class="info-port"
                :style="{
                  fontSize: '11px',
                  lineHeight: '14px',
                }"
              >
                Singapore, Jakarta, Metro Manila, Bangkok, Kuala Lumpur
              </div>
            </div>
          </div>
        </div>
        <div class="btn-connect d-flex justify-center">
          <v-btn
            color="white darken-1 red--text"
            :style="{
              width: '140px',
            }"
            class="custom-connect"
            @click="addConnection()"
          >
            Connect
          </v-btn>
        </div>
        <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="toggle()"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1 white--text"
            @click="addConnection()"
          >
            Connect
          </v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import {
  Marketplace,
  PartnerServiceZone,
} from '~/types/marketplace/marketplace'

// interface FeedbackMessage {
//   alert: boolean
//   type: string
//   message: string | unknown
// }

export default defineComponent({
  props: {
    dialog: {
      type: Object,
      default: () => ({}),
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    error: {
      type: String,
      default: '',
    },
    data: {
      type: Object as PropType<Marketplace | {}>,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const dialogComp = computed({
      get: () => props.dialog.status,
      set: (value: boolean) => emit('input', value),
    })
    const toggle = () => {
      emit('toggle')
      // this.$nuxt.$emit('toggle')
    }
    const addConnection = () => {
      emit('add')
    }
    const locationMapping = (partnerServiceZones: PartnerServiceZone[]) => {
      if (partnerServiceZones && partnerServiceZones.length > 0) {
        const temp = [] as string[]
        partnerServiceZones.forEach(
          (el: { id: string; zone_country: string }) => {
            if (!temp.includes(el.zone_country)) {
              temp.push(el.zone_country)
            }
          }
        )
        return temp.join(', ')
      } else {
        return ''
      }
    }

    // watch(dialogComp, (newDialogComp) => {
    //   console.log({ newDialogComp })
    // })
    // console.log({ dialogComp })
    return {
      toggle,
      dialogComp,
      addConnection,
      locationMapping,
    }
  },
})
</script>
<style lang="scss">
.add-form-marketplace {
  &.v-card {
    background-color: unset !important;
    backdrop-filter: blur(21px) brightness(1.4) !important;
  }
  // .btn-connect {
  // }
}
</style>
