<template>
  <v-list nav dense class="py-4 px-4">
    <v-list-group
      :value="isOnOrders"
      no-action
      :ripple="{ class: `red--text` }"
      prepend-icon="mdi-package"
      active-class="secondary white--text"
      class="my-4 rounded-0"
      @click="$emit('hideMiniSideNav')"
    >
      <template #activator>
        <v-list-item-title>Orders</v-list-item-title>
      </template>

      <v-list-item
        v-for="(link, index) in orderList"
        :key="index"
        :to="link.to"
        link
        nuxt
        active-class="secondary--text"
        class="rounded-0"
      >
        <v-list-item-title>
          {{ link.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list-group>

    <!-- Next Features -->
    <!-- <v-list-item
      v-for="(link, index) in linkList"
      :key="index"
      :to="link.to"
      link
      nuxt
      active-class="secondary white--text"
      class="rounded-0"
    >
      <v-list-item-icon>
        <v-icon>
          {{ link.icon }}
        </v-icon>
      </v-list-item-icon>

      <v-list-item-title>
        {{ link.title }}
      </v-list-item-title>
    </v-list-item> -->
  </v-list>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  Ref,
  useRoute,
} from '@nuxtjs/composition-api'
// Interfaces and types
import { NavigationLinks } from '~/types/applications'

export default defineComponent({
  setup() {
    const route = useRoute()
    const isOnOrders = computed(() => {
      return (
        route.value.name === 'orders-incoming' ||
        route.value.name === 'orders-process' ||
        route.value.name === 'orders-process-id'
      )
    })
    const orderList = ref([
      { title: 'Process Orders', to: '/orders/process' },
    ]) as Ref<NavigationLinks[]>

    // * Next Features
    // const linkList = ref([]) as Ref<NavigationLinks[]>
    // onMounted(() => {
    //   const user = $auth.$storage.getCookie('user') as User

    //   if (user?.partnerProfiles.length === 0) return

    //   orderList.value.push({ title: 'Incoming Orders', to: '/orders/incoming' })
    //   linkList.value.push({
    //     title: 'Partners',
    //     icon: 'mdi-handshake',
    //     to: '/partners',
    //   })
    // })

    return {
      isOnOrders,
      orderList,
    }
  },
})
</script>
