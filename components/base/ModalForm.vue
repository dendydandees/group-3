<template>
  <v-dialog v-model="dialog" max-width="450" persistent eager>
    <v-card>
      <v-card-title class="title pt-6">
        {{ dialogSettings.title }}
      </v-card-title>

      <v-expand-transition>
        <v-alert
          v-if="alert.isShow"
          :type="alert.type"
          dismissible
          tile
          class="mx-6 mt-6"
        >
          {{ alert.message }}
        </v-alert>
      </v-expand-transition>

      <ValidationObserver
        ref="formObserver"
        v-slot="{ invalid }"
        tag="form"
        @submit.stop.prevent="doSubmit"
      >
        <slot name="modalFields" />

        <v-card-actions class="px-6 pb-6">
          <v-spacer />

          <v-btn
            tile
            depressed
            text
            :loading="dialogSettings.loading"
            :disabled="dialogSettings.loading"
            class="mx-2"
            @click="doClose"
          >
            {{ dialogSettings.cancelText }}
          </v-btn>

          <v-btn
            tile
            depressed
            :loading="dialogSettings.loading"
            :disabled="invalid || dialogSettings.loading"
            :color="dialogSettings.submitColor"
            type="submit"
          >
            {{ dialogSettings.submitText }}
          </v-btn>
        </v-card-actions>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  ref,
  Ref,
  useStore,
} from '@nuxtjs/composition-api'
import { ValidationObserver } from 'vee-validate'
// Interfaces and types
import {
  ModalConfirm,
  VForm,
  VuexModuleApplications,
} from '~/types/applications'

export default defineComponent({
  components: {
    ValidationObserver,
  },
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
    const storeApplications = useStore<VuexModuleApplications>()
    const alert = computed(() => storeApplications.state.applications.alert)
    const formObserver = ref(null) as unknown as Ref<VForm>
    const dialog = computed({
      get: () => props.value,
      set: (value: boolean) => emit('input', value),
    })
    const doClose = async () => {
      await formObserver?.value?.reset()

      dialog.value = false
    }
    const doSubmit = async () => {
      const isValid = await formObserver?.value?.validate()

      if (!isValid) return

      emit('doSubmit')
    }

    return {
      alert,
      formObserver,
      dialog,
      doClose,
      doSubmit,
    }
  },
})
</script>
