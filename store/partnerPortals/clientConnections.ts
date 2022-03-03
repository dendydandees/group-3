// Interfaces
import { MutationTree, ActionTree } from 'vuex'
import { Meta } from '~/types/applications'
import {
  ClientConnections,
  FilterClientConnections,
  Params,
} from '~/types/partnerPortals/clientConnections'

const filter = {
  name: '',
  status: '',
} as FilterClientConnections

export const state = () => ({
  clientConnections: [] as ClientConnections[],
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 10,
  } as Meta,
  filter: filter as FilterClientConnections,
})

export type RootStateClientConnections = ReturnType<typeof state>

export const mutations: MutationTree<RootStateClientConnections> = {
  SET_CLIENT_CONNECTIONS: (state, value: ClientConnections[]) =>
    (state.clientConnections = value),
  SET_META: (state, value: Meta) => (state.meta = value),
  SET_FILTER: (state, value: FilterClientConnections) => (state.filter = value),
  RESET_FILTER: (state) => (state.filter = filter),
}

export const actions: ActionTree<
  RootStateClientConnections,
  RootStateClientConnections
> = {
  async getClientConnections({ commit }, params: Params) {
    try {
      const response = await this.$axios.$get(
        `api/clients/client-connection-requests`,
        { params }
      )
      const { data, page, totalPage, totalCount } = response

      if (!data) throw response

      commit('SET_CLIENT_CONNECTIONS', data)
      commit('SET_META', {
        page,
        totalPage,
        totalCount,
      })

      return data
    } catch (error) {
      return error
    }
  },
  async acceptClientConnections(_store, id: string) {
    try {
      const response = await this.$axios.$patch(
        `api/clients/client-connection-requests/${id}`
      )

      return response
    } catch (error) {
      return error
    }
  },
}
