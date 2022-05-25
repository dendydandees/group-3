import { RootStateOrders } from '~/store/orders'

export interface VuexModuleOrders {
  orders: RootStateOrders
}

export interface LatestUpdate {
  id: string
  status: string
  updateTimestamp: Date
  comments: string
  podReceiverContact: string
  podReceiverName: string
  podURI: string
  rawPayload: string
}

export interface UpdatesOrderAllocation {
  comments: string
  id: string
  podReceiverContact: string
  podReceiverName: string
  podURI: string
  rawPayload: string
  status: string
  updateTimestamp: string
}
export interface OrderAllocationData {
  id: string
  externalTrackingNumber: string
  updates: UpdatesOrderAllocation[]
  partnerID: string
  partnerName: string
  serviceType: string
}

export interface BatchOrders {
  id: string
  code: string
  createdAt: Date
  updatedAt: Date
  clientId: string
  totalOrder: number
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
  price: number
  currency: string
}

export interface PartnerUpdates {
  comments: string
  id: string
  podReceiverContact: string
  podReceiverName: string
  podURI: string
  rawPayload: string
  status: string
  updateTimestamp: Date
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
    partnerUpdates: PartnerUpdates
  }
  updates: PartnerUpdates[]
}

export interface Order {
  id: string
  orderCode: string
  batchId: string
  batchCode: string
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
  consigneeTaxId: string
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
  requestedServices: string[]
  destPort: { code: string }
  destPortId: string
  senderPort?: { code: string }
  senderPortId?: string
  codCurrency?: string
  codValue?: number
  orderAllocations: OrderAllocationUpdate[]
}

export interface FilterOrders {
  orderCode: string
  batchCode?: string
  createdFrom: string
  createdTo: string
  originCountry: string
  destinationCountry: string
  serviceType: string[]
  originPortId: string
  destinationPortId: string
  status: string
}

export interface FilterBatch {
  batchCode: string
}

interface OrderUpload extends Order {
  items: OrderItem[]
}

export interface OrderDomestic extends OrderUpload {
  dropoffId: string
  pickup: boolean
}

export interface OrderCrossBorder extends OrderUpload {
  firstMile: boolean
  lastMile: boolean
  freightForwarder: boolean
  customs: boolean
  customBrokerages: boolean
  shipmentIncoterm: string
  incoterm: string
  lmLControlBypass: string
  lmPartnerCode: string
}

export interface NodeCalculator {
  [key: string]: {
    bobCost: String | Number
    bobTransmissionFee: String | Number
    ccCost: String | Number
    ccTransmissionFee: String | Number
    codCost: String | Number
    codMinFee: String | Number
    codRate: String | Number
    createdAt: String
    currency: String
    dutiesFee: String | Number
    fmCost: String | Number
    fmTransmissionFee: String | Number
    id: String
    lmCost: String | Number
    lmTransmissionFee: String | Number
    taxFee: String | Number
  }
}
export interface OrderDetails {
  order: Order
  orderItems: OrderItem[]
  orderAllocationUpdates: OrderAllocationUpdate[]
  nodeCalc: NodeCalculator
}
