import { RootStateProfiles } from '~/store/partnerPortals/profiles'

export interface VuexModuleProfiles {
  partnerPortals: {
    profiles: RootStateProfiles
  }
}

export interface Profile {
  slug: string
  name: string
  companyBrief: string
  logo: string
}
