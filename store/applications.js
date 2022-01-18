export const state = () => ({
  alert: {
    isShow: false,
    message: '',
  },
})

export const mutations = {
  SET_ALERT(state, value) {
    state.alert = value
  },
  RESET_ALERT(state) {
    state.alert = {
      isShow: false,
      message: '',
    }
  },
}
