<template>
  <v-list three-line>
    <template v-for="(credential, index) in credentials">
      <v-list-item :key="credential.id">
        <v-list-item-content>
          <!-- Key name and status -->
          <v-list-item-title class="d-flex align-center">
            <span class="font-weight-medium">
              {{ credential.keyName }}
            </span>

            <v-chip
              :color="credential.revokedAt ? 'error' : 'success'"
              small
              class="ml-3"
            >
              {{ credential.revokedAt ? 'revoked' : 'active' }}
            </v-chip>
          </v-list-item-title>

          <!-- App ID -->
          <v-list-item-subtitle class="d-flex align-center">
            <span> App ID </span>

            <span
              :title="credential.appId"
              class="d-inline-block text-truncate ml-2"
              :style="{
                'max-width': $vuetify.breakpoint.smAndDown ? '7rem' : '15rem',
              }"
            >
              --- {{ credential.appId }} ---
            </span>

            <v-btn
              v-if="!credential.revokedAt"
              icon
              depressed
              :disabled="status.copied"
              @click="$emit('doCopy', credential.appId, 'key')"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </v-list-item-subtitle>

          <!-- App Secret -->
          <v-list-item-subtitle class="d-flex align-center">
            <span> App Secret </span>

            <span
              :title="credential.appSecret"
              class="d-inline-block text-truncate ml-2"
              :style="{
                'max-width': $vuetify.breakpoint.smAndDown ? '7rem' : '15rem',
              }"
            >
              --- {{ credential.appSecret }} ---
            </span>

            <v-btn
              v-if="!credential.revokedAt"
              icon
              depressed
              :disabled="status.copied"
              @click="$emit('doCopy', credential.appSecret, 'key')"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn
            v-if="!credential.revokedAt && $vuetify.breakpoint.smAndUp"
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

          <v-btn
            v-if="!credential.revokedAt && $vuetify.breakpoint.xsOnly"
            icon
            depressed
            color="error"
            :disabled="status.copied"
            class="mx-2"
            @click="$emit('toggleConfirmRevoke', credential.id)"
          >
            <v-icon>mdi-power-plug-off</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>

      <v-divider
        v-if="index < credentials.length - 1"
        :key="index"
        class="mx-4"
      />
    </template>
  </v-list>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { Credential } from '~/types/profiles'

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
