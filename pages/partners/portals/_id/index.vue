<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseBackButton @doBackTo="doBackTo" />

    <v-row>
      <v-col cols="12">
        <h2 class="headline font-weight-bold">{{ partnerDetails.title }}</h2>
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useRoute,
  useRouter,
  useStore,
  useFetch,
  useMeta,
} from '@nuxtjs/composition-api'
// Interfaces and types
import {
  VuexModulePartnerProfiles,
  PartnerDetail,
} from '~/types/partnerProfiles'

export default defineComponent({
  name: 'PartnerDetailsPages',
  middleware: 'partner',
  setup() {
    const route = useRoute()
    const router = useRouter()

    // store manage
    const storePartnerProfiles = useStore<VuexModulePartnerProfiles>()
    const partnerDetails = computed(
      () => storePartnerProfiles.state.partnerProfiles.profileDetails
    )

    const doBackTo = () => {
      router.go(-1)
    }

    useFetch(() => {
      storePartnerProfiles.commit('partnerProfiles/SET_PARTNER_PROFILES', [
        {
          id: '6abf8aa4-f1ed-4bc1-8990-2707f287d778',
          title: 'RayRay Global',
          description:
            'RayRay Global is a portfolio of East Ventures in First Mile and Last Mile logistic services in Indonesia.',
        },
        {
          id: '3b391ee9-42a4-47a3-8fb6-7d6605c7038d',
          title: 'World Asia Logistics',
          description: `World Asia Logistics, a total logistics service provider, was established in 2011. Our main philosophy of existence is not only to make sure that our clients’ cargos get delivered on time – with the help of our team of experts who have more than 20 years of experience – but also to make sure that our service is implemented in the best way possible.
        WAL is moving 650 tonnes and 2,568 monthly. World Asia Express brings you the best one stop solution for handling e-commerce shipments to domestic and international destinations. The commodities can be general shipments to high value items`,
        },
      ])

      const partnerDetails =
        storePartnerProfiles.state.partnerProfiles.partnerProfiles.find(
          (partner: PartnerDetail) => partner.id === route.value.params.id
        )

      storePartnerProfiles.commit(
        'partnerProfiles/SET_PROFILE_DETAILS',
        partnerDetails
      )
    })

    useMeta(() => ({
      title: `Partner Portal | ${partnerDetails?.value.title || ''}`,
    }))

    return {
      partnerDetails,
      doBackTo,
    }
  },
  head: {},
})
</script>
