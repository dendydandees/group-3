<template>
  <v-navigation-drawer
    v-model="drawer"
    :permanent="!$vuetify.breakpoint.smAndDown"
    :mini-variant="mini"
    :mini-variant-width="80"
    fixed
    app
  >
    <v-list class="py-2 text--center">
      <v-list-item class="justify-center">
        <v-badge
          v-if="!mini"
          content="Client Portal"
          value="Client Portal"
          color="secondary"
          overlap
          class="mt-2 mr-10"
        >
          <NuxtImg
            src="/images/Luwjistik Logo FA-01.png"
            format="webp"
            height="24"
            preload
          />
        </v-badge>

        <NuxtImg
          v-else
          src="/images/Luwjistik Logo FA-02.png"
          format="webp"
          height="24"
          preload
        />
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav dense class="py-4 px-4">
      <v-list-item
        v-for="link in items"
        :key="link.title"
        :to="link.to"
        link
        active-class="secondary white--text"
        class="my-4 rounded-0"
        nuxt
      >
        <v-list-item-icon>
          <v-icon>
            {{ link.icon }}
          </v-icon>
        </v-list-item-icon>

        <v-list-item-title>
          {{ link.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <template #append>
      <v-divider></v-divider>

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
            to="/profiles"
            class="mb-4"
          >
            Profile
          </v-btn>

          <v-btn block tile outlined color="primary" @click="doLogout">
            Sign Out
          </v-btn>
        </div>
      </v-expand-transition>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {
  computed,
  useContext,
  useRouter,
  defineComponent,
  ref,
  Ref,
  watch,
} from '@nuxtjs/composition-api'
import { useStorage } from '@vueuse/core'
// Interfaces and types
import { NavigationLinks } from '~/types/applications'

export default defineComponent({
  props: {
    value: {
      type: Boolean as () => boolean,
      required: true,
    },
    mini: {
      type: Boolean as () => boolean,
      required: true,
    },
    items: {
      type: Array as () => NavigationLinks[],
      required: true,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const context = useContext()
    const router = useRouter()
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
        await context.$auth.logout()

        setTimeout(() => {
          context.$auth.setUser({})
          localStorage.removeItem('user')
          router.push('/login')
        }, 300)
      } catch (error) {
        return error
      }
    }
    // Show user actions button list
    const isShowUserActions = ref(false) as Ref<Boolean>
    const doShowUserActions = () => {
      emit('hideMiniSideNav')
      isShowUserActions.value = !isShowUserActions.value
    }
    // Get user data
    const user = useStorage('user', {})

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
    }
  },
})
</script>
