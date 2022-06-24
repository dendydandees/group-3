// Interfaces
import { MutationTree, ActionTree } from 'vuex';
import { Meta } from '~/types/applications';
import {
  FilterBagging,
  BagData,
  InputPostBag,
  Bagged,
  Unbagged
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
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 8,
  } as Meta,
  filter,
  isShowFilter: false,
  tab: {
    orderView: 0,
    step: 0
  }
});

export type RootStateBagging = ReturnType<typeof state>;

export const mutations: MutationTree<RootStateBagging> = {
  SET_DATA: (state, value: BagData) => {
    state.bags = value.bagged ?? [];
    state.unbagged = value.unbagged ?? [];
  },
  SET_META: (state, value: Meta) => (state.meta = value),
  SET_FILTER: (state, value: FilterBagging) => (state.filter = value),
  SET_FILTER_BTN: (state) => (state.isShowFilter = !state.isShowFilter),
  SET_TAB_BTN: (state, value: { orderView: number, step: number; }) => (state.tab = value),
  RESET_FILTER: (state) => (state.filter = filterBaggingInit),
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
  async postScanOrder({ commit }, { orderID }: { orderID: string; }) {
    try {
      const response = await this.$axios.$post(`/api/clients/scan-order/${ orderID }`);
      return response;
    } catch (error) {
      return error;
    }
  },

};
