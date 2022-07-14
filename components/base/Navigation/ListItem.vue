<template>
  <v-list-item
    :to="items.to"
    nuxt
    link
    :ripple="{ class: `white--text` }"
    active-class="item-group-sidebar-active"
    class="my-0 rounded-0 item-group-sidebar"
  >
    <!-- <v-list-item-icon :style="{ marginRight: mini ? '0 !important' : '' }">
      <v-icon size="32" v-text="items.icon" />
    </v-list-item-icon> -->

    <v-list-item-content class="pa-6">
      <v-list-item-title v-text="items.title" />
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'NavigationListItem',
  props: {
    items: {
      type: Object,
      required: true,
    },
    mini: {
      type: Boolean as PropType<Boolean>,
      default: false,
    },
  },
})
</script>

<style lang="scss">
.item-group-sidebar {
  background-color: $primary-darken-1 !important;
}

.item-group-sidebar-active {
  color: white !important;
  border: 6px solid $secondary !important;
  border-top: 0 !important;
  border-left: 0 !important;
  border-bottom: 0 !important;
}
</style>
