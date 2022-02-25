export interface Login {
  email: string
  password: string
}

export interface PartnerProfiles {
  partnerId: string
}

export interface User {
  email: string
  role: string
  clientId: string
  partnerProfiles: PartnerProfiles[]
  initial?: string
}
