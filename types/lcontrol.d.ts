// import { RootStateMarketplaces } from '~/store/marketplaces';

// export interface VuexModuleMarketplaces {
//   lcontrol: RootStateMarketplaces;
// }

export interface RuleDefinitions {
  ruleType: string,
  value: string;
}

export interface Rules {
  priority: number,
  partnerID: string;
  ruleDefinitions: RuleDefinitions[];
}


export interface LControl {
  CountryCode: string,
  ServiceTypeID: string,
  rules: Rules[];
}
