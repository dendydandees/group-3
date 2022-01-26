import { defineNuxtMiddleware } from '@nuxtjs/composition-api'

export default defineNuxtMiddleware(({ store, redirect }): any => {
  if (store.state.auth.loggedIn) {
    return redirect('/')
  }
})
