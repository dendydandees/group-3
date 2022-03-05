<template>
  <v-app>
    <BaseNavigationDrawer
      v-model="drawer"
      :mini="mini"
      @hideMiniSideNav="hideMiniSideNav"
    />

    <BaseAppBar :mini="mini" @doShowSideNav="doShowSideNav" />

    <v-main class="base">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, useContext, ref, Ref } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'DefaultLayout',
  middleware: 'auth',
  setup() {
    const context = useContext()
    const drawer = ref(!context.$vuetify.breakpoint.smAndDown) as Ref<boolean>
    const mini = ref(context.$vuetify.breakpoint.smAndDown) as Ref<boolean>
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
      doShowSideNav,
      hideMiniSideNav,
    }
  },
})
</script>
