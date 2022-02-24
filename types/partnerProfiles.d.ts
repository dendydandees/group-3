import { RootStatePartnerDetails } from '~/store/partnerProfiles'

export interface VuexModulePartnerProfiles {
  partnerProfiles: RootStatePartnerDetails
}

export interface PartnerDetail {
  id: string
  title: string
  description: string
}
