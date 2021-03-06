<template>
  <section class="base">
    <BaseNavigationAppBarGuest>
      <template #[`content`]>
        <v-btn
          elevation="2"
          text
          dark
          class="elevation-0"
          tile
          to="/tracking"
          exact
        >
          Shipment Tracking
        </v-btn>
      </template>
    </BaseNavigationAppBarGuest>

    <v-container class="my-4 my-md-10">
      <v-row>
        <v-col cols="12" md="4">
          <BaseLoadingLinear
            v-if="$fetchState.pending"
            title="Getting order tracking..."
          />

          <div v-else>
            <div class="mb-6">
              <h1 class="text-uppercase headline font-weight-bold">Order :</h1>

              <span class="d-block primary--text font-weight-bold">
                {{ orderTracking.orderCode }}
              </span>

              <span class="d-block primary--text font-weight-bold">
                By {{ orderTracking.clientName }}
              </span>
            </div>

            <v-img
              :src="`data:image/png;base64,${orderTracking.clientLogo}`"
              class="d-block"
              style="width: 100%"
            />
          </div>
        </v-col>

        <v-col cols="12" md="8" class="pl-15">
          <UpdatesTimeline :fetch-state="$fetchState" />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useFetch,
  useMeta,
  useRoute,
  useStore,
} from '@nuxtjs/composition-api'
// components
import UpdatesTimeline from '~/components/orders/details/UpdatesTimeline.vue'
// types
import { VuexModuleTracking } from '@/types/trackings'

export default defineComponent({
  components: {
    UpdatesTimeline,
  },
  layout: 'guest',
  setup() {
    // manage meta
    useMeta(() => ({ title: `Client Portal | Tracking Details` }))

    // manage route
    const route = useRoute()
    const id = computed(() => route.value.params.id)

    // manage store
    const storeTracking = useStore<VuexModuleTracking>()
    const orderTracking = computed(() => storeTracking.state.trackings.tracking)

    // manage fetch
    useFetch(async () => {
      await storeTracking.dispatch('trackings/getTrackingOrder', {
        orderId: id.value,
      })
    })

    return {
      orderTracking,
    }
  },
  head: {},
})
</script>
