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
  pickupContactName?: string
  pickupContactNumber?: string
  pickupState?: string
  pickupCity?: string
  pickupProvince?: string
  pickupPostal?: string
  pickupCountry?: string
  pickupAddress?: string
  senderContactName?: string
  senderContactNumber?: string
  senderState?: string
  senderCity?: string
  senderProvince?: string
  senderPostal?: string
  senderCountry?: string
  senderAddress?: string
  refID: number
  labelPath: string
}

export interface OrderItem {
  id: string
  orderId: string
  orderCode?: string
  description: string
  quantity: number
  productCode: string
  sku: string
  category: string
  price: string
  currency: string
}

export interface OrderAllocationUpdate {
  id: string
  orderID: string
  orderCode: string
  partnerID: string
  partnerName: string
  serviceType: string
  externalTrackingNumber: string
  externalTracking: {
    id: string
    partnerUpdates: string
  }
}

export interface OrderDetails {
  order: Order | {}
  orderItems: OrderItem[]
  orderAllocationUpdates: OrderAllocationUpdate[]
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

export interface BatchOrders {
  id: string
  createdAt: Date
  updatedAt: Date
  clientId: string
  totalOrder: number
}

export interface FilterBatch {
  batchId: string
}
