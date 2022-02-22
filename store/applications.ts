import { MutationTree, ActionTree } from 'vuex'
// Interfaces
import { Alert, Pagination } from '~/types/applications'

const pagination = {
  page: 1,
  itemsPerPage: 10,
  sortBy: [''],
  sortDesc: [true],
}

export const state = () => ({
  alert: {
    isShow: false,
    type: '',
    message: '',
  } as Alert,
  pagination: pagination as Pagination,
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
  RESET_PAGINATION: (state) => (state.pagination = pagination),
}

export const actions: ActionTree<RootStateApplications, RootStateApplications> =
  {
    async logout(_store) {
      try {
        await this.$auth.logout()

        setTimeout(() => {
          this.$auth.setUser({})
          this.$auth.$storage.removeUniversal('user')
          this.$router.push('/login')
        }, 300)
      } catch (error) {
        return error
      }
    },
  }
