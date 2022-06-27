<template>
  <v-dialog v-model="dialog" max-width="800" @click:outside="toggle()">
    <v-card
      class=" timeline-wrapper-bagging pa-6"
      :loading="fetchState.pending"
      height="100%"
    >
      <v-card-title class="text-h5">
        {{dataItem.group_name && dataItem.group_name}}
      </v-card-title>
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
                :key="`${x.id}, ${x.status}`"
                small
                :class="`${data.length - 1 !== i ? 'mb-10' : ''}`"
                fill-dot
                :color="'primary'"
              >
                <template #opposite>
                  <span class="d-block body-2">
                    {{ $dateFns.format(x.update_timestamp, 'HH:mm') }}
                  </span>

                  <span class="d-block body-2">
                    {{ $dateFns.format(x.update_timestamp, 'E, MMM dd, yyyy') }}
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
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@nuxtjs/composition-api'
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
    const dialog = computed({
      get: () => props.value,
      set: (value: boolean) => emit('input', value),
    })
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

    return {
      dialog,
      doClose,
      toggle
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
