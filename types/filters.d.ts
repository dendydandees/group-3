import { RootStateFilter } from '~/store/filters'
import { Definition } from '~/types/lControl/lControl'

export interface VuexModuleFilters {
  filters: RootStateFilter
}

export interface Zone {
  id: string
  country: string
  zoneName: string
  definitions?: Definition[]
  partnerID?: string
  priority?: number | null
  ruleGroupID?: string
  ruleID?: string
  serviceType?: string
}

export interface ServiceType {
  id: string
  name: string
}

export interface CountryCode {
  name: string
  value: string
}

export interface Ports {
  data: {
    code: string
    countryCode: string
    id: string
    name: string
  }[]
  page: number
  totalCount: number
  totalPage: number
}
