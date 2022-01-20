<template>
  <section class="ma-4 ma-md-6 my-8 my-md-10">
    <h1 class="mb-6 display-1 font-weight-bold">Manage Orders</h1>
    <p v-if="$fetchState.loading">Loading...</p>
    <div>
      {{ orders }}
    </div>
  </section>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  useFetch,
  useStore,
} from '@nuxtjs/composition-api'
// Interfaces or types
import { Orders, VuexModuleOrders } from '~/types/orders'

export default defineComponent({
  name: 'DashboardPage',
  setup() {
    const store = useStore<VuexModuleOrders>()
    const stateOfOrdersModule = store.state.orders
    const orders = computed(() => stateOfOrdersModule.orders) as ComputedRef<
      Orders[]
    >
    const getOrders = () => {
      store.dispatch('orders/getOrders')
    }

    useFetch(() => {
      getOrders()
    })

    return {
      orders,
    }
  },
})
</script>
