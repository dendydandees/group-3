import { defineNuxtMiddleware } from '@nuxtjs/composition-api'

export default defineNuxtMiddleware(({ from, route, store }) => {
  if (!from.path.includes(route.path) && !route.path.includes(from.path)) {
    store.commit('applications/RESET_PAGINATION')

    if (route.name?.includes('orders-process')) {
      store.commit('orders/RESET_FILTER')
    }
  }
})
