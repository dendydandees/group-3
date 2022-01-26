import { defineNuxtPlugin } from '@nuxtjs/composition-api'

export default defineNuxtPlugin((_context, inject) => {
  const customUtils = {
    setAddress: (data: string[]): string => {
      const setItem = data.filter((item: string) => item)

      return setItem.join(', ')
    },
  }

  inject('customUtils', customUtils)
})
