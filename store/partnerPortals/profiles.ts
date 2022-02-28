// Interfaces and types
import { MutationTree, ActionTree } from 'vuex'
import { Profile } from '~/types/partnerPortals/profiles'

export const state = () => ({
  profiles: {} as Profile,
})

export type RootStateProfiles = ReturnType<typeof state>

export const mutations: MutationTree<RootStateProfiles> = {
  SET_PROFILE: (state, value: Profile) => {
    state.profiles = value
  },
}

export const actions: ActionTree<RootStateProfiles, RootStateProfiles> = {
  async getProfiles({ commit }, id: string) {
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
}
