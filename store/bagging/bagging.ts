// Interfaces
import { MutationTree, ActionTree } from 'vuex';
import { Meta } from '~/types/applications';
import {
  FilterBagging
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
  SET_META: (state, value: Meta) => (state.meta = value),
  SET_FILTER: (state, value: FilterBagging) => (state.filter = value),
  SET_FILTER_BTN: (state) => (state.isShowFilter = !state.isShowFilter),
  SET_TAB_BTN: (state, value: { orderView: number, step: number; }) => (state.tab = value),
  RESET_FILTER: (state) => (state.filter = filterBaggingInit),
};

export const actions: ActionTree<RootStateBagging, RootStateBagging> =
{

};
