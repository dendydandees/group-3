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
    style="overflow: unset"
  >
    <BaseNavigationClientMenu
      :mini="mini"
      @hideMiniSideNav="$emit('hideMiniSideNav')"
    />

    <!-- <BaseNavigationPartnerMenu
      v-if="isPartners"
      :mini="mini"
      @hideMiniSideNav="$emit('hideMiniSideNav')"
    /> -->

    <template #prepend>
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
    </template>

    <div
      v-if="!$vuetify.breakpoint.mobile"
      class="side-button"
      @click="$emit('doShowSideNav')"
    >
      <v-icon class="my-auto" style="height: 100%">
        {{ mini ? 'mdi-chevron-right' : 'mdi-chevron-left' }}
      </v-icon>
    </div>
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

.side-button {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  z-index: 999;
  transform: translate(50%, -50%);
  border-radius: 24px;
  color: white;
  background-color: $primary;
  width: 1.5rem;
  height: 10%;
}

.side-button :hover {
  cursor: pointer;
}
</style>
