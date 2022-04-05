// Interfaces
import { MutationTree, ActionTree } from 'vuex'
import { Meta } from '~/types/applications'
import { Rule, RuleGroup } from '~/types/lControl/lControl'

interface GetRuleGroups {
  params: Meta
}

interface inputAddRules {
  data: Rule
  id: string
  ruleID: string
}

interface inputPatchRules {
  data: { partnerID: string; priority: number }
  id: string
  ruleID: string
}

export const state = () => ({
  lControls: [] as RuleGroup[] | [],
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 8,
  } as Meta,
})

export type RootStateLControls = ReturnType<typeof state>

export const mutations: MutationTree<RootStateLControls> = {
  SET_LCONTROLS: (state, value: RuleGroup[] | []) => (state.lControls = value),
  SET_META: (state, value: Meta) => (state.meta = value),
}

export const actions: ActionTree<RootStateLControls, RootStateLControls> = {
  async getLControls({ commit }, _params: GetRuleGroups) {
    try {
      const response = await this?.$axios?.$get('/api/clients/rule-groups')

      if (!response) throw response

      commit('SET_LCONTROLS', response)
      // commit('SET_META', meta);

      return response
    } catch (error) {
      return error
    }
  },
  async addRuleGroup(_store, data: RuleGroup) {
    try {
      const response = await this?.$axios?.$post(
        `/api/clients/rule-groups`,
        data
      )
      // const clientId = '25020c83-7c76-4a2c-8d5a-6e91590015b8';
      // const response = await this?.$axios?.$post(`/api/admin/clients/${ clientId }/rule-groups`, data);
      if (!response) throw response

      return response
    } catch (error: any) {
      return error
    }
  },
  async updateRuleGroup(
    _store,
    data: { defaultPartnerID: string; ruleGroupID: string }
  ) {
    try {
      const response = await this?.$axios?.$patch(
        `/api/clients/rule-groups/${data.ruleGroupID}`,
        { defaultPartnerID: data.defaultPartnerID }
      )
      // const clientId = '25020c83-7c76-4a2c-8d5a-6e91590015b8';
      // const response = await this?.$axios?.$post(`/api/admin/clients/${ clientId }/rule-groups`, data);
      if (!response) throw response

      return response
    } catch (error: any) {
      return error
    }
  },
  async addRules(_store, { id, data }: inputAddRules) {
    try {
      const response = await this?.$axios?.$post(
        `/api/clients/rule-groups/${id ?? ''}/rules`,
        data
      )
      return response
    } catch (error) {
      return error
    }
  },
  async updateRules(_store, { id, data }: inputPatchRules) {
    try {
      const response = await this?.$axios?.$patch(
        `/api/clients/rules/${id ?? ''}`,
        data
      )
      return response
    } catch (error) {
      return error
    }
  },
  async deleteRules(_store, { ruleID }: inputAddRules) {
    try {
      const response = await this?.$axios?.$delete(
        `/api/clients/rules/${ruleID ?? ''}`
      )
      return response
    } catch (error) {
      return error
    }
  },
  async deleteRuleGroups(_store, ruleGroupID: string) {
    try {
      const response = await this?.$axios?.$delete(
        `/api/clients/rule-groups/${ruleGroupID ?? ''}`
      )
      return response
    } catch (error) {
      return error
    }
  },
  async addBOB(_store, country: string) {
    try {
      const dataUser = JSON.parse(localStorage.getItem('auth.user') as any)
      const response = await this?.$axios?.$post(
        `/api/clients/${dataUser?.clientId}/use-bob?country=${country}`
      )
      return response
    } catch (error) {
      return error
    }
  },
  async deleteBOB(_store, country: string) {
    try {
      const dataUser = JSON.parse(localStorage.getItem('auth.user') as any)
      const response = await this?.$axios?.$delete(
        `/api/clients/${dataUser?.clientId}/use-bob?country=${country}`
      )

      return response
    } catch (error) {
      return error
    }
  },
}
