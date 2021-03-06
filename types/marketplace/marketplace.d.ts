import { RootStateMarketplaces } from '~/store/marketplaces/marketplaces'

export interface VuexModuleMarketplaces {
  marketplaces: {
    marketplaces: RootStateMarketplaces
  }
}

export interface PartnerServiceType {
  id: string
  name: string
}

export interface PartnerServiceZone {
  id: string
  zone_country: string
}

export interface Marketplace {
  id: string
  name: string
  slug: string
  clientId: string
  status: 'connected' | 'pending'
  partnerServiceTypes: PartnerServiceType[]
  partnerServiceZones: PartnerServiceZone[]
}

export interface FilterDetails {
  page: number
  itemsPerPage: number
  search: string
  country: string
  service: string | string[]
  port: string
}

export interface FilterMarketplaces {
  search: string
}

export interface PaginationMarketplaces {
  page: Number
  itemsPerPage: Number
}

export type PageView = 'marketplaces' | 'networkPartners'
