<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseBackButton @doBackTo="doBackTo" />

    <v-row>
      <v-col cols="12"> </v-col>
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
import { VuexModuleProfiles } from '~/types/partnerPortals/profiles'

export default defineComponent({
  name: 'PartnerProfilesEditPages',
  middleware: 'partner',
  setup() {
    useMeta({ titleTemplate: '%s | Edit Partner Profiles' })
    const route = useRoute()
    const router = useRouter()

    // store manage
    const storeProfiles = useStore<VuexModuleProfiles>()
    const profiles = computed(
      () => storeProfiles.state.partnerPortals.profiles.profiles
    )

    const doBackTo = () => {
      router.go(-1)
    }

    useFetch(async () => {
      const id = route.value.params.id
      await storeProfiles.dispatch('partnerPortals/profiles/getProfiles', id)
    })

    return {
      profiles,
      doBackTo,
    }
  },
  head: {},
})
</script>
