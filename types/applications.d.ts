import { RootStateApplications } from '~/store/applications'
export interface VuexModuleApplications {
  applications: RootStateApplications
}

export interface Alert {
  isShow: boolean
  message: string
}

export interface NavigationLinks {
  title: string
  icon: string
  to: string
}

export interface FilterDetails {
  page: number
  itemsPerPage: number
  sortBy?: string[]
  sortDesc?: boolean[]
  groupBy?: string[]
  groupDesc?: boolean[]
  multiSort?: boolean
  mustSort?: boolean
}
