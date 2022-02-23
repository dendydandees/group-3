<template>
  <v-list nav dense class="py-4 px-4">
    <v-list-item
      v-for="(client, index) in clientMenu"
      :key="index"
      :to="client.to"
      link
      nuxt
      :ripple="{ class: `red--text` }"
      active-class="secondary--text"
      class="rounded-0 my-4"
      @click="$emit('hideMiniSideNav')"
    >
      <v-list-item-icon>
        <v-icon>
          {{ client.icon }}
        </v-icon>
      </v-list-item-icon>

      <v-list-item-title>
        {{ client.title }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from '@nuxtjs/composition-api'
// Interfaces and types
import { NavigationLinks } from '~/types/applications'

export default defineComponent({
  setup() {
    const clientMenu = ref([
      { title: 'Orders', icon: 'mdi-file-document', to: '/orders' },
    ]) as Ref<NavigationLinks[]>

    return {
      clientMenu,
    }
  },
})
</script>
