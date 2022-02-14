import { RootStateProfiles } from '~/store/profiles'

export interface VuexModuleProfiles {
  profiles: RootStateProfiles
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

export interface ResetPasswordParams {
  newPassword: string,
  oldPassword: string
}
