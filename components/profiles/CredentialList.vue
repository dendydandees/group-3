<template>
  <v-list>
    <template v-for="(credential, index) in credentials">
      <v-list-item :key="credential.id">
        <v-list-item-content>
          <v-list-item-title class="d-flex align-center">
            <span class="font-weight-medium">
              {{ credential.keyName }}
            </span>

            <span
              :title="credential.token"
              class="d-inline-block text-truncate"
              :style="{
                'max-width': $vuetify.breakpoint.smAndDown ? '7rem' : '15rem',
              }"
            >
              --- {{ credential.token }} ---
            </span>

            <v-chip :color="credential.revokedAt ? 'error' : 'success'" small>
              {{ credential.revokedAt ? 'revoked' : 'active' }}
            </v-chip>

            <v-btn
              v-if="!credential.revokedAt"
              icon
              depressed
              :disabled="status.copied"
              @click="$emit('doCopy', credential.token)"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn
            v-if="!credential.revokedAt"
            tile
            depressed
            text
            color="error"
            :disabled="status.copied"
            class="mx-2"
            @click="$emit('toggleConfirmRevoke', credential.id)"
          >
            Revoke key
          </v-btn>
        </v-list-item-action>
      </v-list-item>

      <v-divider v-if="index < credentials.length - 1" :key="index" />
    </template>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { Credential } from '~/types/credentials'

export default defineComponent({
  props: {
    credentials: {
      type: Array as PropType<Credential[]>,
      required: true,
    },
    status: {
      type: Object,
      required: true,
    },
  },
})
</script>
