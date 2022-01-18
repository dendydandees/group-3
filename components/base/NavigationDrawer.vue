<template>
  <v-navigation-drawer
    v-model="drawer"
    :permanent="!$vuetify.breakpoint.smAndDown"
    :mini-variant="mini"
    :mini-variant-width="80"
    fixed
    app
  >
    <v-list class="py-4">
      <v-list-item link>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Sandra Adams </v-list-item-title>
          <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
        </v-list-item-content>
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
      >
        <v-list-item-icon>
          <v-icon>
            {{ link.icon }}
          </v-icon>
        </v-list-item-icon>

        <v-list-item-title class="subtitle-1">
          {{ link.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <template #append>
      <div class="pa-4 mb-4">
        <v-btn block tile outlined color="primary" @click="doLogout">
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {
  computed,
  useContext,
  useRouter,
  defineComponent,
} from '@nuxtjs/composition-api'

interface Items {
  title: string
  icon: string
  to: string
}

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
      type: Array as () => Items[],
      required: true,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const context = useContext()
    const router = useRouter()
    const drawer = computed({
      get() {
        return props.value
      },
      set(value: boolean) {
        emit('update:value', value)
      },
    })

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

    return {
      drawer,
      doLogout,
    }
  },
})
</script>
