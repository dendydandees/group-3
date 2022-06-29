<template>
  <div class="body-wrapper border-bottom">
    <div class="country-wrapper">
      <div class="text">COUNTRY</div>
    </div>

    <div class="service-wrapper service-color">
      <div class="text">SERVICE</div>
    </div>

    <div class="zone-wrapper">
      <div class="text">
        <v-breadcrumbs :items="breadcrumbs" divider=">" class="pa-0">
          <template #item="{ item }">
            <v-breadcrumbs-item
              :href="item.href"
              :disabled="item.disabled"
              :class="`${!item.first ? 'active-bread' : ''}`"
            >
              {{ item.text.toUpperCase() }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'LControlHeading',
  props: {
    breadcrumbs: {
      type: Array,
      required: true,
    },
  },
})
</script>
