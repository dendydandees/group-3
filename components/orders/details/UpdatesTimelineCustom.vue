<template>
  <v-card
    elevation="0"
    :loading="fetchState.pending"
    height="100%"
    class="milestone-wrapper"
  >
    <template slot="progress">
      <v-progress-linear color="primary" height="8" indeterminate />
    </template>

    <BaseLoading v-if="fetchState.pending" />

    <v-expand-transition>
      <v-card-text v-if="!fetchState.pending" class="body-1 pa-6">
        <v-timeline dense>
          <v-timeline-item
            v-for="(el, i) in orderAllocationUpdates"
            :key="i"
            :color="colorByService(el)"
            small
            right
            :class="`pb-14`"
          >
            <template #opposite>
              <div>
                <div style="font-size: 16px; line-height: 27px">
                  <!-- 17:05 -->
                  {{
                    el.externalTracking.partnerUpdates &&
                    el.externalTracking.partnerUpdates.CreatedAt
                      ? parseDateTime({
                          data: el.externalTracking.partnerUpdates.CreatedAt,
                          isTime: true,
                        })
                      : '-'
                  }}
                </div>
                <div style="font-size: 16px; line-height: 27px">
                  <!-- Tue, Mar 15, 2022 -->
                  {{
                    el.externalTracking.partnerUpdates &&
                    el.externalTracking.partnerUpdates.CreatedAt
                      ? parseDateTime({
                          data: el.externalTracking.partnerUpdates.CreatedAt,
                        })
                      : '-'
                  }}
                </div>
              </div>
            </template>
            <div class="d-flex justify-space-between">
              <div class="right-text-info" style="max-width: 300px">
                <div
                  style="font-size: 18px; line-height: 23px"
                  class="mb-3 top"
                >
                  <!-- Delivered to Customer Panjangggggggg -->
                  {{
                    el.externalTracking.partnerUpdates &&
                    el.externalTracking.partnerUpdates.Status
                      ? el.externalTracking.partnerUpdates.Status
                      : '-'
                  }}
                </div>
                <div
                  class="bottom"
                  style="font-size: 16px; line-height: 20px; color: #afafaf"
                >
                  <!-- Order has been received by customer -->
                  {{
                    el.externalTracking.partnerUpdates &&
                    el.externalTracking.partnerUpdates.Comments
                      ? el.externalTracking.partnerUpdates.Comments
                      : '-'
                  }}
                </div>
              </div>
              <div
                v-if="validationDiffService(el, i)"
                class="appent-text"
                style="font-size: 23px; line-height: 25px"
              >
                <div :class="`top ${colorByService(el)}--text`">
                  {{ $customUtils.setServiceType(el.serviceType) }}
                </div>
                <div class="bottom">By {{ el.partnerName }}</div>
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
import moment from 'moment'
import { VuexModuleOrders } from '~/types/orders'
import { VuexModuleIncomingOrders } from '~/types/partnerPortals/incomingOrders'
// import tempData from '~/static/tempData'

export default defineComponent({
  props: {
    fetchState: {
      type: Object,
      default: () => ({}),
    },
    isUpcoming: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore<VuexModuleOrders>()
    const storeIncomingOrders = useStore<VuexModuleIncomingOrders>()
    const reqServiceType = computed(() => {
      return props.isUpcoming
        ? storeIncomingOrders.state.partnerPortals?.incomingOrders
            ?.incomingOrderDetails?.order?.order?.requestedServices
        : // tempData.detailUpcomingOrder.timeline
          ''
    })
    const orderAllocationUpdates = computed(() => {
      return props.isUpcoming
        ? // storeIncomingOrders.state.partnerPortals.incomingOrders.incomingOrderDetails.order.allocation
          onlyReqServiceTypeData(
            storeIncomingOrders.state.partnerPortals.incomingOrders
              .incomingOrderDetails.order.allocation
          )
        : // tempData.detailUpcomingOrder.timeline
          store.state.orders.orderDetails.orderAllocationUpdates
    })

    function onlyReqServiceTypeData(data: any) {
      let filteredData = []
      if (reqServiceType.value) {
        filteredData = [...data].filter(
          (el: any) => el.serviceType === reqServiceType.value
        )
      }
      return filteredData
    }

    const colorByService = (el: any) => {
      switch (el.serviceType) {
        case 'FIRST_MILE':
          return 'primary'
        case 'LAST_MILE':
          return 'purple'
        case 'CUSTOMS':
          return 'green'
        case 'FREIGHT_FORWARDER':
          return 'secondary'
        default:
          return 'primary'
      }
    }

    const parseDateTime = (payload: { data: any; isTime?: boolean }) => {
      let temp = ''
      if (payload.isTime) {
        temp = moment(payload.data).format('HH:mm')
      } else {
        temp = moment(payload.data).format('ddd, MMM DD, YYYY')
      }
      return temp
    }

    const validationDiffService = (el: any, i: number) => {
      return (
        el.serviceType !==
        (orderAllocationUpdates.value[i - 1] &&
          orderAllocationUpdates.value[i - 1].serviceType &&
          orderAllocationUpdates.value[i - 1].serviceType)
      )
    }

    // console.log(tempData.detailUpcomingOrder.timeline)

    return {
      orderAllocationUpdates,
      colorByService,
      validationDiffService,
      parseDateTime,
    }
  },
})
</script>

<style lang="scss">
@import '~/assets/scss/color.module.scss';

.milestone-wrapper {
  .v-timeline--dense .v-timeline-item__opposite {
    display: inline-block;
    min-width: 150px;
  }

  .v-timeline-item__opposite {
    flex: none;
    align-self: flex-start;
    text-align: end;
  }

  /* line */
  .v-application--is-ltr,
  .v-timeline--dense:not(.v-timeline--reverse):before {
    left: 189px !important;
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
    // .bottom {
    // }
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
