<template>
  <v-card elevation="0" :loading="fetchState.pending" height="100%" class="milestone-wrapper">
    <template slot="progress">
      <v-progress-linear color="primary" height="8" indeterminate />
    </template>

    <BaseLoading v-if="fetchState.pending" />

    <v-expand-transition>
      <v-card-text v-if="!fetchState.pending" class="body-1 pa-6">
        <v-timeline
          dense
        >
          <v-timeline-item
            v-for="(el, i) in orderAllocationUpdates"
            :key="i"
            color="primary"
            small
            right
            class="pb-14"
          >
            <template #opposite>
              <div>
                <div
                  style="font-size: 16px;line-height: 27px"
                >
                  <!-- 17:05 -->
                  {{el.time ? el.time : '-'}}
                </div>
                <div
                  style="font-size: 16px;line-height: 27px"
                >
                  <!-- Tue, Mar 15, 2022 -->
                  {{el.time ? el.time : '-'}}
                </div>
              </div>
            </template>
            <div class="d-flex justify-space-between">
              <div
                class="right-text-info"
                style="max-width: 300px"
              >
                <div
                  style="font-size: 18px;line-height: 23px;"
                  class="mb-3 top"
                >
                  <!-- Delivered to Customer Panjangggggggg -->
                  {{el.status ? el.status : '-'}}
                </div>
                <div
                  class="bottom"
                  style="font-size: 16px;line-height: 20px;color: #AFAFAF"
                >
                  <!-- Order has been received by customer -->
                  {{el.desc ? el.desc : '-'}}
                </div>
              </div>
              <div
                v-if="i === 0"
                class="appent-text"
                style="font-size: 23px;line-height: 25px"
              >
                <div
                  class="top primary--text"
                >
                  {{$customUtils.setServiceType(el.serviceType)}}
                </div>
                <div
                  class="bottom"
                >
                  By {{el.partnerName}}
                </div>
              </div>
            </div>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
import { VuexModuleOrders } from '~/types/orders'
import { VuexModuleIncomingOrders } from '~/types/partnerPortals/incomingOrders'
import tempData from '~/static/tempData'

export default defineComponent({
  props: {
    fetchState: {
      type: Object,
      default: () => ({}),
    },
    isUpcoming: {
      type: Boolean,
      default: false,
    }
  },
  setup(props, { emit }) {
    const store = useStore<VuexModuleOrders>()
    const storeIncomingOrders = useStore<VuexModuleIncomingOrders>()
    const orderAllocationUpdates = computed(
      () => {
        return props.isUpcoming
        ?
        storeIncomingOrders.state.partnerPortals.incomingOrders.incomingOrderDetails.order.allocation
        // tempData.detailUpcomingOrder.timeline
        :
        store.state.orders.orderDetails.orderAllocationUpdates
      }
    )

    console.log(tempData.detailUpcomingOrder.timeline)

    return {
      orderAllocationUpdates,
    }
  },
})
</script>

<style lang="scss">
@import "~/assets/scss/color.module.scss";



  .milestone-wrapper {
    .v-timeline--dense .v-timeline-item__opposite {
      display: inline-block;
      min-width: 141.5px;
    }

    .v-timeline-item__opposite {
      flex: none;
      align-self: flex-start;
      text-align: end;
    }

    /* line */
    .v-application--is-ltr, .v-timeline--dense:not(.v-timeline--reverse):before {
      left: 180.5px !important;
      height: calc(100% - 114px);
      margin-top: 3.5px;
    }

    .opposite-width-force {
      display: inline-block;
      width: 95px;
      text-align: right;
    }
    .appent-text {
      text-align: end;
      .top {
        margin-bottom: 30px;
      }
      .bottom {

      }
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
