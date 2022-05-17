<template>
  <v-data-table
    v-bind="tableSettings"
    :items="orderItems"
    :loading="fetchState.pending"
    :items-per-page="-1"
    class="elevation-0"
  >
    <template #[`item.price`]="{ item }">
      {{ item.currency }} {{ setPrice(item.price) }}
    </template>

    <template #footer>
      <p class="ma-0 mt-6 text-right font-weight-bold">
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
import { VuexModuleIncomingOrders } from '~/types/partnerPortals/incomingOrders'

export default defineComponent({
  props: {
    fetchState: {
      type: Object,
      default: () => ({}),
    },
    isUpcoming: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const storeOrders = useStore<VuexModuleOrders>()
    const storeIncomingOrders = useStore<VuexModuleIncomingOrders>()
    const orderItems = computed(() => {
      return props.isUpcoming
        ? storeIncomingOrders.state.partnerPortals.incomingOrders
            .incomingOrderDetails?.order?.order?.items
        : storeOrders.state.orders.orderDetails.orderItems
    })

    const tableSettings = reactive({
      itemKey: 'id',
      hideDefaultFooter: true,
      headers: [
        {
          text: 'Product ID',
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
      const orderItemsTemp =
        orderItems.value && orderItems.value.length > 0 ? orderItems.value : []
      const totalPrice = orderItemsTemp.reduce(
        (previous: number, current: OrderItem) => {
          const total =
            previous + parseFloat(current.price as unknown as string)

          return total
        },
        0
      )
      const currency =
        orderItemsTemp.length !== 0 ? orderItemsTemp[0].currency : ''

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
