<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseBackButton @doBackTo="doBackTo" />

    <v-row>
      <v-col cols="12">
        <h2 class="headline font-weight-bold">
          Edit {{ partnerDetails.title }}
        </h2>
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  useRouter,
  useRoute,
  useMeta,
  useStore,
  computed,
  useFetch,
} from '@nuxtjs/composition-api'
// Interfaces and types
import {
  VuexModulePartnerProfiles,
  PartnerDetail,
} from '~/types/partnerProfiles'

export default defineComponent({
  name: 'PartnerProfilesEditPages',
  middleware: 'partner',
  setup() {
    useMeta({ titleTemplate: '%s | Edit Partner Profiles' })
    const route = useRoute()
    const router = useRouter()

    // store manage
    const storePartnerDetails = useStore<VuexModulePartnerProfiles>()
    const partnerDetails = computed(
      () => storePartnerDetails.state.partnerProfiles.profileDetails
    )

    const doBackTo = () => {
      router.go(-1)
    }

    useFetch(() => {
      const partner =
        storePartnerDetails.state.partnerProfiles.partnerProfiles.find(
          (partner: PartnerDetail) => partner.id === route.value.params.id
        )
      storePartnerDetails.commit('partnerProfiles/SET_PROFILE_DETAILS', partner)
    })

    return {
      partnerDetails,
      doBackTo,
    }
  },
  head: {},
})
</script>
