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
  bags: {} as BagData,
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
  SET_DATA: (state, value: BagData) => (state.bags = value),
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
      const response = await this.$axios.$get('/bags');
      const { data, page, totalPage, totalCount } = response;

      if (!data) throw response;

      const meta = {
        page,
        totalPage,
        totalCount,
      };

      commit('SET_DATA', data);
      commit('SET_META', meta);
      return data;
    } catch (error) {
      return error;
    }
  },
  async postBags({ commit }, { payload }: { payload: InputPostBag; }) {
    try {
      const response = await this.$axios.$post('/bags', payload
      );
      return response;
    } catch (error) {
      return error;
    }
  },
  async postScanOrder({ commit }, { orderID }: { orderID: string; }) {
    try {
      const response = await this.$axios.$post(`/scan-order/${ orderID }`);
      return response;
    } catch (error) {
      return error;
    }
  },

};
