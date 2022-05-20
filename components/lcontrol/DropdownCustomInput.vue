<template>
  <div class="dropdown-custom-input">
    <div
      v-if="label"
      class="h-5 text-break font-weight-medium pb-1 d-flex align-center"
    >
      <v-tooltip v-if="isInfo" bottom>
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
    <!-- {{JSON.stringify(data)}} -->
    <div class="d-flex align-center">
      <div
        :style="'width: 70%'"
      >
        <div
          class="header-NP-label"
        >
          {{ label }}
        </div>
        <v-select
          v-model="selectedComp.partnerID"
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
      <div
        class="ml-3"
        :style="'width: 30%'"
      >
        <div
          class="header-NP-label"
        >
          Volume
        </div>
        <v-text-field
          v-model="selectedComp.volume"
          label="Volume"
          placeholder="Volume"
          background-color="white"
          solo
          flat
          dense
          hide-details
          rounded
          outlined
          type="number"
          class="custom-text-field"
        />

      </div>
      <div
        class="ml-3"
      >
        <div
          class="header-NP-label"
        >

        </div>
        <v-btn
          v-if="isDelete"
          color="error"
          fab
          x-small
          dark
          @click="actionDelete"
        >
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>

      </div>
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

export interface InputNPData {
  partnerID: string,
  volume: number,
  index?: number,
  type?: string
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
      type: Object as PropType<InputNPData>,
      required: true,
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
    watch(
      () => [props.disabledDrop],
      () => {
        // console.log({ newDisabled })
      },
      { deep: true }
    )
    const selectedComp = computed({
      get: () => props.value,
      set: (value: InputNPData) => {
        emit('input', value)
      }
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
.dropdown-custom-input {
  width: 100%;
  .custom-select {
    /* min-width: 100%; */
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

  .header-NP-label {
    height: 24px;
    margin-bottom: 4px;
    font-weight: 500;
  }
  .custom-text-field {
    /* width: 100%; */
    .v-input__slot {
      fieldset {
        color: #2196f3 !important;
      }
      &:focus-visible {
        outline: #2196f3  auto 1px !important;;
      }

    }
    .v-label {
        color: grey !important;
        font-size: 16px;
    }
    /* #2196f3 */
  }
}
</style>
