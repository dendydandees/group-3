<template>
  <!-- pagination -->
  <v-row align="center" justify="between">
    <v-col cols="12" md="4">
      <span
        :class="`d-block primary--text ${
          $vuetify.breakpoint.mobile ? 'text-center' : ''
        }`"
      >
        {{ totalItems }} Partners
      </span>
    </v-col>

    <v-col cols="12" md="4">
      <div class="d-flex align-center justify-center">
        <div>
          <v-btn
            fab
            small
            plain
            :disabled="pagination.page === 1 || loading"
            @click="$emit('handlePagination', '-')"
          >
            <v-icon dense color="black"> mdi-menu-left </v-icon>
          </v-btn>
        </div>

        <div class="px-3">
          {{ meta.page }}
        </div>

        <div>
          <v-btn
            fab
            small
            plain
            :disabled="pagination.page >= meta.totalPage || loading"
            @click="$emit('handlePagination', '+')"
          >
            <v-icon dense color="black"> mdi-menu-right </v-icon>
          </v-btn>
        </div>
      </div>
    </v-col>

    <v-col cols="12" md="4">
      <v-select
        v-model="pagination.itemsPerPage"
        :items="itemsPerPageOptions"
        :disabled="loading"
        hide-details
        outlined
        single-line
        dense
        rounded
        item-text="text"
        item-value="value"
        background-color="white"
        class="input-select-filter elevation-1 float-right"
        :style="[{ width: $vuetify.breakpoint.mobile ? '100%' : '50%' }]"
        @change="$emit('resetPage')"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@nuxtjs/composition-api'
// types
import { Meta, Pagination } from '~/types/applications'

interface PerPageOptions {
  data: number[]
  text: string
}

export default defineComponent({
  props: {
    value: {
      type: Object as PropType<Pagination>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    meta: {
      type: Object as PropType<Meta>,
      required: true,
    },
    perPageOptions: {
      type: Object as PropType<PerPageOptions>,
      default: () => ({
        data: [5, 10, 25, 50, 100],
        text: 'Items / Page',
      }),
    },
    totalItems: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const pagination = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })

    const itemsPerPageOptions = computed(() => {
      return props.perPageOptions.data.map((value) => ({
        text: `${value} ${props.perPageOptions.text}`,
        value,
      }))
    })

    return {
      pagination,
      itemsPerPageOptions,
    }
  },
})
</script>
