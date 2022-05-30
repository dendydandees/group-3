<template>
  <section class="base">
    <BaseNavigationAppBarGuest />

    <article class="pt-10 primary" style="height: 100vh">
      <v-container class="pb-0">
        <v-row class="white--text" align="center" justify="center">
          <v-col cols="12" md="6" class="text-center">
            <div class="mb-15">
              <h1 class="display-1 font-weight-bold mb-4">
                Luwjistik Tracking Platform
              </h1>

              <span class="font-weight-thin">
                Track your shipments in one place.
              </span>
            </div>

            <div>
              <ValidationObserver
                ref="trackFormObserver"
                v-slot="{ invalid }"
                tag="form"
                @submit.stop.prevent="doTracking"
              >
                <v-row no-gutters justify="center" align="center">
                  <v-col cols="12">
                    <!-- track field -->
                    <ValidationProvider
                      slim
                      name="Tracking Number"
                      rules="required"
                      tag="div"
                      class="mb-2"
                    >
                      <v-text-field
                        v-model="form.orderId"
                        background-color="white"
                        label="ENTER TRACKING NUMBER"
                        placeholder="Enter your tracking number..."
                        class="orderId text-center"
                        required
                        outlined
                        rounded
                        single-line
                      />
                    </ValidationProvider>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-btn
                      block
                      x-large
                      rounded
                      color="secondary"
                      type="submit"
                      class="my-4"
                      :disabled="invalid"
                      :loading="isLoading.tracks"
                    >
                      Track My Shipment
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row v-if="alert.isShow" justify="center" align="center">
                  <v-col cols="12" md="6">
                    <v-alert :type="alert.type" rounded="xl">
                      {{ alert.message }}
                    </v-alert>
                  </v-col>
                </v-row>
              </ValidationObserver>
            </div>
          </v-col>

          <v-col cols="12" md="6" class="d-none d-md-block pb-0">
            <NuxtImg
              src="/images/track-and-trace/tracking-img.png"
              format="webp"
              preload
              class="pr-15"
              style="transform: scaleX(-1); width: 100%"
            />
          </v-col>
        </v-row>
      </v-container>
    </article>
  </section>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  Ref,
  ref,
  useMeta,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
// types
import { Alert, VForm, VuexModuleApplications } from '~/types/applications'
import { VuexModuleTracking } from '~/types/trackings'

export default defineComponent({
  name: 'TrackingIndexPages',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  layout: 'guest',
  setup() {
    // manage meta
    useMeta(() => ({ title: `Client Portal | Tracking` }))

    // manage route
    const router = useRouter()

    // manage store
    const storeOfApplications = useStore<VuexModuleApplications>()
    const storeTracking = useStore<VuexModuleTracking>()
    const alert = computed(
      () => storeOfApplications.state.applications.alert
    ) as ComputedRef<Alert>
    const setAlert = (value: Alert) => {
      storeOfApplications.commit('applications/SET_ALERT', value)
    }
    const resetAlert = () => {
      storeOfApplications.commit('applications/RESET_ALERT')
    }

    // manage form
    const isLoading = ref({
      tracks: false,
    })
    const form = ref({
      orderId: '',
    })
    const trackFormObserver = ref(null) as unknown as Ref<VForm>
    const doTracking = async () => {
      try {
        isLoading.value.tracks = true
        resetAlert()

        const response = await storeTracking.dispatch(
          'trackings/getTrackingOrder',
          {
            orderId: form.value.orderId,
          }
        )

        // eslint-disable-next-line no-prototype-builtins
        if (!response.hasOwnProperty('clientName')) throw response

        setTimeout(() => {
          router.push(`/tracking/${form.value.orderId}`)
        }, 1500)
      } catch (error) {
        setAlert({
          isShow: true,
          type: 'error',
          message: `Cannot find a order with code ${form.value.orderId}!`,
        })
      } finally {
        setTimeout(() => {
          isLoading.value.tracks = false
        }, 1500)
      }
    }

    return {
      // manage store
      alert,
      // manage form
      isLoading,
      form,
      trackFormObserver,
      doTracking,
    }
  },
  head: {},
})
</script>

<style lang="scss">
label.v-label.theme--light {
  text-align: center !important;
  display: block !important;
  width: 100% !important;
  left: 50% !important;
  transform: translateX(-50%);
  &.v-label--active {
    transform: translateY(-18px) scale(0.75) translateX(-50%);
  }
}
</style>
