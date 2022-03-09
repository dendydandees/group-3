<template>
  <v-list nav class="pt-0 px-0">
    <v-list-group
      :value="isGroupShown"
      no-action
      active-class="white--text"
      @click="doShowGroup"
    >
      <template #activator>
        <v-list-item-content>
          <v-list-item-title
            class="text-uppercase text-center"
            :style="{ whiteSpace: mini ? 'unset' : '' }"
          >
            Partner Portal
          </v-list-item-title>
        </v-list-item-content>
      </template>

      <template v-if="!mini">
        <template v-for="(menu, index) in partnerMenus">
          <BaseNavigationListItem :key="index" :items="menu" class="px-6" />
        </template>
      </template>
    </v-list-group>

    <template v-if="mini">
      <template v-for="(menu, index) in partnerMenus">
        <BaseNavigationListItem :key="index" :items="menu" />
      </template>
    </template>
  </v-list>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  PropType,
  useContext,
  computed,
  ComputedRef,
} from '@nuxtjs/composition-api'
// Interfaces and types
import { NavigationLinks } from '~/types/applications'
import { User } from '~/types/login'

export default defineComponent({
  props: {
    mini: {
      type: Boolean as PropType<Boolean>,
      required: true,
    },
  },
  setup(_props, { emit }) {
    const { $auth } = useContext()

    const user = computed(() =>
      $auth.$storage.getUniversal('user')
    ) as ComputedRef<User>
    const partnerId = computed(() => user.value?.partnerProfiles[0]?.partnerId)
    const partnerMenus = ref([
      {
        title: 'Incoming Orders',
        icon: '$order',
        to: `/partner-portals/${partnerId.value}/incoming-orders/`,
      },
      {
        title: 'Client Connections',
        icon: '$clientConnections',
        to: `/partner-portals/${partnerId.value}/client-connections`,
      },
      {
        title: 'Partner Profile',
        icon: '$profile',
        to: `/partner-portals/${partnerId.value}/profiles`,
      },
    ]) as Ref<NavigationLinks[]>
    const isGroupShown = ref(true)

    const doShowGroup = () => {
      isGroupShown.value = !isGroupShown.value
      emit('hideMiniSideNav')
    }

    return {
      partnerMenus,
      isGroupShown,
      doShowGroup,
    }
  },
})
</script>

<style lang="scss">
.v-navigation-drawer__border {
  width: 0 !important;
}
</style>
