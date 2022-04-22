<template>
  <v-card-text class="px-6 deleteStatus">
    <v-list v-if="selected && selected.length > 0">
      <v-list-item>
        <v-list-item-title class="font-weight-bold">
          Order ID
        </v-list-item-title>
        <v-list-item-subtitle class="font-weight-bold">
          Batch ID
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item v-for="(x, i) in selected" :key="i">
        <v-list-item-title>{{ x.orderCode }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ x.batchId }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card-text>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  PropType,
  useStore,
  useContext,
  ref,
  Ref,
  useFetch,
  watch,
} from '@nuxtjs/composition-api'
import { ValidationProvider } from 'vee-validate'
import { IncomingOrder } from '~/types/partnerPortals/incomingOrders'

interface StatusUpdate {
  status: string
  updateDate: string
  updateTime: string
}

export default defineComponent({
  components: {
    ValidationProvider,
  },
  props: {
    selected: {
      type: Array as PropType<IncomingOrder[] | []>,
      default: () => [],
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    return {}
  },
})
</script>
<style lang="scss">
.deleteStatus {
  .v-list-item__subtitle {
    overflow: unset;
    text-overflow: unset;
    white-space: unset;
  }
}
</style>
