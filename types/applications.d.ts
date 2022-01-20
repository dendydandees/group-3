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
