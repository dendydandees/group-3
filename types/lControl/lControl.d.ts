import { CountryCode, PortData, ServiceType, ZoneData } from '../filters'
import { RootStateLControls } from '~/store/lControls'

export interface VuexModuleLControls {
  lControls: RootStateLControls
}

export interface LControlDetail {
  partnerID: string
  volume?: number
}

export interface UserSelectedLControl {
  useBOB: boolean
  country: CountryCode
  serviceType: ServiceType
  zone: ZoneData
  port: PortData
  defaultPartner: LControlDetail
  codPartner: LControlDetail
  primary: LControlDetail
  secondary: LControlDetail
  tertiary: LControlDetail
}

export interface LControl {
  useBOB?: boolean
  country: string
  serviceType: string
  zoneID?: string
  portID?: string
  defaultPartner: LControlDetail
  codPartner?: LControlDetail
  primaryPartner?: LControlDetail
  secondaryPartner?: LControlDetail
  tertiaryPartner?: LControlDetail
}
