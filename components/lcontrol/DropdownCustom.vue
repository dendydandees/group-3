<template>
  <div
    class="dropdown-custom"
  >
    <div
      v-if="label"
      class="h-5 text-break font-weight-medium pb-1"
    >
      {{label}}
    </div>
    <v-select
      :label="title"
      :items="data"
      :placeholder="placeholder"
      outlined
      rounded
      dense
      color="blue"
      class="custom-select"
    >
    </v-select>
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
    title: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default: () => ([]),
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
<style lang="scss">
  .dropdown-custom {
    .custom-select {
      .v-select__slot {
        label {
          /* font-size: 12px;
          color: red; */
          /* font-weight: bold; */
        }
      }
      .v-input__slot {
        margin-bottom: unset !important;
        /* outline: 1px solid #2196F3; */
        fieldset {
          border-color: #2196F3;
        }
      }
      .v-text-field__details {
        display: none;
      }
    }
  }
</style>