<template>
  <div class="dropdown-custom">
    <div
      v-if="label"
      class="h-5 text-break font-weight-medium pb-1 d-flex align-center"
    >
      <div>
        {{ label }}
      </div>

      <v-tooltip v-if="isInfo" color="info" bottom max-width="250">
        <template #activator="{ on, attrs }">
          <NuxtImg
            src="/images/qMark.svg"
            preload
            :height="18"
            class="ml-2"
            v-bind="attrs"
            v-on="on"
          />
        </template>

        <span
          >COD default Network Partner allocation will allow all COD orders will
          automatically be allocated to this specific NP</span
        >
      </v-tooltip>
    </div>

    <div class="d-flex align-center">
      <v-select
        v-model="selectedComp"
        :label="title"
        :items="data"
        :item-text="itemShow.text"
        :item-value="itemShow.value"
        :placeholder="placeholder"
        :disabled="disabledDrop"
        outlined
        rounded
        dense
        color="blue"
        :class="`custom-select ${disabledDrop ? 'disabled-drop' : ''}`"
      >
      </v-select>

      <v-btn
        v-if="isDelete"
        :loading="disabledDrop"
        color="error"
        fab
        x-small
        dark
        class="ml-3"
        @click="actionDelete"
      >
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  watch,
  PropType,
} from '@nuxtjs/composition-api'

// interface FeedbackMessage {
//   alert: boolean
//   type: string
//   message: string | unknown
// }

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
      type: Object as PropType<{ text: string; value: string }>,
      default: () => ({}),
    },
    data: {
      type: Array,
      default: () => [],
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
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    isInfo: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const toggle = () => {
      emit('toggle')
    }
    const actionDelete = () => {
      emit('delete')
    }
    // const selectedValue = reactive({
    //   value: '',
    // })
    watch(
      () => [props.disabledDrop],
      () => {
        // console.log({ newDisabled })
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
      },
    })

    return {
      toggle,
      selectedComp,
      actionDelete,
    }
  },
})
</script>
<style lang="scss">
.dropdown-custom {
  width: 100%;
  .custom-select {
    // .v-select__slot {
    // label {
    /* font-size: 12px;
          color: red; */
    /* font-weight: bold; */
    // }
    // }
    .v-input__slot {
      margin-bottom: unset !important;
      /* outline: 1px solid #2196F3; */
      fieldset {
        border-color: #2196f3;
      }
    }
    .v-text-field__details {
      display: none;
    }
    &.disabled-drop {
      cursor: not-allowed;
      opacity: 0.5;
      .v-input__control {
        pointer-events: none;
      }
    }
  }
}
</style>
