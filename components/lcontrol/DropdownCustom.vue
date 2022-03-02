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
      v-model="selectedValue.value"
      :label="title"
      :items="data"
      item-text="name"
      item-value="value"
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
  PropType
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
    },
    partner: {
      type: String as PropType<String | ''>,
      default: '',
    },
    value: {
      type: String as PropType<String | ''>,
      default: '',
    }
  },
  setup(props, {emit}) {
    const toggle = () => {
      emit('toggle')
    }
    const selectedValue = reactive ({
      value: ''
    })
    const partnerComp = computed({
      get: () => props.value,
      set: (value: String) => {
        // console.log(value)
        emit('input', value)
      }
    })

    watch(
      selectedValue,
      (newData) => {
        partnerComp.value = newData.value
        // console.log('selected', newData.value, partnerComp.value)
      }
    )
    return {
      toggle,
      selectedValue
    }
  },
})
</script>
<style lang="scss">
  .dropdown-custom {
    width: 100%;
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