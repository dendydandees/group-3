<template>
  <v-app>
    <BaseNavigationDrawer
      v-model="drawer"
      :mini="mini"
      :items="itemLinks"
      @hideMiniSideNav="hideMiniSideNav"
    />

    <BaseAppBar :mini="mini" @doShowSideNav="doShowSideNav" />

    <v-main class="base">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import {
  defineComponent,
  useContext,
  useMeta,
  ref,
  Ref,
} from '@nuxtjs/composition-api'
// Interface and types
import { NavigationLinks } from '~/types/applications'

export default defineComponent({
  name: 'DefaultLayout',
  middleware: 'auth',
  setup() {
    useMeta({ titleTemplate: '%s | Orders' })
    const context = useContext()
    const drawer = ref(!context.$vuetify.breakpoint.smAndDown) as Ref<boolean>
    const mini = ref(!context.$vuetify.breakpoint.smAndDown) as Ref<boolean>
    const itemLinks = ref([
      { title: 'Orders', icon: 'mdi-package', to: '/orders' },
    ]) as Ref<NavigationLinks[]>
    const doShowSideNav = () => {
      const isMobile = context.$vuetify.breakpoint.smAndDown

      if (isMobile) return (drawer.value = !drawer.value)

      return (mini.value = !mini.value)
    }
    const hideMiniSideNav = () => {
      mini.value = false
    }

    return {
      drawer,
      mini,
      itemLinks,
      doShowSideNav,
      hideMiniSideNav,
    }
  },
  head: {},
})
</script>
