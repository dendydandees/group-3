<template>
  <v-row v-if="isShowFilter" align="center">
    <v-col cols="12">
      <v-sheet class="white pa-6 elevation-1 rounded-xl">
        <span class="subtitle-1 font-weight-bold text-uppercase mb-4 d-block">
          Filter
        </span>

        <slot name="filterList" />

        <div class="d-flex mt-6">
          <v-spacer />

          <v-btn plain small class="mx-2" @click="$emit('doToggleFilter')">
            Close
          </v-btn>

          <v-btn plain color="error" small @click="$emit('doResetFilter')">
            Clear Filter
          </v-btn>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    isShowFilter: {
      type: Boolean,
    },
  },
  setup() {},
})
</script>
