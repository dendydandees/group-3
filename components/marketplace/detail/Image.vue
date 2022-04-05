<template>
  <div>
    <v-dialog v-model="dialogComp" persistent max-width="450">
      <v-card class="rounded-xl pa-2"> ini image </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'MarketplaceImage',
  props: {
    dialog: {
      type: Object,
      default: () => ({}),
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const dialogComp = computed({
      get: () => props.dialog.status,
      set: (value: boolean) => emit('input', value),
    })
    const toggle = () => {
      emit('toggle')
      // this.$nuxt.$emit('toggle')
    }
    const addConnection = () => {
      emit('add')
    }
    return {
      toggle,
      dialogComp,
      addConnection,
    }
  },
})
</script>
