// Interfaces
import { MutationTree, ActionTree } from 'vuex';
import { ServiceType, Zone, CountryCode, Ports } from '~/types/filters';
import { Meta } from '~/types/applications';

export const state = () => ({
  countryCodes: [] as CountryCode[],
  zones: [] as Zone[],
  serviceTypes: [] as ServiceType[],
  ports: {} as Ports,
  loaded: false as Boolean,
});

export type RootStateFilter = ReturnType<typeof state>;

export const mutations: MutationTree<RootStateFilter> = {
  SET_COUNTRY_CODE: (state, value: CountryCode[]) =>
    (state.countryCodes = value),
  SET_ZONES: (state, value: Zone[]) => (state.zones = value),
  SET_SERVICE_TYPES: (state, value: ServiceType[]) =>
    (state.serviceTypes = value),
  SET_PORTS: (state, value: Ports) => (state.ports = value),
  SET_LOADED: (state, value: Boolean) => (state.loaded = value),
};

export const actions: ActionTree<RootStateFilter, RootStateFilter> = {
  async getOnce({ dispatch }) {
    await dispatch('getZones', { params: {} });
    await dispatch('getServiceTypes');
  },
  async getCountryCodes(
    { commit },
    { params }: { params: { isActive: boolean; }; }
  ) {
    try {
      const uri = `?active_only=${ params?.isActive ? '1' : '' }`;
      const response = (await this.$axios.$get(
        `/api/data/country-codes${ uri }`
      )) as Record<string, string>;

      let temp = [] as CountryCode[];

      if (response) {
        temp = Object.entries(response).map((el) => {
          return {
            name: el[0],
            value: el[1],
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
    try {
      const response = await this.$axios.$get(`/api/clients/zones`, { params });
      const { zones } = response;

      if (!zones) {
        commit('SET_ZONES', []);
        throw response;
      }

      commit('SET_ZONES', zones);

      return response;
    } catch (error) {
      return error;
    }
  },
  async getServiceTypes({ commit }) {
    try {
      const response = await this.$axios.$get('/api/clients/serviceTypes');
      const { serviceTypes } = response;

      if (!serviceTypes) throw response;

      commit('SET_SERVICE_TYPES', serviceTypes);

      return response;
    } catch (error) {
      return error;
    }
  },
  async getPorts(
    { commit },
    { params, country }: { params: Meta; country?: string; }
  ) {
    try {
      const uri = country ? `?country=${ country ?? '' }` : '';
      const response = await this.$axios.$get(`/api/data/ports${ uri }`, {
        params,
      });

      commit('SET_PORTS', response);

      return response;
    } catch (error) {
      return error;
    }
  },
};
