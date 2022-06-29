import { defineNuxtMiddleware } from '@nuxtjs/composition-api'

export default defineNuxtMiddleware(({ from, route, store }) => {
  if (!from.path.includes(route.path) && !route.path.includes(from.path)) {
    store.commit('applications/RESET_PAGINATION')

    if (route.name?.includes('orders')) {
      store.commit('orders/RESET_FILTER_ORDERS')
      store.commit('orders/RESET_FILTER_BATCH')
      store.commit('orders/RESET_ORDER_TAB_VIEW')
      store.commit('partnerPortals/incomingOrders/RESET_FILTER')
    } else if (route.name?.includes('marketplace')) {
      store.commit('marketplaces/marketplaces/RESET_FILTER')
      store.commit('marketplaces/marketplaces/RESET_DETAIL_MARKETPLACE')
      store.commit('marketplaces/marketplaces/RESET_PAGE_VIEW')
    }
  }
})
