<template>
  <div>
    <v-dialog v-model="dialogComp.status" persistent max-width="450">
      <v-card
        class="rounded-xl pa-2"
      >
        <v-alert
          v-for="feedback in feedbacks"
          :key="feedback.message"
          :type="feedback.type"
        >
          {{ feedback.message }}
        </v-alert>
        <v-card-title class="h-5 text-break">
          Are you sure you want to connect with Ninja Van?
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

interface FeedbackMessage {
  alert: boolean
  type: string
  message: string | unknown
}

export default defineComponent({
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({}),
    }
  },
  setup(props, {emit}) {
    const dialogComp = computed({
      get: () => props.dialog,
      set: (value: boolean) => emit('input', value)
    })
    const toggle = () => {
      emit('toggle')
      // this.$nuxt.$emit('toggle')
    }
    return {
      toggle,
      dialogComp
    }
  },
})
</script>
