import { MutationTree, ActionTree } from 'vuex'
// types
import { Tracking } from '~/types/trackings'

export const state = () => ({
  tracking: {} as Tracking,
})

export type RootStateTracking = ReturnType<typeof state>

export const mutations: MutationTree<RootStateTracking> = {
  SET_TRACKING: (state, value: Tracking) => (state.tracking = value),
}

export const actions: ActionTree<RootStateTracking, RootStateTracking> = {
  async getTrackingOrder({ commit }, { orderId }: { orderId: string }) {
    try {
      const data = await this.$axios.$get(`/api/order/status/${orderId}`)

      commit('SET_TRACKING', data)

      return data
    } catch (error) {
      return error
    }
  },
}
