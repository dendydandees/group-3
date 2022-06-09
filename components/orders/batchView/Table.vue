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
        <span>
          {{ item.currency ? setPrice(item.value, item.currency) : '' }}
        </span>
      </template>

      <!-- eslint-disable vue/valid-v-slot -->
      <template #body.append="{ items }">
        <tr v-if="items.length">
          <td class="font-weight-bold">Service Total</td>

          <td class="font-weight-bold error--text">
            {{ items[0] && items[0].currency ? setTotal() : '' }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

// interfaces and types
export interface Select {
  country: string
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
        return {
          ...props.dataTable,
          content: [...props.dataTable.content].filter((x: any) => x.value)
            .length
            ? [...props.dataTable.content]
            : [],
        }
      }
    })

    function setPrice(price: number, currency: string) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
        currency,
      }).format(price)
    }
    function setTotal() {
      const total = props.dataTable.content.reduce(function (
        a: Number | unknown,
        b: any
      ) {
        return a + b.value
      },
      0)
      // get the highest occurrence of currency
      const currency = [...props.dataTable.content]
        ?.sort(
          (itemA: any, itemB: any) =>
            props.dataTable.content.filter(
              (value: any) => value.currency === itemA.currency
            ).length -
            props.dataTable.content.filter(
              (value: any) => value === itemB.currency
            ).length
        )
        ?.pop()?.currency as string

      return currency ? setPrice(total, currency) : ''
    }

    return {
      dataTableComp,
      setPrice,
      setTotal,
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
