// Interfaces
import { MutationTree, ActionTree } from 'vuex'
import { Meta } from '~/types/applications'
import {
  OrderDetails,
  Order,
  OrderItem,
  OrderAllocationUpdate,
  FilterOrders,
} from '~/types/orders'

interface GetOrders {
  params: Meta
}

const filter = {
  search: '',
} as FilterOrders

export const state = () => ({
  orders: [] as Order[] | [],
  orderDetails: {
    order: {} as Order | {},
    orderItems: [] as OrderItem | [],
    orderAllocationUpdates: [] as OrderAllocationUpdate | [],
  } as OrderDetails,
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 10,
  } as Meta,
  filter: filter as FilterOrders,
})

export type RootStateOrders = ReturnType<typeof state>

export const mutations: MutationTree<RootStateOrders> = {
  SET_ORDERS: (state, value: Order[] | []) => (state.orders = value),
  SET_ORDER_DETAILS: (state, value: OrderDetails) =>
    (state.orderDetails = value),
  SET_META: (state, value: Meta) => (state.meta = value),
  SET_FILTER: (state, value: FilterOrders) => (state.filter = value),
  RESET_FILTER: (state) => (state.filter = filter),
}

export const actions: ActionTree<RootStateOrders, RootStateOrders> = {
  async getOrders({ commit }, { params }: GetOrders) {
    try {
      const response = await this?.$axios?.$get('/api/clients/orders', {
        params,
      })
      const { data, page, totalPage, totalCount } = response

      if (!data) throw response

      const meta = {
        page,
        totalPage,
        totalCount,
      }

      commit('SET_ORDERS', data)
      commit('SET_META', meta)

      return response
    } catch (error) {
      return error
    }
  },
  async getOrderDetails({ commit }, id: string) {
    try {
      const request = [
        this.$axios.$get(`/api/clients/orders`, {
          params: {
            orderId: id,
          },
        }),
        this.$axios.$get(`/api/clients/orders/${id}/items`),
        this.$axios.$get(`/api/clients/orders/${id}/updates`),
      ]
      const [responseOrderDetails, responseOrderItems, responseOrderUpdates] =
        await Promise.all(request)
      const data = {
        order: responseOrderDetails?.data[0] ?? {},
        orderItems: responseOrderItems?.orderItems ?? [],
        orderAllocationUpdates: responseOrderUpdates?.allocationUpdates ?? [],
      }

      commit('SET_ORDER_DETAILS', data)

      return data
    } catch (error) {
      return error
    }
  },
}
