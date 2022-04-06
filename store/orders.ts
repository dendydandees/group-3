// Interfaces
import { MutationTree, ActionTree } from 'vuex'
import { Meta } from '~/types/applications'
import {
  OrderDetails,
  Order,
  OrderItem,
  OrderAllocationUpdate,
  FilterOrders,
  BatchOrders,
  FilterBatch,
} from '~/types/orders'

interface ParamsGetOrder extends Meta, FilterOrders {}
interface ParamsGetBatch extends Meta, FilterBatch {}
interface UploadOrders extends Order {
  type: string
  data: OrderItem[]
}
interface ParamsGetSelectedLabels {
  orderIds: string[]
}

export const filterOrderInit = {
  orderCode: '',
  batchId: '',
  originCountry: '',
  createdFrom: '',
  createdTo: '',
  destinationCountry: '',
  serviceType: [],
  originPortId: '',
  destinationPortId: '',
  status: '',
} as FilterOrders

export const filterBatchInit = {
  batchId: '',
} as FilterBatch

export const state = () => ({
  orders: [] as Order[],
  orderDetails: {
    order: {} as Order,
    orderItems: [] as OrderItem[],
    orderAllocationUpdates: [] as OrderAllocationUpdate[],
  } as OrderDetails,
  batchOrders: [] as BatchOrders[],
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 10,
  } as Meta,
  filterOrder: filterOrderInit as FilterOrders,
  filterBatch: filterBatchInit as FilterBatch,
})

export type RootStateOrders = ReturnType<typeof state>

export const mutations: MutationTree<RootStateOrders> = {
  SET_ORDERS: (state, value: Order[]) => (state.orders = value),
  SET_ORDER_DETAILS: (state, value: OrderDetails) =>
    (state.orderDetails = value),
  SET_BATCH_ORDERS: (state, value: BatchOrders[]) =>
    (state.batchOrders = value),
  SET_META: (state, value: Meta) => (state.meta = value),
  SET_FILTER_ORDERS: (state, value: FilterOrders) =>
    (state.filterOrder = value),
  RESET_FILTER_ORDERS: (state) => (state.filterOrder = filterOrderInit),
  SET_FILTER_BATCH: (state, value: FilterOrders) => (state.filterBatch = value),
  RESET_FILTER_BATCH: (state) => (state.filterBatch = filterBatchInit),
}

export const actions: ActionTree<RootStateOrders, RootStateOrders> = {
  async getOrders({ commit }, { params }: { params: ParamsGetOrder }) {
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
  async getBatchOrders({ commit }, { params }: { params: ParamsGetBatch }) {
    try {
      const response = await this.$axios.$get('/api/clients/orders/batch', {
        params,
      })
      const { data, page, totalPage, totalCount } = response

      if (!data) throw response

      const meta = {
        page,
        totalPage,
        totalCount,
      }

      commit('SET_BATCH_ORDERS', data)
      commit('SET_META', meta)
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
  async uploadOrders(_store, { data, type }: UploadOrders) {
    try {
      const response = await this.$axios.$post(
        `/api/clients/orders/batch/${type}`,
        data
      )

      return response
    } catch (error) {
      return error
    }
  },
  async getSelectedLabels(_store, { data }: { data: ParamsGetSelectedLabels }) {
    try {
      const response = await this.$axios.$post(
        `api/clients/orders/labels`,
        data,
        { responseType: 'blob' }
      )

      return response
    } catch (error) {
      return error
    }
  },
}
