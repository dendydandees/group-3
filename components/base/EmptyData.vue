<template>
  <div
    class="d-flex align-center justify-center py-15 mx-auto"
    style="width: 75%"
  >
    <NuxtImg src="/images/not-found.png" format="webp" width="100%" preload />

    <div class="ml-0 ml-md-15">
      <span class="text-h4">
        {{
          isOnFilter ? 'Your search returned no results.' : 'No data available.'
        }}
        Go back to
        <a class="text-h4 error--text" @click="$emit('refresh')">
          {{ page }}
        </a>
        to find available {{ page }}.
      </span>

      <v-btn text color="error" class="mt-6" @click="$emit('refresh')">
        Go back to {{ page }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    page: {
      type: String,
      required: true,
    },
    isOnFilter: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
