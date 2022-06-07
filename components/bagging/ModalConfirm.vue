<template>
  <v-dialog v-model="dialog" max-width="450" persistent eager>
    <v-card

    >
      <v-card-title class="text-h5 pt-6 d-flex justify-center">
        {{ dialogSettings.title }}
      </v-card-title>

      <v-card-text
        v-if="dialogSettings.content"
      >
        {{ dialogSettings.content }}
      </v-card-text>

      <v-card-actions class="px-6 pb-6 d-flex justify-center" >
        <v-col
          cols="6"
          class="pa-0 mx-2"
        >
          <v-btn
            v-if="dialogSettings.cancelText"
            outlined
            :loading="dialogSettings.loading"
            :disabled="dialogSettings.loading"
            color="primary"
            class="mx-2"
            width="100%"
            @click="doClose"
          >
            {{ dialogSettings.cancelText }}
          </v-btn>

        </v-col>
        <v-col
          cols="6"
          class="pa-0 mx-2"
        >
          <v-btn
            :loading="dialogSettings.loading"
            :disabled="dialogSettings.loading"
            :color="dialogSettings.submitColor"
            width="100%"
            @click="$emit('doSubmit')"
          >
            {{ dialogSettings.submitText }}
          </v-btn>

        </v-col>
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
    isConfirm:{
      type: Boolean as PropType<boolean>,
      default: false,
    }
  },
  setup(props, { emit }) {
    const dialog = computed({
      get: () => props.value,
      set: (value: boolean) => emit('input', value),
    })
    const doClose = () => {
      if(props.isConfirm) {
        emit('doCancel')
      }
      dialog.value = false
    }

    return {
      dialog,
      doClose,
    }
  },
})
</script>
