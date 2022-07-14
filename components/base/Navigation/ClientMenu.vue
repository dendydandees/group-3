<template>
  <v-list nav class="pt-8 px-0">
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
            :class="[mini ? 'subtitle-2' : '']"
            :style="{ whiteSpace: mini ? 'unset' : '' }"
          >
            All of the ideas
          </v-list-item-title>
        </v-list-item-content>
      </template>

      <template v-if="!mini">
        <template v-for="(menu, index) in clientMenu">
          <BaseNavigationListItem :key="index" :items="menu" class="px-6" />
        </template>
      </template>
    </v-list-group>

    <template v-if="mini">
      <template v-for="(menu, index) in clientMenu">
        <BaseNavigationListItem :key="index" :items="menu" :mini="mini" />
      </template>
    </template>
  </v-list>
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
  setup(_props, { emit }) {
    const clientMenu = ref([
      { title: 'Idea 1', icon: '$dashboard', to: '/group-3/idea-1' },
      { title: 'Idea 2', icon: '$dashboard', to: '/group-3/idea-2' },
      // { title: 'Dashboard', icon: '$dashboard', to: '/dashboard' },
      // { title: 'Orders', icon: '$order', to: '/orders' },
      // { title: 'Marketplace', icon: '$marketplace', to: '/marketplace' },
      // { title: 'L-Control', icon: '$lControl', to: '/lControl' },
      // { title: 'Bagging', icon: 'mdi-bag-suitcase-outline', to: '/bagging' },
    ]) as Ref<NavigationLinks[]>
    const isGroupShown = ref(true)

    const doShowGroup = () => {
      isGroupShown.value = !isGroupShown.value
      emit('hideMiniSideNav')
    }

    return {
      clientMenu,
      isGroupShown,
      doShowGroup,
    }
  },
})
</script>
