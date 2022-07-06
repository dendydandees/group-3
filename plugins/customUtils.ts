import { defineNuxtPlugin } from '@nuxtjs/composition-api'
// types
import { ServiceType } from '~/types/filters'

export default defineNuxtPlugin((context, inject) => {
  const { $dateFns } = context

  const customUtils = {
    /* sort the service types
     * 1. First Mile
     * 2. Customs
     * 3. Freight Forwarder
     * 4. Last Mile
     */
    sortServiceTypes: (data: ServiceType[]) => {
      const serviceTypes = [...data]

      if (serviceTypes.length === 0) return []

      return [
        ...serviceTypes.filter((service) => service.name === 'FIRST_MILE'),
        ...serviceTypes.filter(
          (service) =>
            service.name !== 'FIRST_MILE' && service.name !== 'LAST_MILE'
        ),
        ...serviceTypes.filter((service) => service.name === 'LAST_MILE'),
      ]
    },
    capitalize: (text: string) => {
      return text.charAt(0) + text.slice(1)
    },
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
    setColorServiceType: (data: string, type = '') => {
      if (type === 'chip') {
        return data === 'LAST_MILE'
          ? 'primary darken-1'
          : data === 'CUSTOMS'
          ? 'success darken-2'
          : data === 'FREIGHT_FORWARDER'
          ? 'warning'
          : 'secondary darken-2'
      }

      return data === 'LAST_MILE'
        ? 'primary'
        : data === 'CUSTOMS'
        ? 'success'
        : data === 'FREIGHT_FORWARDER'
        ? 'warning'
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
