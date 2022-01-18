<template>
  <v-app>
    <NavigationDrawer v-model="drawer" :mini="mini" :items="itemLinks" />

    <AppBar :mini="mini" @doShowSideNav="doShowSideNav" />

    <v-main>
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
} from '@nuxtjs/composition-api'
// Components
import NavigationDrawer from '~/components/base/NavigationDrawer.vue'
import AppBar from '~/components/base/AppBar.vue'

export default defineComponent({
  name: 'DefaultLayout',
  components: { NavigationDrawer, AppBar },
  middleware: 'auth',
  setup() {
    useMeta({ titleTemplate: '%s | Orders' })
    const context = useContext()
    const drawer = ref(!context.$vuetify.breakpoint.smAndDown)
    const mini = ref(!context.$vuetify.breakpoint.smAndDown)
    const itemLinks = ref([
      { title: 'Orders', icon: 'mdi-file-table', to: '/' },
    ])
    const doShowSideNav = () => {
      const isMobile = context.$vuetify.breakpoint.smAndDown
      if (isMobile) return (drawer.value = !drawer.value)
      return (mini.value = !mini.value)
    }

    return {
      drawer,
      mini,
      itemLinks,
      doShowSideNav,
    }
  },
  head: {},
})
</script>
