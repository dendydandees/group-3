// Interfaces
import { MutationTree, ActionTree } from 'vuex'
import { Meta } from '~/types/applications'
import {
  IncomingOrder,
  FilterOrders,
} from '~/types/partnerPortals/incomingOrders'

const filterOrders = {
  orderCode: '',
  batchId: '',
  createdFrom: '',
  createdTo: '',
  destinationCountry: '',
  originCountry: '',
  serviceType: '',
} as FilterOrders

export const state = () => ({
  incomingOrders: [] as IncomingOrder | [],
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 10,
  } as Meta,
  filterOrders: filterOrders as FilterOrders,
  incomingOrderDetails: {
    order: {} as any | {},
    // orderItems: [] as OrderItem | [],
    // orderAllocationUpdates: [] as OrderAllocationUpdate | [],
  } as any,
})

export type RootStateIncomingOrders = ReturnType<typeof state>

export const mutations: MutationTree<RootStateIncomingOrders> = {
  SET_CLIENT_CONNECTIONS: (state, value: IncomingOrder) =>
    (state.incomingOrders = value),
  SET_META: (state, value: Meta) => (state.meta = value),
  SET_FILTER: (state, value: FilterOrders) => (state.filterOrders = value),
  RESET_FILTER: (state) => (state.filterOrders = filterOrders),
  SET_INCOMING_ORDER_DETAILS: (state, value: any) =>
    (state.incomingOrderDetails = value),
}

export const actions: ActionTree<
  RootStateIncomingOrders,
  RootStateIncomingOrders
> = {
  async getIncomingOrders(
    { commit },
    { id, params }: { id: string; params: Meta }
  ) {
    try {
      const response = await this.$axios.$get(
        `/api/clients/partners/${id}/orders`,
        {
          params,
        }
      )
      const { data, page, totalPage, totalCount } = response

      if (!data) throw response

      commit('SET_CLIENT_CONNECTIONS', data)
      commit('SET_META', {
        page,
        totalPage,
        totalCount,
      })

      return response
    } catch (error) {
      return error
    }
  },
  async getIncomingOrderDetails(
    { commit },
    params: { id: string; partnerId: string }
  ) {
    try {
      const request = [
        this.$axios.$get(
          `/api/clients/partners/${params?.partnerId ?? ''}/orders/${
            params?.id ?? ''
          }`
        ),
        // this.$axios.$get(`/api/clients/orders/${id}/items`),
        // this.$axios.$get(`/api/clients/orders/${id}/updates`),
      ]
      const [
        responseIncomingOrderDetails,
        // responseOrderItems,
        // responseOrderUpdates
      ] = await Promise.all(request)
      const data = {
        order: responseIncomingOrderDetails ?? {},
        // orderItems: responseOrderItems?.orderItems ?? [],
        // orderAllocationUpdates: responseOrderUpdates?.allocationUpdates ?? [],
      }

      commit('SET_INCOMING_ORDER_DETAILS', data)

      return data
    } catch (error) {
      return error
    }
  },
}
