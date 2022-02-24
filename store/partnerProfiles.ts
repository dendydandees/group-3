// Interfaces and types
import { MutationTree } from 'vuex'
import { Meta } from '~/types/applications'
import { PartnerDetail } from '~/types/partnerProfiles'

export const state = () => ({
  partnerProfiles: [] as PartnerDetail[],
  profileDetails: {} as PartnerDetail,
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 10,
  } as Meta,
})

export type RootStatePartnerDetails = ReturnType<typeof state>

export const mutations: MutationTree<RootStatePartnerDetails> = {
  SET_PARTNER_PROFILES: (state, value) => {
    state.partnerProfiles = value
  },
  SET_PROFILE_DETAILS: (state, value) => {
    state.profileDetails = value
  },
  SET_META: (state, value: Meta) => (state.meta = value),
}
