import { RootStateIncomingOrders } from '~/store/partnerPortals/incomingOrders';

export interface VuexModuleIncomingOrders {
  partnerPortals: {
    incomingOrders: RootStateIncomingOrders;
  };
}

export interface ExternalTracking {
  id: string;
  partnerUpdates: {
    comments: string;
    id: string;
    podReceiverContact: string;
    podReceiverName: string;
    podURI: string;
    rawPayload: string;
    status: string;
    updateTimestamp: Date;
  };
}

export interface Order {
  id: string;
  orderCode: string;
  batchId: string;
  clientId: string;
  consigneeName: string;
  consigneeNumber: string;
  consigneeAddress: string;
  consigneePostal: string;
  consigneeCountry: string;
  consigneeCity: string;
  consigneeState: string;
  consigneeProvince: string;
  consigneeEmail: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  paymentType: string;
  pickupContactName?: string;
  pickupContactNumber?: string;
  pickupState?: string;
  pickupCity?: string;
  pickupProvince?: string;
  pickupPostal?: string;
  pickupCountry?: string;
  pickupAddress?: string;
  senderName?: string;
  senderNumber?: string;
  senderState?: string;
  senderCity?: string;
  senderProvince?: string;
  senderPostal?: string;
  senderCountry?: string;
  senderAddress?: string;
  refID: number;
  labelPath: string;
  requestedServices: string[];
  destPort: { code: string; };
  destPortId: string;
  senderPort?: { code: string; };
  senderPortId?: string;
  codCurrency?: string;
  codValue?: number;
}

export interface OrderAllocation {
  externalTrackingNumber: any;
  id: string;
  orderCode: string;
  orderID: string;
  partnerID: string;
  partnerName: string;
  serviceType: string;
}
export interface IncomingOrder {
  id: string;
  orderID: string;
  orderCode: string;
  partnerID: string;
  partnerName: string;
  serviceType: string;
  externalTrackingNumber: null;
  order: Order;
  externalTracking: ExternalTracking;
  labelPath: string;
  orderAllocations: OrderAllocation[];
}

export interface FilterOrders {
  orderCode: string;
  batchId: string;
  createdFrom: string;
  createdTo: string;
  originCountry: string;
  destinationCountry: string;
  serviceType: string[];
  originPortId: string;
  destinationPortId: string;
  status: string;
}

export interface InputUpdateStatus {
  orderIDs: string[];
  status: string;
  timestamp: string;
  service_type: string;
  remarks: string;
}
