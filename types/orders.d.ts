import { RootStateOrders } from '~/store/orders'

export interface VuexModuleOrders {
  orders: RootStateOrders
}

export interface Orders {
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

export interface OrdersMeta {
  page: number
  totalPage: number
  totalCount: number
}
