// types
import { MutationTree, ActionTree } from 'vuex'
import { Meta } from '~/types/applications'
import { LControl } from '~/types/lControl/lControl'

export const state = () => ({
  lControls: [] as LControl[] | [],
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 8,
  } as Meta,
})

export type RootStateLControls = ReturnType<typeof state>

export const mutations: MutationTree<RootStateLControls> = {
  SET_LCONTROLS: (state, value: LControl[] | []) => (state.lControls = value),
  SET_META: (state, value: Meta) => (state.meta = value),
}

export const actions: ActionTree<RootStateLControls, RootStateLControls> = {
  async getAllLControl(
    { commit },
    { country, serviceType }: { country: string; serviceType: string }
  ) {
    try {
      const data = await this.$axios.$get('/api/clients/lcontrol', {
        params: {
          country,
          service_type: serviceType,
        },
      })

      commit('SET_LCONTROLS', data || [])

      return data
    } catch (error) {
      return error
    }
  },
  async updateLControl(_store, data: LControl) {
    try {
      return await this.$axios.$put('/api/clients/lcontrol', data)
    } catch (error) {
      return error
    }
  },
  async addBOB(_store, country: string) {
    try {
      const dataUser = JSON.parse(localStorage.getItem('auth.user') as any)
      const response = await this?.$axios?.$post(
        `/api/clients/${dataUser?.clientId}/use-bob?country=${country}`
      )
      return response
    } catch (error) {
      return error
    }
  },
  async deleteBOB(_store, country: string) {
    try {
      const dataUser = JSON.parse(localStorage.getItem('auth.user') as any)
      const response = await this?.$axios?.$delete(
        `/api/clients/${dataUser?.clientId}/use-bob?country=${country}`
      )

      return response
    } catch (error) {
      return error
    }
  },
}
