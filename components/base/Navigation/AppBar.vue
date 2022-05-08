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

    <div class="white" style="border-radius: 24px">
      <v-menu bottom offset-y>
        <template #activator="{ on }">
          <v-btn
            text
            x-large
            :icon="$vuetify.breakpoint.mobile"
            color="primary"
            class="pa-0 px-2"
            v-on="on"
          >
            <v-icon
              left
              size="40"
              class="mr-0 mr-md-1 mt-0 mt-md-1"
              color="primary"
            >
              {{
                $vuetify.breakpoint.mobile ? 'mdi-account-circle' : '$profile'
              }}
            </v-icon>

            <div class="d-none d-md-flex flex-column text-start">
              <p
                class="ma-0 subtitle-2 font-weight-bold text-capitalize text-left"
              >
                {{ user.role }}
              </p>

              <p class="ma-0 subtitle-2 text-lowercase">
                {{ user.email }}
              </p>
            </div>
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <!-- to profile -->
            <v-list-item nuxt to="/account-profiles" color="primary">
              <v-list-item-avatar color="primary">
                <v-icon
                  dark
                  class="white--text mt-0 mt-md-1 ml-0 ml-md-1"
                  size="32"
                >
                  {{
                    $vuetify.breakpoint.mobile
                      ? 'mdi-account-circle'
                      : '$profile'
                  }}
                </v-icon>
              </v-list-item-avatar>

              <v-list-item-content class="font-weight-bold">
                Profile
              </v-list-item-content>
            </v-list-item>

            <v-divider class="my-2" />

            <!-- to logout -->
            <v-list-item link color="primary" @click="doLogout">
              <v-list-item-icon>
                <v-icon> mdi-logout-variant </v-icon>
              </v-list-item-icon>

              <v-list-item-content> Log out </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </div>
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
