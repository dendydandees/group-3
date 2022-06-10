<template>
  <v-btn-toggle
    v-model="orderView"
    mandatory
    rounded
    dark
    class="mx-0 mx-md-2 mb-4 mb-md-0"
  >
    <template v-for="({ icon, text }, index) in listView">
      <v-tooltip :key="index" top color="primary">
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" color="primary" :disabled="loading" v-on="on">
            <v-icon>{{ icon }}</v-icon>
          </v-btn>
        </template>

        <span>{{ text }}</span>
      </v-tooltip>
    </template>
  </v-btn-toggle>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  PropType,
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    value: {
      type: Number as PropType<number>,
      required: true,
    },
    loading: {
      type: Boolean,
    },
    isBagging: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const orderView = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })
    const listView = ref([
      {
        icon: 'mdi-view-list',
        text: props.isBagging ? 'Unbagged View' : 'List view',
      },
      {
        icon: 'mdi-select-group',
        text: props.isBagging ? 'Scanned View' : 'Batch view',
      },
    ])

    return {
      orderView,
      listView,
    }
  },
})
</script>
