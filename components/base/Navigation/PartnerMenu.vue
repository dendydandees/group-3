<template>
  <div>
    <v-divider />

    <v-list nav dense class="py-4 px-4">
      <v-slide-x-transition hide-on-leave>
        <v-subheader v-if="!mini" class="text-uppercase">
          Partner Portal
        </v-subheader>
      </v-slide-x-transition>

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
import { defineComponent, ref, Ref, PropType } from '@nuxtjs/composition-api'
// Interfaces and types
import { NavigationLinks } from '~/types/applications'

export default defineComponent({
  props: {
    mini: {
      type: Boolean as PropType<Boolean>,
      required: true,
    },
  },
  setup() {
    const partnerMenus = ref([
      {
        title: 'Incoming Orders',
        icon: 'mdi-file-clock',
        to: `/partners/portals/incoming-orders`,
      },
      {
        title: 'Client Connections',
        icon: 'mdi-power-plug',
        to: `/partners/portals/client-connections`,
      },
      {
        title: 'Edit Profile',
        icon: 'mdi-account-cog',
        to: '/partners/profiles',
      },
    ]) as Ref<NavigationLinks[]>

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
