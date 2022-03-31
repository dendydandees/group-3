import { RootStateIncomingOrders } from '~/store/partnerPortals/incomingOrders'

export interface VuexModuleIncomingOrders {
  partnerPortals: {
    incomingOrders: RootStateIncomingOrders
  }
}

export interface ExternalTracking {
  id: string
  partnerUpdates: null
}

export interface Order {
  id: string
  orderCode: string
  clientId: string
  consigneeName: string
  consigneeNumber: string
  consigneeAddress: string
  consigneePostal: string
  consigneeCountry: string
  consigneeCity: string
  consigneeState: string
  consigneeProvince: string
  consigneeEmail: string
  length: number
  width: number
  height: number
  weight: number
  paymentType: string
  pickupContactName: string
  pickupContactNumber: string
  pickupState: string
  pickupCity: string
  pickupProvince: string
  pickupPostal: string
  pickupCountry: string
  pickupAddress: string
  refID: null
  labelPath: null
}

export interface IncomingOrder {
  id: string
  orderID: string
  orderCode: string
  partnerID: string
  partnerName: string
  serviceType: string
  externalTrackingNumber: null
  order: Order
  externalTracking: ExternalTracking
}

export interface FilterOrders {
  orderCode: string
  batchId: string
  createdFrom: string
  createdTo: string
  originCountry: string
  destinationCountry: string
  serviceType: string[]
  originPortId: string
  destinationPortId: string
}
