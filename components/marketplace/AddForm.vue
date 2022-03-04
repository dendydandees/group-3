<template>
  <div>
    <v-dialog v-model="dialogComp" persistent max-width="450">
      <v-card
        class="rounded-xl pa-2"
      >
        <v-card-title class="h-5 text-break">
          Are you sure you want to connect with {{data.name}}?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="toggle()"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1 white--text"
            @click="addConnection()"
          >
            Connect
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useFetch,
  useStore,
  reactive,
  watch,
  ref,
  useMeta,
  useRouter,
} from '@nuxtjs/composition-api'
import { VuexModuleMarketplaces} from '~/types/marketplace/marketplace'

interface FeedbackMessage {
  alert: boolean
  type: string
  message: string | unknown
}

export default defineComponent({
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
  setup(props, {emit}) {
    const dialogComp = computed({
      get: () => props.dialog.status,
      set: (value: boolean) => emit('input', value)
    })
    const toggle = () => {
      emit('toggle')
      // this.$nuxt.$emit('toggle')
    }
    const addConnection = () => {
      emit('add')
    }

    watch(
      dialogComp,
      (newDialogComp) => {
        console.log({newDialogComp})
      }
    )
    console.log({dialogComp})
    return {
      toggle,
      dialogComp,
      addConnection
    }
  },
})
</script>
