<template>
  <div>
    <v-list-item
      v-for="({ title, icon, to }, index) in items"
      :key="index"
      :to="to"
      nuxt
      :ripple="{ class: `white--text` }"
      active-class="item-group-sidebar-active"
      class="my-0 px-6 rounded-0 item-group-sidebar"
    >
      <v-list-item-icon>
        <v-icon size="32" v-text="icon" />
      </v-list-item-icon>

      <v-list-item-title v-text="title" />
    </v-list-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'NavigationListItem',
  props: {
    items: {
      type: Array,
      required: true,
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
