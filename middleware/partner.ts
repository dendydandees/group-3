import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
// Interfaces and types
import { User } from '~/types/login'

export default defineNuxtMiddleware(({ $auth, redirect }) => {
  const user = $auth.$storage.getCookie('user') as User

  if (user?.partnerProfiles.length === 0) {
    redirect('/')
  }
})
