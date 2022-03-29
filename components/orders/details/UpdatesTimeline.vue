<template>
  <v-card elevation="2" :loading="fetchState.pending" height="100%">
    <template slot="progress">
      <v-progress-linear color="primary" height="8" indeterminate />
    </template>

    <BaseLoading v-if="fetchState.pending" />

    <v-expand-transition>
      <v-card-text v-if="!fetchState.pending" class="body-1 pa-6">
        <v-timeline dense clipped align-top>
          <v-timeline-item
            v-for="update in orderAllocationUpdates"
            :key="update.id"
            small
            class="mb-10"
            fill-dot
            :color="$customUtils.setColorServiceType(update.serviceType)"

          >
            <v-row justify="space-between">
              <v-col cols="auto">
                <h3 class="font-weight-medium subtitle-1">
                  {{ update.partnerName }}
                </h3>

                <p class="ma-0 caption">
                  {{ $customUtils.setServiceType(update.serviceType) }}
                </p>
              </v-col>
              <v-col class="text-right" cols="auto">
                <v-chip
                  small
                  :color="update.externalTrackingNumber ? 'primary' : ''"
                  class="text-right text-uppercase"
                >
                  {{ update.externalTrackingNumber || 'Not submitted' }}
                </v-chip>
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
import { VuexModuleOrders } from '~/types/orders'
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
    const orderAllocationUpdates = computed(
      () => {
        return props.isUpcoming
        ?
        tempData.detailUpcomingOrder.timeline
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
.v-timeline:before {
  width: 0px !important;
  border: 1px dashed $secondary;
}
</style>
