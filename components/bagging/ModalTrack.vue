<template>
  <v-dialog
    v-model="dialog"
    max-width="800"
    :persistent="mawbInputLoading"
    @click:outside="toggle()"
  >
    <v-card
      class=" timeline-wrapper-bagging pa-6"
      :loading="fetchState.pending"
      height="100%"
    >
      <v-card-title class="text-h5">
        {{dataItem.group_name && dataItem.group_name}}
      </v-card-title>

      <v-row
        class="px-6 py-4"
      >
        <v-col cols="12" md="10" class="px-2 py-4">
          <v-text-field
            v-model="mawbInput"
            outlined
            dense
            rounded
            hide-details
            label="MAWB No"
            placeholder="Enter your MAWB..."
            background-color="white"
            type="search"
            :disabled="mawbInputLoading"
            :loading="mawbInputLoading"
          />
        </v-col>
        <v-col cols="12" md="2" class="px-2 py-4" align-self="center">
          <v-btn
            :loading="mawbInputLoading"
            :disabled="mawbInputLoading || !mawbInput || (dataItem.mawb === mawbInput)"
            color="primary"
            class=""
            width="100%"
            @click="submitMAWB()"
          >
            Submit
          </v-btn>
        </v-col>
      </v-row>
      <div
        v-if="data && data.length"
      >
        <template slot="progress">
          <v-progress-linear color="primary" height="8" indeterminate />
        </template>

        <BaseLoading v-if="fetchState.pending" />

        <v-expand-transition>
          <v-card-text v-if="!fetchState.pending" class="body-1 pa-6">
            <v-timeline dense>
              <template
              >
                <v-timeline-item
                  v-for="(x, i) in data"
                  :key="`${x.id}, ${x.status}, ${i}`"
                  small
                  :class="`${data.length - 1 !== i ? 'mb-10' : ''}`"
                  fill-dot
                  :color="'primary'"
                >
                  <template #opposite>
                    <span class="d-block body-2">
                      <!-- {{ $dateFns.format(x.update_timestamp, 'HH:mm') }} -->
                      {{formatDateTime({data: x.update_timestamp})}}
                    </span>

                    <span class="d-block body-2">
                      <!-- {{ $dateFns.format(x.update_timestamp, 'E, MMM dd, yyyy') }} -->
                      {{formatDateTime({data: x.update_timestamp, isDate: true})}}
                    </span>
                  </template>

                  <v-row justify="space-between" align="start">
                    <v-col :cols="12">
                      <div>
                        <h4
                          class="body-1 ma-0 font-weight-bold text--primary"
                        >
                          {{ x.status }}
                        </h4>

                        <p v-if="x.comments" class="body-2">
                          {{ x.comments }}
                        </p>
                      </div>
                    </v-col>

                    <!-- <v-col
                      cols="8"
                      class="text-right py-0"
                    >
                      <h3
                        class="title text-capitalize"
                      >
                        INI SERVICE TYPE
                      </h3>

                      <h2 class="title font-weight-medium text--primary">
                        <span>By</span>

                        <span class="font-weight-bold">
                          {{
                            serviceType === 'FREIGHT_FORWARDER'
                            ? 'LUWJISTIK'
                            : partnerName
                          }}
                        </span>
                      </h2>
                    </v-col> -->
                  </v-row>
                </v-timeline-item>
              </template>
            </v-timeline>
          </v-card-text>
        </v-expand-transition>
      </div>
      <div
        v-else
      >
        <v-card-text
          class="d-flex justify-center my-10 grey--text font-weight-bold"
        >
          No Data Track
        </v-card-text>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, computed , useContext, ref, useStore, watch} from '@nuxtjs/composition-api'
// Interfaces and types
import { ModalConfirm } from '~/types/applications'
import { VuexModuleDetailBagging, FilterBagging, Unbagged, InputPostBag, BagUpdate, Bagged} from '~/types/bagging/bagging'

export default defineComponent({
  props: {
    value: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    dialogSettings: {
      type: Object as PropType<ModalConfirm>,
      required: true,
    },
    isConfirm:{
      type: Boolean as PropType<boolean>,
      default: false,
    },
    fetchState: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Array as PropType<BagUpdate[] | []>,
      required: true,
    },
    dataItem: {
      type: Object as PropType<Bagged>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { $dateFns, app } = useContext()
    const mawbInput = ref('')
    const mawbInputLoading = ref(false)
    const dialog = computed({
      get: () => props.value,
      set: (value: boolean) => emit('input', value),
    })
    const storeBagging = useStore<VuexModuleDetailBagging>()
    const doClose = () => {
      if(props.isConfirm) {
        emit('doCancel')
      }
      dialog.value = false
    }
    const toggle = () => {
      emit('doHandleModalTrack')
      // this.$nuxt.$emit('toggle')
    }

    function formatDateTime({data, isDate}: {data: string, isDate?: Boolean}) {
      // $dateFns.format(data, 'E, MMM dd, yyyy')
      const date = data.split('T')[0]
      const time = (data.split('T')[1]).split(':00Z')[0]

      if(isDate) {
        return $dateFns.format(date as any, 'E, MMM dd, yyyy')
      } else {
        return time
      }
      // return data
    }

    const fetchMAWBUpdates = async () => {

      try {
        mawbInputLoading.value = true
        await storeBagging.dispatch(
          'bagging/bagging/getMAWBUpdate',
          {
            bagID: props.dataItem.id,
            payload: {mawb: mawbInput.value}
          }
        )
        await fetchBags()
        mawbInputLoading.value = false
      } catch (error) {
        return error
      }
    }

    function submitMAWB() {
      fetchMAWBUpdates()
    }
    async function fetchBags () {

      try {
        await storeBagging.dispatch('bagging/bagging/getBags')
      } catch (error) {
        return error
      }
    }
    watch(
      dialog,
      (newDialog) => {
        if(!newDialog) {

          mawbInput.value = ''
        } else {
          mawbInput.value = props.dataItem.mawb
        }
      },
      { deep: true }
    )

    return {
      dialog,
      doClose,
      toggle,
      formatDateTime,
      mawbInput,
      mawbInputLoading,
      submitMAWB
    }
  },
})
</script>

<style lang="scss">
.timeline-wrapper-bagging {
  /* line */
  .v-timeline:before {
    width: 0px !important;
    border: 1px dashed $secondary;
  }

  .v-timeline--dense .v-timeline-item__opposite {
    display: inline-block !important;
    width: 130px !important;
  }
  .v-timeline--dense .v-timeline-item__body {
    max-width: 50%;
  }

  .v-timeline-item__opposite {
    flex: none;
    align-self: flex-start;
    text-align: end;
  }

  /* line */
  .v-application--is-ltr,
  .v-timeline--dense:not(.v-timeline--reverse):before {
    left: 46.4% !important;
    height: calc(100%);
    margin-top: 8px;
  }

  .v-timeline-item {
    align-items: flex-start;

    .v-timeline-item__divider {
      padding: 3.5px;
      .v-timeline-item__dot {
        background: unset;
        box-shadow: unset;
        height: 20px;
        width: 20px;
        .v-timeline-item__inner-dot {
          height: 20px;
          width: 20px;
          margin: unset;
        }
      }
    }
  }
}
</style>
