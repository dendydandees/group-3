import { RootStateOrders } from '~/store/orders'

export interface VuexModuleOrders {
  orders: RootStateOrders
}

export interface Order {
  id: string
  orderCode: string
  batchId: string
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
  senderName?: string
  senderNumber?: string
  senderState?: string
  senderCity?: string
  senderProvince?: string
  senderPostal?: string
  senderCountry?: string
  senderAddress?: string
  refID: number
  labelPath: string
  requestedServices: string[]
  destPort: { code: string }
  destPortId: string
  senderPort?: { code: string }
  senderPortId?: string
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
  order: Order
  partnerName: string
  serviceType: string
  externalTrackingNumber: string
  externalTracking: {
    id: string
    partnerUpdates: {
      comments: string
      id: string
      podReceiverContact: string
      podReceiverName: string
      podURI: string
      rawPayload: string
      status: string
      updateTimestamp: Date
    }
  }
}

export interface OrderDetails {
  order: Order
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
  status: string
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
