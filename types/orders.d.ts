import { RootStateOrders } from '~/store/orders'

export interface VuexModuleOrders {
  orders: RootStateOrders
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
  refID: number
}

export interface OrderMeta {
  page: number
  totalPage: number
  totalCount: number
}

export interface OrderDetails {
  order: Order
  orderItems: []
  orderAllocationUpdates: {
    id: string
    orderID: string
    orderCode: string
    partnerID: string
    partnerName: string
    serviceType: string
    externalTrackingNumber: string
    externalTracking: {}
  }[]
}
