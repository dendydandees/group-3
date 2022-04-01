<template>
  <v-card
    elevation="0"
    :loading="fetchState.pending"
    height="100%"
    class="timeline-wrapper"
  >
    <template slot="progress">
      <v-progress-linear color="primary" height="8" indeterminate />
    </template>

    <BaseLoading v-if="fetchState.pending" />

    <v-expand-transition>
      <v-card-text v-if="!fetchState.pending" class="body-1 pa-6">
        <v-timeline dense>
          <v-timeline-item
            v-for="{
              id,
              serviceType,
              partnerName,
              order: { createdAt },
            } in orderAllocationUpdates"
            :key="id"
            small
            class="mb-10"
            fill-dot
            :color="$customUtils.setColorServiceType(serviceType)"
          >
            <template #opposite>
              <span class="d-block body-2">
                {{ $dateFns.format(createdAt, 'HH:mm') }}
              </span>

              <span class="d-block body-2">
                {{ $dateFns.format(createdAt, 'E, MMM dd, yyyy') }}
              </span>
            </template>

            <v-row justify="space-between" align="start">
              <v-col cols="4">
                <!-- <h4 class="body-1 ma-0 font-weight-bold text--primary">
                  Hub Transfer
                </h4>

                <p class="body-2">
                  Order is being transferred to destination hub
                </p> -->
              </v-col>

              <v-col cols="8" class="text-right py-0">
                <h3
                  class="title text-capitalize"
                  :class="[
                    `${$customUtils.setColorServiceType(serviceType)}--text`,
                  ]"
                >
                  {{ $customUtils.setServiceType(serviceType.toLowerCase()) }}
                </h3>

                <h2 class="title font-weight-medium text--primary">
                  <span>By</span>
                  <span class="font-weight-bold">
                    {{ partnerName }}
                  </span>
                </h2>
              </v-col>
            </v-row>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
// types
import { VuexModuleOrders } from '~/types/orders'
import { VuexModuleIncomingOrders } from '~/types/partnerPortals/incomingOrders'

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
    const orderAllocationUpdates = computed(() => {
      return props.isUpcoming
        ? storeIncomingOrders.state.partnerPortals.incomingOrders
            .incomingOrderDetails.order.allocation
        : store.state.orders.orderDetails.orderAllocationUpdates
    })

    return {
      orderAllocationUpdates,
    }
  },
})
</script>

<style lang="scss">
.timeline-wrapper {
  /* line */
  .v-timeline:before {
    width: 0px !important;
    border: 1px dashed $secondary;
  }

  .v-timeline--dense .v-timeline-item__opposite {
    display: inline-block;
    width: 130px;
  }

  .v-timeline-item__opposite {
    flex: none;
    align-self: flex-start;
    text-align: end;
  }

  /* line */
  .v-application--is-ltr,
  .v-timeline--dense:not(.v-timeline--reverse):before {
    left: calc(9.6rem - 1px) !important;
    height: calc(85%);
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
