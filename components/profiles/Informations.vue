<template>
  <v-row>
    <v-col cols="12">
      <v-card dark color="primary" elevation="0">
        <v-card-text class="body-1 white--text pa-6">
          <v-row align="center">
            <v-col cols="12" md="auto">
              <v-avatar size="56" color="secondary">
                <span class="text-uppercase font-weight-bold title">
                  {{ user.initial }}
                </span>
              </v-avatar>
            </v-col>

            <v-col cols="12" md="auto">
              <div>
                <h2 class="text-capitalize font-weight-bold title">
                  {{ user.role }}
                </h2>

                <p class="ma-0">{{ user.email }}</p>
              </div>
            </v-col>
          </v-row>
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
  name: 'ProfileInformations',
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
  },
})
</script>
