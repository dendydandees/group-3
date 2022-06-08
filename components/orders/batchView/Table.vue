<template>
  <div class="table-batch">
    <v-data-table
      hide-default-footer
      :headers="dataTableComp.headers"
      :items="dataTableComp.content"
      item-key="name"
      disable-sort
    >
      <template #[`item.value`]="{ item }">
       {{item.currency}} {{ setPrice(item.value) }}
      </template>
      <template #body.append="{ items }">
        <tr v-if="items.length">
          <td class="font-weight-bold">Service Total</td>
          <td class="font-weight-bold error--text">
            {{items[0] && items[0].currency ? items[0].currency  : ''}} {{ setTotal() }}
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
    isService: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const dataTableComp = computed(() => {
      if (props.isService) {
        return {
          ...props.dataTable,
          content: [...props.dataTable.content].filter((x: any) => x.value),
        }
      } else {
        return props.dataTable
      }
    })

    function setPrice(price: string) {
      return parseFloat(price).toFixed(2)
    }
    function setTotal() {
      return setPrice(
        props.dataTable.content.reduce(function (a: Number | unknown, b: any) {
          return a + b.value
        }, 0)
      )
    }

    return {
      setTotal,
      setPrice,
      dataTableComp,
    }
  },
})
</script>

<style lang="scss">
@import '~/assets/scss/color.module.scss';
.table-batch {
  .theme--light.v-data-table
    > .v-data-table__wrapper
    > table
    > thead
    > tr:last-child
    > th {
    border-bottom: hidden !important;
  }
  .theme--light.v-data-table
    > .v-data-table__wrapper
    > table
    > tbody
    > tr
    > td {
    border-bottom: hidden !important;
  }
}
</style>
