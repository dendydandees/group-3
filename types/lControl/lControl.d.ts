import { RootStateLControls } from '~/store/lControls/lControls';

export interface VuexModuleLControls {
  lControls: {
    lControls: RootStateLControls;
  };
}


export interface Definition {
  id?: string | number,
  ruleID?: string,
  type: string,
  value: string;
}

export interface Rule {
  id: string,
  ruleGroupID: string,
  partnerID: string,
  priority: number,
  definitions: Definition[];
}

export interface RuleGroup {
  id: string,
  defaultPartnerID: string,
  serviceType: string,
  countryCode: string,
  Rules: Rule[];
}