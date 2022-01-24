import { MutationTree, ActionTree } from 'vuex'
// Interfaces
import { Orders, OrdersMeta } from '~/types/orders'

export const state = () => ({
  orders: [] as Orders[] | [],
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 10,
  } as OrdersMeta,
})

export type RootStateOrders = ReturnType<typeof state>

export const mutations: MutationTree<RootStateOrders> = {
  SET_ORDERS: (state, value: Orders[] | []) => (state.orders = value),
  SET_META: (state, value: OrdersMeta) => (state.meta = value),
}

export const actions: ActionTree<RootStateOrders, RootStateOrders> = {
  async getOrders({ commit }, { params }) {
    try {
      const response = await this?.$axios?.$get('/api/clients/orders', {
        params,
      })
      const { data, page, totalPage, totalCount } = response

      if (!data) throw response

      const meta = {
        page,
        totalPage,
        totalCount,
      }

      commit('SET_ORDERS', data)
      commit('SET_META', meta)

      return response
    } catch (error: any) {
      return error
    }
  },
}
