// Interfaces
import { MutationTree } from 'vuex'
import { Meta } from '~/types/applications'
import { ClientConnections } from '~/types/clientConnections'

export const state = () => ({
  clientConnections: [] as ClientConnections | [],
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 10,
  } as Meta,
})

export type RootStateClientConnections = ReturnType<typeof state>

export const mutations: MutationTree<RootStateClientConnections> = {
  SET_CLIENT_CONNECTIONS: (state, value: ClientConnections) =>
    (state.clientConnections = value),
  SET_META: (state, value: Meta) => (state.meta = value),
}
