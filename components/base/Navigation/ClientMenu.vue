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
            :style="{ whiteSpace: mini ? 'unset' : '' }"
          >
            Client Portal
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
        <BaseNavigationListItem :key="index" :items="menu" />
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
      { title: 'Orders', icon: '$order', to: '/orders' },
      { title: 'Marketplace', icon: '$marketplace', to: '/marketplace' },
      { title: 'L-Control', icon: 'mdi-target', to: '/lControl' },
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
