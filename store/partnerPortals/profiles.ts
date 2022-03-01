// Interfaces and types
import { MutationTree, ActionTree } from 'vuex'
import { Profile } from '~/types/partnerPortals/profiles'

export const state = () => ({
  profile: {} as Profile,
})

export type RootStateProfiles = ReturnType<typeof state>

export const mutations: MutationTree<RootStateProfiles> = {
  SET_PROFILE: (state, value: Profile) => {
    state.profile = value
  },
}

export const actions: ActionTree<RootStateProfiles, RootStateProfiles> = {
  async getProfile({ commit }, id: string) {
    try {
      const data = await this?.$axios?.$get(
        `/api/clients/partners/${id}/profile`
      )

      commit('SET_PROFILE', data)

      return data
    } catch (error) {
      return error
    }
  },
  async editProfile(_store, { id, data }: { id: string; data: Profile }) {
    try {
      const response = await this.$axios.$patch(
        `/api/clients/partners/${id}/profile`,
        data
      )

      return response
    } catch (error) {
      return error
    }
  },
}
