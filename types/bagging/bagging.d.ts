import { RootStateBagging } from '~/store/bagging/bagging';

export interface VuexModuleDetailBagging {
  bagging: RootStateBagging;
}

export interface TabState {
  orderView: {
    [key: string]: number,
  };
  step: number;
}

export interface FilterBagging {
  createdFrom: string;
  createdTo: string;
  client: string;
  destination: string;
}
export interface GenerateManifest {
  [key: string | number]: {
    groupName?: string,
    length: string | number,
    width: string | number,
    height: string | number,
    weight: string | number,
  },
}
export interface InputManifest {
  manifest: boolean,
  mawb: string;
  generateManifest: GenerateManifest | {};
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
  departure: string,
  flight: string,
  flight_date: string,
  origin_port: string,
  status: string,
  orders: Order[];
  mawb: string;
}

export interface Unbagged {
  dest_port: string,
  dest_country: string,
  order_group: Bagged[];
}

export interface BagUpdate {
  id: string,
  bag_id: string,
  status: string,
  comments: string,
  update_timestamp: string;
}

export interface BagData {
  bagged: Bagged[],
  unbagged: Unbagged[],
}

export interface BagDataPartner {
  bagged: Unbagged[],
  unbagged: Unbagged[],
}
