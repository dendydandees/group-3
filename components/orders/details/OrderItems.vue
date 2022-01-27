<template>
  <v-data-table
    v-bind="tableSettings"
    :items="orderItems"
    :loading="fetchState.pending"
    class="elevation-0"
  >
    <template #[`item.price`]="{ item }">
      {{ item.currency }} {{ setPrice(item.price) }}
    </template>

    <template #footer>
      <v-divider class="my-4" />

      <p class="ma-0 text-right font-weight-bold">
        Total
        <span class="primary--text title ml-2">
          {{ setTotal() }}
        </span>
      </p>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  useStore,
} from '@nuxtjs/composition-api'
import { OrderItem, VuexModuleOrders } from '~/types/orders'

export default defineComponent({
  props: {
    fetchState: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const store = useStore<VuexModuleOrders>()
    const orderItems = computed(
      () => store.state.orders.orderDetails.orderItems
    )
    const tableSettings = reactive({
      itemKey: 'id',
      hideDefaultFooter: true,
      headers: [
        {
          text: 'Product Code',
          value: 'productCode',
        },
        {
          text: 'SKU',
          value: 'sku',
        },
        {
          text: 'Category',
          value: 'category',
        },
        {
          text: 'Description',
          value: 'description',
        },
        {
          text: 'Quantity',
          value: 'quantity',
        },
        {
          text: 'Price',
          value: 'price',
        },
      ],
    })
    const setPrice = (price: string) => {
      return parseFloat(price).toFixed(2)
    }
    const setTotal = () => {
      const orderItems = store.state.orders.orderDetails.orderItems
      const totalPrice = orderItems.reduce(
        (previous: number, current: OrderItem) => {
          const total = previous + parseFloat(current.price)

          return total
        },
        0
      )
      const currency = orderItems.length !== 0 ? orderItems[0].currency : ''

      return `${currency} ${totalPrice.toFixed(2)}`
    }

    return {
      orderItems,
      tableSettings,
      setPrice,
      setTotal,
    }
  },
})
</script>
