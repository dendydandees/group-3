import { RootStateApplications } from '~/store/applications'
export interface VuexModuleApplications {
  applications: RootStateApplications
}

export interface Alert {
  isShow: boolean
  type: string
  message: string
}

export interface NavigationLinks {
  title: string
  to: string
  icon?: string
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

export type VForm = Vue & {
  validate: () => boolean
  reset: () => boolean
}

export interface ActionsTable {
  detail: boolean
  edit: boolean
  delete: boolean
}

export interface Meta {
  page: number
  totalPage: number
  totalCount: number
}

export interface FetchState {
  pending: boolean
  error: boolean
}

export interface ModalConfirm {
  loading: boolean
  title: string
  content: string
  cancelText: string
  submitText: string
  submitColor: string
}

export interface Pagination {
  page: number
  itemsPerPage: number
  sortBy?: string[]
  sortDesc?: boolean[]
}

export interface Breadcrumbs {
  text: string
  disabled: boolean
  to: string
  exact?: boolean
}

export interface Header {
  text: string
  value: string
  sortable?: boolean
  width?: number
}

export interface ErrorAPI {
  data: {
    error?: string
    ErrorDetails: { field: string; reason: string; note: string }[]
    Message?: string
  }
}
