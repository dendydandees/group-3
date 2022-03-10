// Interfaces
import { MutationTree, ActionTree } from 'vuex';
import { Meta } from '~/types/applications';
import {
  ServiceType,
  Zone
} from '~/types/filters';

export const state = () => ({
  zones: [] as Zone[] | [],
  serviceTypes: [] as ServiceType[] | [],
  loaded: false as Boolean
});

export type RootStateFilter = ReturnType<typeof state>;

export const mutations: MutationTree<RootStateFilter> = {
  SET_ZONES: (state, value: Zone[] | []) => (
    state.zones = value
  ),
  SET_SERVICE_TYPES: (state, value: ServiceType[] | []) => (state.serviceTypes = value),
  SET_LOADED: (state, value: Boolean) => (state.loaded = value),
};

export const actions: ActionTree<RootStateFilter, RootStateFilter> = {
  async getOnce({ dispatch, commit, state }) {
    if (!state.loaded) {
      await dispatch('getZones');
      await dispatch('getServiceTypes');
      commit('SET_LOADED', true);
    }
  },
  async getZones({ commit }) {
    try {
      const response = await this?.$axios?.$get('/api/clients/zones');
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
