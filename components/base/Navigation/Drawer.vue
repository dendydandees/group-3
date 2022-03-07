<template>
  <v-navigation-drawer
    v-model="drawer"
    :permanent="!$vuetify.breakpoint.smAndDown"
    :mini-variant="mini"
    :mini-variant-width="80"
    fixed
    app
    dark
    color="primary"
    class="rounded-xl rounded-tl-0 rounded-bl-0"
  >
    <BaseNavigationClientMenu
      :mini="mini"
      @hideMiniSideNav="$emit('hideMiniSideNav')"
    />

    <BaseNavigationPartnerMenu
      v-if="isPartners"
      :mini="mini"
      @hideMiniSideNav="$emit('hideMiniSideNav')"
    />

    <template #append>
      <v-fade-transition hide-on-leave>
        <NuxtImg
          v-if="mini"
          src="/images/luwjistik_logo_white_simple.png"
          format="webp"
          preload
          class="mx-auto d-block my-8"
        />
      </v-fade-transition>

      <v-fade-transition hide-on-leave>
        <NuxtImg
          v-if="!mini"
          src="/images/luwjistik_logo_white_full.png"
          format="webp"
          preload
          class="mx-auto d-block my-8"
        />
      </v-fade-transition>
      <!-- <v-divider />

      <v-list class="py-4">
        <v-list-item
          link
          :ripple="{ class: `red--text` }"
          @click="doShowUserActions"
        >
          <v-avatar
            size="40"
            tile
            color="secondary"
            :class="mini ? 'mr-0' : 'mr-4'"
          >
            <span class="text-uppercase white--text font-weight-bold title">
              {{ user.initial }}
            </span>
          </v-avatar>

          <v-list-item-content>
            <v-list-item-title class="font-weight-bold text-capitalize">
              {{ user.role }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ user.email }}
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon>
              {{ isShowUserActions ? 'mdi-menu-up' : 'mdi-menu-down' }}
            </v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-expand-transition>
        <div v-if="isShowUserActions" class="pa-4 mb-4">
          <v-btn
            block
            tile
            color="primary"
            depressed
            nuxt
            to="/account-profiles"
            class="mb-4"
          >
            Profile
          </v-btn>

          <v-btn block tile outlined color="primary" @click="doLogout">
            Sign Out
          </v-btn>
        </div>
      </v-expand-transition> -->
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  ref,
  watch,
  useStore,
  useContext,
} from '@nuxtjs/composition-api'
// Interfaces and types
import { VuexModuleApplications } from '~/types/applications'
import { User } from '~/types/login'

export default defineComponent({
  name: 'BaseNavigationDrawer',
  props: {
    value: {
      type: Boolean as () => boolean,
      required: true,
    },
    mini: {
      type: Boolean as () => boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { $auth } = useContext()

    const storeOfApplications = useStore<VuexModuleApplications>()
    const drawer = computed({
      get(): boolean {
        return props.value
      },
      set(value: boolean) {
        emit('update:value', value)
      },
    })
    // Logout user
    const doLogout = async () => {
      try {
        await storeOfApplications.dispatch('applications/logout')
      } catch (error) {
        return error
      }
    }
    // Show user actions button list
    const isShowUserActions = ref(false)
    const doShowUserActions = () => {
      emit('hideMiniSideNav')
      isShowUserActions.value = !isShowUserActions.value
    }
    // Get user data
    const user = computed(() =>
      $auth.$storage.getUniversal('user')
    ) as ComputedRef<User>
    const isPartners = computed(() => user.value.partnerProfiles.length !== 0)

    watch(
      () => props.mini,
      (mini) => {
        if (mini === true) return (isShowUserActions.value = false)
      }
    )

    return {
      drawer,
      doLogout,
      isShowUserActions,
      doShowUserActions,
      user,
      isPartners,
    }
  },
})
</script>

<style lang="scss">
.v-list--nav .v-list-item,
.v-list--nav .v-list-item:before {
  border-radius: 0 !important;
}
</style>
