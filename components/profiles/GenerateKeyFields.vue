<template>
  <v-card-text class="px-6">
    <ValidationProvider
      v-slot="{ errors }"
      slim
      name="Key Name"
      rules="required"
      tag="div"
    >
      <v-text-field
        v-model="form.keyName"
        :error-messages="errors"
        label="Key Name"
        placeholder="Enter your key name..."
        type="text"
        required
        outlined
      />
    </ValidationProvider>
  </v-card-text>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@nuxtjs/composition-api'
import { ValidationProvider } from 'vee-validate'
// Interfaces and types
import { GenerateCredential } from '~/types/profiles'

export default defineComponent({
  components: {
    ValidationProvider,
  },
  props: {
    value: {
      type: Object as PropType<GenerateCredential>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const form = computed({
      get: (): GenerateCredential => props.value,
      set: (value: GenerateCredential) => emit('input', value),
    })

    return {
      form,
    }
  },
})
</script>
