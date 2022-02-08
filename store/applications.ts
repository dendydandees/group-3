import { MutationTree } from 'vuex'
// Interfaces
import { Alert, Pagination } from '~/types/applications'

export const state = () => ({
  alert: {
    isShow: false,
    type: '',
    message: '',
  } as Alert,
  pagination: {
    page: 1,
    perPage: 10,
  } as Pagination,
})

export type RootStateApplications = ReturnType<typeof state>

export const mutations: MutationTree<RootStateApplications> = {
  SET_ALERT: (state, value: Alert) => (state.alert = value),
  RESET_ALERT: (state) =>
    (state.alert = {
      isShow: false,
      type: '',
      message: '',
    }),
  SET_PAGINATION: (state, value: Pagination) => (state.pagination = value),
  RESET_PAGINATION: (state) =>
    (state.pagination = {
      page: 1,
      perPage: 10,
    }),
}
