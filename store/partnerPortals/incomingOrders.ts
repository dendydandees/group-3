// Interfaces
import { MutationTree, ActionTree } from 'vuex'
import { Meta } from '~/types/applications'
import {
  IncomingOrder,
  FilterOrders,
} from '~/types/partnerPortals/incomingOrders'

const filter = {
  search: '',
} as FilterOrders

export const state = () => ({
  incomingOrders: [] as IncomingOrder | [],
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 10,
  } as Meta,
  filter: filter as FilterOrders,
})

export type RootStateIncomingOrders = ReturnType<typeof state>

export const mutations: MutationTree<RootStateIncomingOrders> = {
  SET_CLIENT_CONNECTIONS: (state, value: IncomingOrder) =>
    (state.incomingOrders = value),
  SET_META: (state, value: Meta) => (state.meta = value),
  SET_FILTER: (state, value: FilterOrders) => (state.filter = value),
  RESET_FILTER: (state) => (state.filter = filter),
}

export const actions: ActionTree<
  RootStateIncomingOrders,
  RootStateIncomingOrders
> = {
  async getIncomingOrders(
    { commit },
    { id, params }: { id: string; params: Meta }
  ) {
    try {
      const response = await this.$axios.$get(
        `/api/clients/partners/${id}/orders`,
        {
          params,
        }
      )
      const { data, page, totalPage, totalCount } = response

      if (!data) throw response

      commit('SET_CLIENT_CONNECTIONS', data)
      commit('SET_META', {
        page,
        totalPage,
        totalCount,
      })

      return response
    } catch (error) {
      return error
    }
  },
}
