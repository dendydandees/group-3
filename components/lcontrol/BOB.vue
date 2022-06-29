<template>
  <div>
    <v-switch
      v-model="userSelected.useBOB"
      inset
      :disabled="loading"
      color="#FF3D17"
      :style="`${!userSelected.country.value ? 'visibility: hidden;' : ''}`"
      class="ma-0"
      @change="(value) => $emit('handleBob', value)"
    >
      <template #label>
        <span
          :style="`color: ${
            userSelected.useBOB ? '#FF3D17' : '#1961E4'
          }; font-weight: 500;white-space: nowrap`"
        >
          BOB {{ userSelected.useBOB ? 'Activated' : 'Inactive' }}
        </span>

        <NuxtImg src="/images/qMark.svg" preload :height="18" class="ml-2" />
      </template>
    </v-switch>

    <v-card
      v-if="userSelected.country.value"
      class="pa-4"
      elevation="3"
      style="height: 100%"
    >
      <div class="d-flex align-center mb-3">
        <NuxtImg src="/images/qMark.svg" preload :height="18" class="mr-1" />

        <span style="color: #ff3d17; font-size: 13px; line-height: 16px">
          What is BOB?
        </span>
      </div>

      <div style="color: #1961e4; font-size: 14px; line-height: 17px">
        BOB will help you select the most suitable network partner based on our
        analytical data
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@nuxtjs/composition-api'
// types
import { UserSelectedLControl } from '~/types/lControl/lControl'

export default defineComponent({
  props: {
    value: {
      type: Object as PropType<UserSelectedLControl>,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const userSelected = computed({
      get: () => props.value,
      set: (value) => {
        emit('input', value)
      },
    })

    return { userSelected }
  },
})
</script>
