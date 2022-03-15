import { RootStateDetailMarketplace } from '~/store/marketplaces/detail';

export interface VuexModuleDetailMarketplace {
  detailMarketplace: RootStateDetailMarketplace;
}

export interface PartnerServiceType {
  id: string,
  name: string;
}

export interface PartnerServiceZone {
  id: string,
  zone_country: string;
}

export interface DetailMarketplace {
  id: string,
  name: string,
  slug: string,
  logo: string,
  description: string,
  clientId: string,
  status: string,
  partnerServiceTypes: PartnerServiceType[],
  partnerServiceZones: PartnerServiceZone[],
}
export interface Gallery {
  id: string,
  path: string,
  partnerId: string,
  logo: string,
}
export interface DataGallery {
  description: string,
  gallery: Gallery[],
  logo: string,
  name: string,
  slug: string,
}