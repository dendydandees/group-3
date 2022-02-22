<template>
  <v-text-field
    v-model="search"
    label="Search"
    placeholder="Type partners network ..."
    background-color="white"
    type="search"
    clearable
    solo
    flat
    dense
    hide-details
    rounded
    outlined
    class="input-custom"
  />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    value: {
      type: String as PropType<String>,
      default: null,
    },
  },
  setup(props, { emit }) {
    const search = computed({
      get: () => {
        return props.value
      },
      set: (value) => {
        emit('input', value)
      },
    })

    return {
      search,
    }
  },
})
</script>
<style lang="scss">
  /* .v-text-field--outlined >>> fieldset {
    border-color: blue
  }

  .v-text-field--label  >>> input[type="Search"] {
    color: blue !important;
  } */

  .input-custom{
    fieldset {
      border-color: #2196F3;
    }
    .v-text-field__slot {
      label {
        color: #2196F3;
        font-weight: 700;
        font-size: large;
      }
      .v-text-field__suffix {
        color: red;
      }
    }
  }
</style>