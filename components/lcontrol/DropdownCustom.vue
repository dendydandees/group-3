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
    <!-- {{JSON.stringify(data)}} -->
    <v-select
      v-model="selectedComp"
      :label="title"
      :items="data"
      :item-text="itemShow.text"
      :item-value="itemShow.value"
      :placeholder="placeholder"
      :disabled="disabledDrop"
      :loading="disabledDrop"
      outlined
      rounded
      dense
      color="blue"
      :class="`custom-select ${disabledDrop ? 'disabled-drop' : ''}`"
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
    selectedValue: {
      type: String as PropType<string>,
      default: '',
    },
    itemShow: {
      type: Object as PropType<{text: string, value: string}>,
      default: () => ({}),
    },
    data: {
      type: Array ,
      default: () => ([]),
    },
    partner: {
      type: String as PropType<String | ''>,
      default: '',
    },
    value: {
      type: String as PropType<String | ''>,
      default: '',
    },
    disabledDrop: {
      type: Boolean,
      default: true,
    }
  },
  setup(props, {emit}) {
    const toggle = () => {
      emit('toggle')
    }
    const selectedValue = reactive ({
      value: ''
    })
    console.log({disabledDrop: props.disabledDrop})
    watch(
      () => [props.disabledDrop],
      ([newDisabled]) => {
        console.log({newDisabled})
      },
      { deep: true }
    )
    // const partnerComp = computed({
    //   get: () => props.value,
    //   set: (value: String) => {
    //     // console.log(value)
    //     emit('input', value)
    //   }
    // })
    const selectedComp = computed({
      get: () => props.value,
      set: (value: String) => {
        emit('input', value)
      }
    })

    return {
      toggle,
      selectedComp
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
      &.disabled-drop {
        cursor: not-allowed;
        opacity: .5;
        .v-input__control {
          pointer-events: none;
        }
      }
    }
  }
</style>