<template>
  <v-app>
    <BaseNavigationDrawer
      v-model="drawer"
      :mini="mini"
      @hideMiniSideNav="hideMiniSideNav"
      @doShowSideNav="doShowSideNav"
    />

    <BaseNavigationAppBar :mini="mini" @doShowSideNav="doShowSideNav" />

    <v-main class="base">
      <Nuxt class="main-content" />
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        offset-x
        :nudge-width="200"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            :key="'mdi-pencil'"
            :color="'primary'"
            fab
            large
            dark
            bottom
            fixed
            right
            class="v-btn--example"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>{{'mdi-message-text' }}</v-icon>
          </v-btn>
        </template>

        <v-card
          width="800px"
        >
          <ChatPackageAdvancedChatWindow />
        </v-card>
      </v-menu>

      <BaseNavigationFooter />
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

    // handle sidenav
    const drawer = ref(!context.$vuetify.breakpoint.mobile) as Ref<boolean>
    const mini = ref(false) as Ref<boolean>
    const menu = ref(false) as Ref<boolean>
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
      menu,
      doShowSideNav,
      hideMiniSideNav,
    }
  },
})
</script>

<style lang="scss">
.main-content {
  margin-bottom: 35rem;
}

@media only screen and (min-width: 1024px) {
  .main-content {
    margin-bottom: 20rem;
  }
}
</style>
