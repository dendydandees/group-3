<template>
  <v-row align="center" justify="space-between">
    <v-col cols="12" md="auto">
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
        class="input-select-filter elevation-1"
        :style="[{ width: $vuetify.breakpoint.mobile ? '100%' : '50%' }]"
        @change="$emit('resetPage')"
      />
    </v-col>

    <v-col cols="12" md="auto">
      <v-pagination
        v-model="pagination.page"
        :length="meta.totalPage"
        :total-visible="7"
        :disabled="loading"
        circle
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@nuxtjs/composition-api'
import { Pagination } from '~/types/applications'

export default defineComponent({
  name: 'BasePagination',
  props: {
    value: {
      type: Object as PropType<Pagination>,
      required: true,
    },
    meta: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const pagination = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })
    const itemsPerPageOptions = computed(() => {
      const textDefault = 'Items/Page'
      const values = [5, 10, 15, 20]

      return values.map((value) => ({
        text: `${value} ${textDefault}`,
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
