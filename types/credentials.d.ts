import { RootStateCredentials } from '~/store/credentials'

export interface VuexModuleCredentials {
  credentials: RootStateCredentials
}

export interface Credential {
  id: string
  clientId: string
  token: string
  keyName: string
  refId: string
  revokedAt: null
  createdAt: string
}

export interface GenerateCredential {
  keyName: string
}
