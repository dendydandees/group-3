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
    :suffix="!search ? 'Filter' : null"
    :append-icon="customAppendIcon(showFilterComp.status, search, icon)"
    @click:append="showFilterComp.status = !showFilterComp.status"
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
    filter: {
      type: Object as PropType<{status: boolean}>,
      default: () => ({status: false}),
    },
    icon: {
      type: Object as PropType<{active: string, passive: string}>,
      default: () => ({active: null, passive: null}),
    },
  },
  setup(props, { emit }) {
    const showFilterComp = computed({
      get: () => {
        return props.filter
      },
      set: (value) => {
        emit('input', value)
      },
    })
    const search = computed({
      get: () => {
        return props.value
      },
      set: (value) => {
        emit('input', value)
      },
    })

    // :append-icon="showFilterComp.status ? icon.active : icon.passive"
    const customAppendIcon = (status: Boolean, keyword: String, iconFilter: { active: string; passive: string }) => {
      if(!keyword) {
        if(status) {
          return iconFilter.active
        } else{
          return iconFilter.passive
        }
      } else {
        return null
      }
    }

    return {
      search,
      showFilterComp,
      customAppendIcon
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