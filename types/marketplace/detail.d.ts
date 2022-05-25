import { RootStateMarketplaces } from '~/store/marketplaces/marketplaces'

export interface VuexModuleDetailMarketplace {
  marketplaces: RootStateMarketplaces
}

export interface PartnerServiceType {
  id: string
  name: string
}

export interface PartnerServiceZone {
  id: string
  zone_country: string
}

export interface DetailMarketplace {
  id: string
  name: string
  slug: string
  logo: string
  description: string
  clientId: string
  status: string
  partnerServiceTypes: PartnerServiceType[]
  partnerServiceZones: PartnerServiceZone[]
}

export interface Gallery {
  id: string
  path: string
  partnerId: string
  logo: string
}
export interface DataGallery {
  description: string
  gallery: Gallery[]
  logo: string
  name: string
  slug: string
}
export interface DetailProfile {
  slug: string
  name: string
  code: string
  logo: string
  description: string
  serviceType: PartnerServiceType[]
  serviceZone: PartnerServiceZone[]
  companyBrief: string
  emailAddress: string
  contactPerson: string
  phoneNumber: string
  sla: string
  gallery: Gallery[]
  maximumWeight: number
  maximumDimension: string
  pikupAndDropOff: boolean
  prohibitedItem: string
}

export interface Ratings {
  id: string
  partnerId: string
  status: string
  rating: string
}
