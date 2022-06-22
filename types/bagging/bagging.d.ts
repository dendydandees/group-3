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

export interface Order {
  id: string,
  orderCode: string;
}

export interface Bagged {
  id: string,
  group_name: string,
  dest_port: string,
  dest_country: string,
  orders: Order[];
}

export interface Unbagged {
  dest_port: string,
  dest_country: string,
  order_group: Bagged[];
}

export interface BagData {
  bagged: InputPostBag[],
  unbagged: Unbagged[],
}
