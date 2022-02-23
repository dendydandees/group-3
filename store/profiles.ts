import { MutationTree, ActionTree } from 'vuex'
import { Meta, Pagination } from '~/types/applications'
import {
  Credential,
  GenerateCredential,
  ResetPasswordParams,
} from '~/types/profiles'

interface GetCredentials {
  params: Pagination
}

interface RevokeKey {
  id: string
}

interface GenerateKey {
  body: GenerateCredential
}

interface ResetPassword {
  body: ResetPasswordParams
}

export const state = () => ({
  credentials: [] as Credential[] | [],
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 10,
  } as Meta,
})

export type RootStateProfiles = ReturnType<typeof state>

export const mutations: MutationTree<RootStateProfiles> = {
  SET_CREDENTIALS: (state, value: Credential[] | []) =>
    (state.credentials = value),
  SET_META: (state, value: Meta) => (state.meta = value),
}

export const actions: ActionTree<RootStateProfiles, RootStateProfiles> = {
  async getCredentials({ commit }, { params }: GetCredentials) {
    try {
      const response = await this?.$axios?.$get('/api/clients/credentials', {
        params,
      })
      const { data = [], page, totalPage, totalCount } = response

      commit('SET_CREDENTIALS', data ?? [])
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
  async revokeKey(_store, { id }: RevokeKey) {
    try {
      const response = await this?.$axios?.$patch(
        `/api/clients/credentials/${id}`
      )

      return response
    } catch (error) {
      return error
    }
  },
  async generateKey(_store, { body }: GenerateKey) {
    try {
      const response = await this.$axios.$post('api/clients/credentials', body)

      return response
    } catch (error) {
      return error
    }
  },
  async resetPassword(_store, { body }: ResetPassword) {
    try {
      const response = await this.$axios.$patch('api/user/password', body)

      return response
    } catch (error) {
      return error
    }
  },
}
