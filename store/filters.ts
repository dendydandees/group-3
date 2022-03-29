// Interfaces
import { MutationTree, ActionTree } from 'vuex'
import { ServiceType, Zone, CountryCode } from '~/types/filters'

export const state = () => ({
  countryCodes: [] as CountryCode[],
  zones: [] as Zone[],
  serviceTypes: [] as ServiceType[],
  loaded: false as Boolean,
})

export type RootStateFilter = ReturnType<typeof state>

export const mutations: MutationTree<RootStateFilter> = {
  SET_COUNTRY_CODE: (state, value: CountryCode[]) =>
    (state.countryCodes = value),
  SET_ZONES: (state, value: Zone[]) => (state.zones = value),
  SET_SERVICE_TYPES: (state, value: ServiceType[]) =>
    (state.serviceTypes = value),
  SET_LOADED: (state, value: Boolean) => (state.loaded = value),
}

export const actions: ActionTree<RootStateFilter, RootStateFilter> = {
  async getOnce({ dispatch }) {
    await dispatch('getZones', { params: {} })
    await dispatch('getServiceTypes')
  },
  async getCountryCodes({ commit }) {
    try {
      const response = (await this.$axios.$get('/api/country-codes')) as Record<
        string,
        string
      >

      let temp = [] as CountryCode[]

      if (response) {
        temp = Object.entries(response).map((el) => {
          return {
            name: el[0],
            value: el[1],
          }
        })
      }

      commit('SET_COUNTRY_CODE', temp)

      return response
    } catch (error) {
      return error
    }
  },
  async getZones({ commit }, { params }: { params: { country: string } }) {
    const uri = params ? `?country=${params.country ?? ''}` : ''

    try {
      const response = await this.$axios.$get(`/api/clients/zones${uri}`)
      const { zones } = response

      if (!zones) {
        commit('SET_ZONES', [])
        throw response
      }

      commit('SET_ZONES', zones)

      return response
    } catch (error) {
      return error
    }
  },
  async getServiceTypes({ commit }) {
    try {
      const response = await this.$axios.$get('/api/clients/serviceTypes')
      const { serviceTypes } = response

      if (!serviceTypes) throw response

      commit('SET_SERVICE_TYPES', serviceTypes)

      return response
    } catch (error) {
      return error
    }
  },
}
