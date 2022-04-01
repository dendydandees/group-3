// Interfaces
import { MutationTree, ActionTree } from 'vuex';
// import imageToBase64 from 'image-to-base64';
import { Meta } from '~/types/applications';
import {
  Marketplace,
  FilterDetails,
  PaginationMarketplaces
} from '~/types/marketplace/marketplace';
import {
  DetailMarketplace,
  Gallery,
  DataGallery,
  DetailProfile
} from '~/types/marketplace/detail';

interface GetMarketplaces {
  params: {
    page: string,
    perPage: string,
    search: string,
    country: string,
    service: string[];
    zone: string,
    port: string;
  },
  isLControl: Boolean,
  isConnected?: Boolean;
}

const filter = {
  // page: 1,
  // itemsPerPage: 8,
  search: '',
  country: '',
  service: '',
  port: '',
} as FilterDetails;

export const state = () => ({
  marketplacesAll: [] as Marketplace[] | [],
  marketplaces: [] as Marketplace[] | [],
  marketplacesLControl: [] as Marketplace[] | [],
  marketplacesConnected: [] as Marketplace[] | [],
  loadedLControl: false as Boolean,
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 8,
  } as Meta,
  filter,
  detail: {} as DetailMarketplace | {},
  galleries: [] as Gallery[] | [],
  detailProfile: {} as DetailProfile | {},
});

export type RootStateMarketplaces = ReturnType<typeof state>;

export const mutations: MutationTree<RootStateMarketplaces> = {
  SET_MARKETPLACES_ALL: (state, value: Marketplace[] | []) => (state.marketplacesAll = value),
  SET_MARKETPLACES: (state, value: Marketplace[] | []) => (state.marketplaces = value),
  SET_MARKETPLACES_LCONTROL: (state, value: Marketplace[] | []) => (state.marketplacesLControl = value),
  SET_MARKETPLACES_CONNECTED: (state, value: Marketplace[] | []) => (state.marketplacesConnected = value),
  SET_LOADED_LCONTROL: (state, value: Boolean) => (state.loadedLControl = value),
  SET_META: (state, value: Meta) => (state.meta = value),
  SET_FILTER: (state, value: FilterDetails) => (state.filter = value),
  RESET_FILTER: (state) => (state.filter = filter),
  SET_DETAIL_MARKETPLACE: (state, value: DetailMarketplace | {}) => (state.detail = value),
  SET_GALLERY: (state, value: Gallery[] | []) => (state.galleries = value),
  SET_DETAIL_PROFILE: (state, value: DetailProfile[] | []) => (state.detailProfile = value),
  RESET_DETAIL_MARKETPLACE: (state) => (state.detail = {} as DetailMarketplace | {})
};

export const actions: ActionTree<RootStateMarketplaces, RootStateMarketplaces> = {
  async getMarketplacesAll({ commit, state }) {
    try {
      const response = await this?.$axios?.$get(`/api/clients/partners?page=1&perPage=1000`);
      const { data, page, totalPage, totalCount } = response;

      if (!data) throw response;

      const meta = {
        page,
        totalPage,
        totalCount,
      };
      commit('SET_MARKETPLACES_ALL', data);

      return response;
    } catch (error) {
      return error;
    }
  },
  async getMarketplaces({ commit, state }, { params, isLControl }: GetMarketplaces) {
    let serviceParams = 'service=';
    if (params && params?.service.length > 0) {
      serviceParams = params.service.map((el, i) => {
        return `service=${ el }`;
      }).join('&');
    }
    const uri = params
      ? `?page=${ params.page ?? '' }&perPage=${ params.perPage ?? '' }&search=${ params.search ?? '' }&country=${ params.country ?? '' }&${ serviceParams ?? '' }&zone=${ params.zone ?? '' }&port=${ params.port ?? '' }`
      : '';
    try {
      const response = await this?.$axios?.$get(`/api/clients/partners${ uri }`);
      const { data, page, totalPage, totalCount } = response;

      if (!data) throw response;

      const meta = {
        page,
        totalPage,
        totalCount,
      };
      if (!isLControl) {
        commit('SET_MARKETPLACES', data);
        commit('SET_META', meta);

      }
      if (!state.loadedLControl || isLControl) {
        commit('SET_MARKETPLACES_LCONTROL', data);
        commit('SET_LOADED_LCONTROL', true);
      }

      return response;
    } catch (error) {
      return error;
    }
  },
  async getMarketplacesConnected({ commit, state }, { params }: GetMarketplaces) {
    let serviceParams = 'service=';
    if (params && params?.service.length > 0) {
      serviceParams = params.service.map((el, i) => {
        return `service=${ el }`;
      }).join('&');
    }
    const uri = params
      ? `?connection=connected&page=${ params.page ?? '' }&perPage=${ params.perPage ?? '' }&search=${ params.search ?? '' }&country=${ params.country ?? '' }&${ serviceParams ?? '' }&zone=${ params.zone ?? '' }`
      : '';
    try {
      const response = await this?.$axios?.$get(`/api/clients/partners${ uri }`);
      const { data, page, totalPage, totalCount } = response;

      if (!data) throw response;

      const meta = {
        page,
        totalPage,
        totalCount,
      };
      commit('SET_MARKETPLACES_CONNECTED', data);
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
      let temp = response?.partnerGallery;
      if (response?.partnerGallery?.length > 0) {
        temp = temp.map((el: Gallery) => {
          return { src: el.path };
        });
      }
      if (response?.partnerServiceTypes) {
        response.partnerServiceTypes = response.partnerServiceTypes.filter((el: any) => el.name);
      }
      commit('SET_DETAIL_MARKETPLACE', response);
      commit('SET_GALLERY', temp);
      // commit('SET_DETAIL_PROFILE', response);

      return response;
    } catch (error) {
      return error;
    }
  },
  async getGalleries({ commit }, id: string) {
    try {
      const response = await this?.$axios?.$get(`api/clients/partners/${ id ?? '' }/profile`);

      if (!response) throw response;
      let temp = response?.gallery;
      if (response?.gallery?.length > 0) {
        temp = temp.map((el: Gallery) => {
          return { src: el.path };
        });
      }

      if (response?.serviceType) {
        response.serviceType = response.serviceType.filter((el: any) => el.name);
      }

      commit('SET_GALLERY', temp);
      commit('SET_DETAIL_PROFILE', response);

      return response;
    } catch (error) {
      return error;
    }
  },
};
