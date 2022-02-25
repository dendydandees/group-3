import { RootStateMarketplaces } from '~/store/marketplaces';

export interface VuexModuleMarketplaces {
  marketplaces: RootStateMarketplaces;
}

export interface PartnerServiceType {
  id: string,
  name: string;
}

export interface PartnerServiceZone {
  id: string,
  zone_country: string;
}

export interface Marketplace {
  id: string,
  name: string,
  slug: string,
  clientId: string,
  partnerServiceTypes: PartnerServiceType[],
  partnerServiceZones: PartnerServiceZone[],
}

export interface FilterDetails {
  page: number,
  itemsPerPage: number,
  search: string,
  country: string,
  service: string;
}

export interface FilterMarketplaces {
  search: '';
}
