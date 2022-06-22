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

export interface InputPostBag {
  bag_name: string;
  order_ids: string[];
}

export interface Bagged {
  id: string,
  orderCode: string;
}

export interface Unbagged {
  group_name: string,
  orders: Bagged[];
}

export interface BagData {
  bagged: InputPostBag[],
  unbagged: Unbagged[],
}
