export interface Login {
  email: string
  password: string
}

export interface User {
  email: string
  role: string
  clientId: string
  partnerProfiles: []
  initial?: string
}
