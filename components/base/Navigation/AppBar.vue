<template>
  <v-app-bar
    :elevate-on-scroll="true"
    app
    color="base"
    outlined
    tile
    style="border: 1px solid; border-color: rgba(0, 0, 0, 0.12)"
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

    <v-menu bottom right min-width="200px" rounded offset-y>
      <template #activator="{ on }">
        <v-btn
          text
          x-large
          :icon="$vuetify.breakpoint.mobile"
          color="primary"
          class="pa-0"
          v-on="on"
        >
          <v-icon
            left
            size="48"
            class="mr-0 mr-md-2 mt-0 mt-md-1"
            color="primary"
          >
            {{ $vuetify.breakpoint.mobile ? 'mdi-account-circle' : '$profile' }}
          </v-icon>

          <div class="d-none d-md-flex flex-column text-start">
            <p
              class="ma-0 subtitle-2 font-weight-bold text-truncate"
              style="max-width: 150px"
            >
              {{ user.role }}
            </p>

            <p
              class="ma-0 subtitle-2 text-truncate text-lowercase"
              style="max-width: 150px"
            >
              {{ user.email }}
            </p>
          </div>
        </v-btn>
      </template>

      <v-card>
        <v-list-item-content class="justify-center">
          <div class="mx-auto text-center">
            <v-btn rounded nuxt to="/account-profiles" color="primary">
              Profile
            </v-btn>

            <v-divider class="my-3" />

            <v-btn rounded text @click="doLogout"> Log out </v-btn>
          </div>
        </v-list-item-content>
      </v-card>
    </v-menu>
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
