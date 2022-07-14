<template>
  <v-app-bar
    id="app-bar-custom"
    app
    color="transparent"
    outlined
    tile
    elevation="0"
  >
    <v-app-bar-nav-icon
      v-if="$vuetify.breakpoint.mobile"
      @click.stop="$emit('doShowSideNav')"
    >
      <v-icon> mdi-menu </v-icon>
    </v-app-bar-nav-icon>

    <v-spacer v-if="$vuetify.breakpoint.mobile" />

    <NuxtLink
      v-if="$vuetify.breakpoint.mobile"
      to="/"
      class="d-flex align-center"
    >
      <NuxtImg
        src="/images/Luwjistik Logo FA-02.png"
        format="webp"
        height="32"
        preload
      />
    </NuxtLink>

    <v-spacer />
  </v-app-bar>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useContext,
  PropType,
  ComputedRef,
  useStore,
} from '@nuxtjs/composition-api'
// Interfaces and types
import { User } from '~/types/login'
import { VuexModuleApplications } from '~/types/applications'

export default defineComponent({
  props: {
    mini: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  },
  setup(_props) {
    const { $auth } = useContext()
    const storeOfApplications = useStore<VuexModuleApplications>()

    // Handle user
    const user = computed(() =>
      $auth.$storage.getUniversal('user')
    ) as ComputedRef<User>

    const doLogout = async () => {
      try {
        await storeOfApplications.dispatch('applications/logout')
      } catch (error) {
        return error
      }
    }

    return {
      user,
      doLogout,
    }
  },
})
</script>
