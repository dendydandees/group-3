<template>
  <div
    class="table-batch"
  >
    <v-data-table
      hide-default-footer
      :headers="dataTable.headers"
      :items="dataTable.content"
      item-key="name"
      disable-sort
    >
      <template #body.append>
        <tr>
          <td
            class="font-weight-bold"
          >
            Service Total
          </td>
          <td
            class="font-weight-bold error--text"
          >
            USD 0.00
          </td>
        </tr>
      </template>
    </v-data-table>

  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  Ref,
  useStore,
  useRouter,
  onMounted,
  watch,
} from '@nuxtjs/composition-api'
import { ValidationObserver } from 'vee-validate'

// interfaces and types

export interface Select {
  country: string
}

interface ErrorUpload {
  data: {
    error: string
    ErrorDetails: { field: string; reason: string; note: string }[]
  }
}

export default defineComponent({
  name: 'TableBatch',
  props: {
    dataTable: {
      type: Object,
      required: true,
    },
  },
  setup(props) {

    return {
    }
  },
})
</script>

<style lang="scss">
@import '~/assets/scss/color.module.scss';
  .table-batch {
    .theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
      border-bottom: hidden !important;
    }
    .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
      border-bottom: hidden !important;
    }
  }
</style>
