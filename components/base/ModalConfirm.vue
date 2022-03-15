<template>
  <v-dialog v-model="dialog" max-width="450" persistent eager>
    <v-card>
      <v-card-title class="title pt-6">
        {{ dialogSettings.title }}
      </v-card-title>

      <v-card-text>
        {{ dialogSettings.content }}
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-spacer />

        <v-btn
          outlined
          :loading="dialogSettings.loading"
          :disabled="dialogSettings.loading"
          color="primary"
          class="mx-2"
          @click="doClose"
        >
          {{ dialogSettings.cancelText }}
        </v-btn>

        <v-btn
          :loading="dialogSettings.loading"
          :disabled="dialogSettings.loading"
          :color="dialogSettings.submitColor"
          @click="$emit('doSubmit')"
        >
          {{ dialogSettings.submitText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@nuxtjs/composition-api'
// Interfaces and types
import { ModalConfirm } from '~/types/applications'

export default defineComponent({
  props: {
    value: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    dialogSettings: {
      type: Object as PropType<ModalConfirm>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (value: boolean) => emit('input', value),
    })
    const doClose = () => {
      dialog.value = false
    }

    return {
      dialog,
      doClose,
    }
  },
})
</script>
