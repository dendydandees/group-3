import { MutationTree } from 'vuex'
// Interfaces
import { Alert } from '~/types/applications'

export const state = () => ({
  alert: {
    isShow: false,
    message: '',
  } as Alert,
})

export type RootStateApplications = ReturnType<typeof state>

export const mutations: MutationTree<RootStateApplications> = {
  SET_ALERT: (state, value: Alert) => (state.alert = value),
  RESET_ALERT: (state) =>
    (state.alert = {
      isShow: false,
      message: '',
    }),
}
