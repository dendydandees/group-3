import { RootStateBagging } from '~/store/bagging/bagging';

export interface VuexModuleDetailBagging {
  bagging: RootStateBagging;
}


export interface FilterBagging {
  createdFrom: string;
  createdTo: string;
  client: string;
  destination: string;
}
