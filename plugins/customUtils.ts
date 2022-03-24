import { defineNuxtPlugin } from '@nuxtjs/composition-api'

export default defineNuxtPlugin((_context, inject) => {
  const customUtils = {
    setAddress: (data: string[]): string => {
      const setItem = data.filter((item: string) => item)

      return setItem.join(', ')
    },
    setServiceType: (data: string): string => {
      return data.replaceAll('_', ' ')
    },
    setRuleType: (data: string): string => {
      return data.split('RULE_TYPE_')[1]
    },
    setColorServiceType: (data: string): string => {
      return data === 'LAST_MILE'
        ? 'primary'
        : data === 'CUSTOMS'
        ? 'info'
        : 'secondary'
    },
  }

  inject('customUtils', customUtils)
})
