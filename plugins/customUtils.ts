import { defineNuxtPlugin } from '@nuxtjs/composition-api'

export default defineNuxtPlugin((context, inject) => {
  const { $dateFns } = context

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
        ? 'success'
        : 'secondary'
    },
    setURLParams: (data: Object) => {
      const paramsFilterOrders = new URLSearchParams()

      for (const [key, value] of Object.entries(data)) {
        if (!value) continue

        // format createdTo and createdFrom params to ISO datetime
        if (key === 'createdTo' || key === 'createdFrom') {
          const date = $dateFns.formatISO(
            $dateFns.parseISO(value as string) as Date
          ) as unknown as string

          paramsFilterOrders.append(key, date)
          continue
        }

        // format array value to separated params but same key
        if (key === 'serviceType') {
          const items = value as string[]

          items.forEach((item) => {
            paramsFilterOrders.append(key, item)
          })

          continue
        }

        paramsFilterOrders.append(key, value as string)
      }

      return paramsFilterOrders
    },
  }

  inject('customUtils', customUtils)
})
