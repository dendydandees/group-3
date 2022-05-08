import { MutationTree, ActionTree } from 'vuex'

export const state = () => ({
  analytics: '',
})

export type RootStateDashboard = ReturnType<typeof state>

export const mutations: MutationTree<RootStateDashboard> = {
  SET_ANALYTICS: (state, value: string) => (state.analytics = value),
}

export const actions: ActionTree<RootStateDashboard, RootStateDashboard> = {
  async getAnalytics({ commit }) {
    try {
      const response = await this.$axios.$get('/api/clients/analytics/metabase')
      const { endpoint } = response

      if (!endpoint) throw response

      commit('SET_ANALYTICS', endpoint)
    } catch (error) {
      return error
    }
  },
}
