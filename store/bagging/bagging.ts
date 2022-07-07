// Interfaces
import { MutationTree, ActionTree } from 'vuex';
import { Meta } from '~/types/applications';
import {
  FilterBagging,
  BagData,
  InputPostBag,
  Bagged,
  Unbagged,
  BagUpdate,
  TabState,
  BagDataPartner,
  InputLabelBags
} from '~/types/bagging/bagging';
import tempData from '~/static/tempData';


export const filterBaggingInit = {
  createdFrom: '',
  createdTo: '',
  client: '',
  destination: ''
} as FilterBagging;

const filter = {
  createdFrom: '',
  createdTo: '',
  client: '',
  destination: ''
} as FilterBagging;

export const state = () => ({
  bags: [] as Bagged[],
  unbagged: [] as Unbagged[],
  bagUpdates: [] as BagUpdate[],
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 8,
  } as Meta,
  filter,
  isShowFilter: false,
  tab: {
    orderView: {
      '0': 0,
      '1': 0
    },
    step: 0
  } as TabState,
  bagsPartner: [] as Unbagged[],
  unbaggedPartner: [] as Unbagged[],
});

export type RootStateBagging = ReturnType<typeof state>;

export const mutations: MutationTree<RootStateBagging> = {
  SET_DATA: (state, value: BagData) => {
    state.bags = value.bagged ?? [];
    state.unbagged = value.unbagged ?? [];
  },
  SET_BAG_UPDATE: (state, value: BagUpdate[]) => (state.bagUpdates = value ?? []),
  SET_META: (state, value: Meta) => (state.meta = value),
  SET_FILTER: (state, value: FilterBagging) => (state.filter = value),
  SET_FILTER_BTN: (state) => (state.isShowFilter = !state.isShowFilter),
  SET_TAB_BTN: (state, value: TabState) => (state.tab = value),
  RESET_FILTER: (state) => (state.filter = filterBaggingInit),
  SET_DATA_PARTNER_BAG: (state, value: BagDataPartner) => {
    state.bagsPartner = value.bagged ?? [];
    state.unbaggedPartner = value.unbagged ?? [];
  },
};

export const actions: ActionTree<RootStateBagging, RootStateBagging> =
{
  async getBags({ commit }) {
    try {
      const response = await this.$axios.$get('/api/clients/bags');

      if (!response) throw response;

      commit('SET_DATA', response);
      // commit('SET_META', meta);
      return response;
    } catch (error) {
      return error;
    }
  },
  async postBags({ commit }, { payload }: { payload: InputPostBag; }) {
    try {
      const response = await this.$axios.$post('/api/clients/bags', payload
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  async postScanPartner({ commit }, { orderIDs }: { orderIDs: string[]; }) {
    try {
      const response = await this.$axios.$post(
        `/api/clients/scan`,
        { order_ids: orderIDs }
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  async getBagsUpdate({ commit }, { bagID }: { bagID: string; }) {
    try {
      const response = await this.$axios.$get(`/api/clients/bags/${ bagID }/updates`);

      if (!response) throw response;

      commit('SET_BAG_UPDATE', response.bag_updates);
      // commit('SET_BAG_UPDATE', tempData.bagging.bag_updates);

      return response;
    } catch (error) {
      return error;
    }
  },
  async getMAWBUpdate({ commit }, { bagID, payload }: { bagID: string, payload: { mawb: string; }; }) {
    try {
      const response = await this.$axios.$patch(
        `/api/clients/bags/${ bagID }`,
        payload
      );

      if (!response) throw response;

      commit('SET_BAG_UPDATE', response.bag_updates);

      return response;
    } catch (error) {
      return error;
    }
  },
  async getBagsPartner({ commit }, { partnerID }: { partnerID: string; }) {
    try {
      const response = await this.$axios.$get(`/api/clients/partners/${ partnerID }/bags`);

      if (!response) throw response;

      commit('SET_DATA_PARTNER_BAG', response);
      // commit('SET_META', meta);
      return response;
    } catch (error) {
      return error;
    }
  },
  async postLabelBags({ commit }, { payload }: { payload: InputLabelBags; }) {
    try {
      const response = await this.$axios.$post('/api/clients/label/bags', payload
      );
      return response;
    } catch (error) {
      return error;
    }
  },

};
