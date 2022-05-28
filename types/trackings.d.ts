import { PartnerUpdates } from '@/types/orders'
import { RootStateTracking } from '@/store/trackings'

export interface VuexModuleTracking {
  trackings: RootStateTracking
}

export interface TrackingElement {
  serviceType: string
  trackingNumber: string
  partnerName: string
  updates: PartnerUpdates[]
}

export interface Tracking {
  orderCode: string
  clientName: string
  clientLogo: string
  createdAt: string
  trackings: TrackingElement[]
}
