<template>
  <v-row>
    <v-col cols="12">
      <v-card dark tile color="primary" elevation="0">
        <v-card-text
          class="d-flex flex-wrap flex-row align-center body-1 white--text pa-6"
        >
          <v-avatar size="48" tile color="secondary">
            <span class="text-uppercase font-weight-bold title">
              {{ user.initial }}
            </span>
          </v-avatar>

          <div class="ml-6">
            <h2 class="text-capitalize font-weight-bold title mb-1">
              {{ user.role }}
            </h2>

            <p class="ma-0">{{ user.email }}</p>
          </div>

          <!-- Next features -->
          <v-btn
            v-if="false"
            depressed
            tile
            :block="$vuetify.breakpoint.xsOnly"
            class="mt-6 mt-sm-0 ml-auto"
            @click="$emit('show')"
          >
            Reset Password
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
// interfaces and types
import { User } from '~/types/login'

export default defineComponent({
  name: 'ProfileInformation',
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
})
</script>
