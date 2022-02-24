<template>
  <div>
    <!-- this partners menu divider show only on client portal -->
    <template v-if="!isOnPartnersPortal">
      <v-divider v-if="mini" />

      <div v-else class="d-flex align-center">
        <v-divider />

        <span class="caption mx-4 text--secondary">Partners</span>

        <v-divider />
      </div>
    </template>

    <v-list nav dense class="py-4 px-4">
      <v-list-item
        v-for="(partner, index) in partnerMenus"
        :key="index"
        :to="partner.to"
        link
        nuxt
        :ripple="{ class: `red--text` }"
        active-class="secondary white--text"
        class="rounded-0 my-4"
        @click="$emit('hideMiniSideNav')"
      >
        <v-list-item-icon>
          <v-icon>
            {{ partner.icon }}
          </v-icon>
        </v-list-item-icon>

        <v-list-item-title>
          {{ partner.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  PropType,
  watch,
  useRoute,
  nextTick,
} from '@nuxtjs/composition-api'
// Interfaces and types
import { NavigationLinks } from '~/types/applications'

export default defineComponent({
  props: {
    mini: {
      type: Boolean as PropType<Boolean>,
      required: true,
    },
    isOnPartnersPortal: {
      type: Boolean as PropType<Boolean>,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute()
    const partnerMenus = ref([
      {
        title: 'Partner Profiles',
        icon: 'mdi-account',
        to: '/partners/profiles',
      },
    ]) as Ref<NavigationLinks[]>
    const setPartnerMenus = (isOnPortal: Boolean) => {
      if (isOnPortal) {
        partnerMenus.value.unshift(
          {
            title: 'Incoming Orders',
            icon: 'mdi-file-clock',
            to: `/partners/portals/${route?.value?.params?.id}/incoming-orders`,
          },
          {
            title: 'Client Connections',
            icon: 'mdi-power-plug',
            to: `/partners/portals/${route?.value?.params?.id}/client-connections`,
          }
        )
      } else {
        partnerMenus.value = partnerMenus.value.filter(
          (partner) => partner.title === 'Partner Profiles'
        )
      }
    }

    watch(
      () => props.isOnPartnersPortal,
      (newValue) => {
        setPartnerMenus(newValue)
      }
    )

    nextTick(() => {
      setPartnerMenus(props.isOnPartnersPortal)
    })

    return {
      partnerMenus,
    }
  },
})
</script>

<style lang="scss">
.v-navigation-drawer__border {
  width: 0 !important;
}
</style>
