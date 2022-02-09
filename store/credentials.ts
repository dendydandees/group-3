import { MutationTree, ActionTree } from 'vuex'
import { Meta } from '~/types/applications'
import { Credential, GenerateCredential } from '~/types/credentials'

export const state = () => ({
  credentials: [] as Credential[] | [],
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 10,
  } as Meta,
})

export type RootStateCredentials = ReturnType<typeof state>

export const mutations: MutationTree<RootStateCredentials> = {
  SET_CREDENTIALS: (state, value: Credential[] | []) =>
    (state.credentials = value),
  SET_META: (state, value: Meta) => (state.meta = value),
}

export const actions: ActionTree<RootStateCredentials, RootStateCredentials> = {
  async getCredentials({ commit }, { params }) {
    try {
      const response = await this?.$axios?.$get('/api/clients/credentials', {
        params,
      })
      const { data = [], page, totalPage, totalCount } = response

      commit('SET_CREDENTIALS', data)
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
  async revokeKey(_store, { id }: { id: string }) {
    try {
      const response = await this?.$axios?.$patch(
        `/api/clients/credentials/${id}`
      )

      return response
    } catch (error) {
      return error
    }
  },
  async generateKey(_store, { body }: { body: GenerateCredential }) {
    try {
      const response = await this.$axios.$post('api/clients/credentials', body)

      return response
    } catch (error) {
      return error
    }
  },
}
