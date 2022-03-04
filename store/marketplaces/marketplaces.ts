// Interfaces
import { MutationTree, ActionTree } from 'vuex';
import { Meta } from '~/types/applications';
import {
  Marketplace,
  FilterDetails,
  PaginationMarketplaces
} from '~/types/marketplace/marketplace';
import {
  DetailMarketplace,
} from '~/types/marketplace/detail';

interface GetMarketplaces {
  params: Meta;
}

const filter = {
  // page: 1,
  // itemsPerPage: 8,
  search: '',
  country: '',
  service: ''
} as FilterDetails;

export const state = () => ({
  marketplaces: [] as Marketplace[] | [],
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 8,
  } as Meta,
  filter,
  detail: {} as DetailMarketplace | {},
});

export type RootStateMarketplaces = ReturnType<typeof state>;

export const mutations: MutationTree<RootStateMarketplaces> = {
  SET_MARKETPLACES: (state, value: Marketplace[] | []) => (state.marketplaces = value),
  SET_META: (state, value: Meta) => (state.meta = value),
  SET_FILTER: (state, value: FilterDetails) => (state.filter = value),
  RESET_FILTER: (state) => (state.filter = filter),
  SET_DETAIL_MARKETPLACE: (state, value: DetailMarketplace | {}) => (state.detail = value),
  RESET_DETAIL_MARKETPLACE: (state) => (state.detail = {} as DetailMarketplace | {})
};

export const actions: ActionTree<RootStateMarketplaces, RootStateMarketplaces> = {
  async getMarketplaces({ commit }, { params }: GetMarketplaces) {
    try {
      const response = await this?.$axios?.$get('/api/clients/partners', {
        params,
      });
      const { data, page, totalPage, totalCount } = response;

      if (!data) throw response;

      const meta = {
        page,
        totalPage,
        totalCount,
      };

      commit('SET_MARKETPLACES', data);
      commit('SET_META', meta);

      return response;
    } catch (error) {
      return error;
    }
  },
  async addConnection({ commit }, { id }: { id: String; }) {
    try {
      const response = await this?.$axios?.$post(`/api/clients/connections/${ id }`);

      return response;
    } catch (error) {
      return error;
    }
  },
  async getDetail({ commit }, id: string) {
    try {
      const response = await this?.$axios?.$get(`/api/clients/partner-details/${ id ?? '' }`);

      if (!response) throw response;
      commit('SET_DETAIL_MARKETPLACE', response);

      return response;
    } catch (error) {
      return error;
    }
  }
};