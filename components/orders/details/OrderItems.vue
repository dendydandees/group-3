<template>
  <v-data-table
    v-bind="tableSettings"
    :items="orderItems"
    :loading="fetchState.pending"
    :items-per-page="-1"
    class="elevation-0"
  >
    <template #[`item.price`]="{ item }">
      {{ setPrice(item.price, item.currency) }}
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
    const setPrice = (price: string, currency: string) => {
      if (!price || !currency) return ''

      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
        currency,
      }).format(parseFloat(price))
    }
    const setTotal = () => {
      if (!orderItems.value && orderItems.value.length === 0) return ''

      const totalPrice = orderItems.value.reduce(
        (previous: number, current: OrderItem) => {
          const total =
            previous + parseFloat(current.price as unknown as string)

          return total
        },
        0
      )
      // get the highest occurrence of currency
      const currency = [...orderItems.value]
        ?.sort(
          (itemA: any, itemB: any) =>
            orderItems.value.filter(
              (value: any) => value.currency === itemA.currency
            ).length -
            orderItems.value.filter((value: any) => value === itemB.currency)
              .length
        )
        ?.pop()?.currency as string

      if (!currency) return ''

      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
        currency,
      }).format(totalPrice)
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
