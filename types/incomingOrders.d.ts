import { RootStateIncomingOrders } from '~/store/incomingOrders'

export interface VuexModuleIncomingOrders {
  incomingOrders: RootStateIncomingOrders
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
