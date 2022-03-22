// Interfaces
import { MutationTree, ActionTree } from 'vuex';
import { Meta } from '~/types/applications';
import {
  ServiceType,
  Zone
} from '~/types/filters';

export const state = () => ({
  countryCodes: [] as any | [],
  zones: [] as Zone[] | [],
  serviceTypes: [] as ServiceType[] | [],
  loaded: false as Boolean
});

export type RootStateFilter = ReturnType<typeof state>;

export const mutations: MutationTree<RootStateFilter> = {
  SET_COUNTRY_CODE: (state, value: any | []) => (
    state.countryCodes = value
  ),
  SET_ZONES: (state, value: Zone[] | []) => (
    state.zones = value
  ),
  SET_SERVICE_TYPES: (state, value: ServiceType[] | []) => (state.serviceTypes = value),
  SET_LOADED: (state, value: Boolean) => (state.loaded = value),
};

export const actions: ActionTree<RootStateFilter, RootStateFilter> = {
  async getOnce({ dispatch, commit, state }) {
    // if (!state.loaded) {
    await dispatch('getZones', { params: {} });
    await dispatch('getServiceTypes');
    // commit('SET_LOADED', true);
    // }
  },
  async getCountryCodes({ commit }) {
    try {
      const response = await this?.$axios?.$get('/api/country-codes');

      if (!response) throw response;
      let temp = [] as any;
      if (response) {
        temp = Object.entries(response);
        temp = temp.map((el: any) => {
          return {
            name: el[0],
            value: el[1]
          };
        });
      }
      commit('SET_COUNTRY_CODE', temp);

      return response;
    } catch (error) {
      return error;
    }
  },
  async getZones({ commit }, { params }: { params: { country: string; }; }) {
    const uri = params
      ? `?country=${ params.country ?? '' }`
      : '';
    try {
      const response = await this?.$axios?.$get(`/api/clients/zones${ uri }`);
      const { zones } = response;

      if (!zones) throw response;

      commit('SET_ZONES', zones);

      return response;
    } catch (error) {
      return error;
    }
  },
  async getServiceTypes({ commit }) {
    try {
      const response = await this?.$axios?.$get('/api/clients/serviceTypes');
      const { serviceTypes } = response;

      if (!serviceTypes) throw response;

      commit('SET_SERVICE_TYPES', serviceTypes);

      return response;
    } catch (error) {
      return error;
    }
  },
};
