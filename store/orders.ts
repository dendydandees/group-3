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
  OrderDomestic,
  OrderCrossBorder,
  NodeCalculator,
} from '~/types/orders'

interface ParamsGetOrder extends Meta, FilterOrders {}
interface ParamsGetBatch extends Meta, FilterBatch {}
interface UploadOrders extends Order {
  type: string
  data: OrderDomestic[] | OrderCrossBorder[]
}

export const filterOrderInit = {
  orderCode: '',
  batchCode: '',
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
  batchCode: '',
} as FilterBatch

export const state = () => ({
  orders: [] as Order[],
  ordersBatchView: [] as Order[],
  orderDetails: {
    order: {} as Order,
    orderItems: [] as OrderItem[],
    orderAllocationUpdates: [] as OrderAllocationUpdate[],
    nodeCalc: {} as NodeCalculator,
  } as OrderDetails,
  batchOrders: [] as BatchOrders[],
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 10,
  } as Meta,
  orderTabView: 0,
  filterOrder: { ...filterOrderInit } as FilterOrders,
  filterBatch: { ...filterBatchInit } as FilterBatch,
  tabBatchView: {
    selectedTransferCost: 1,
    step: 0,
  },
})

export type RootStateOrders = ReturnType<typeof state>

export const mutations: MutationTree<RootStateOrders> = {
  SET_ORDERS: (state, value: Order[]) => (state.orders = value),
  SET_ORDERS_BATCH_VIEW: (state, value: Order[]) =>
    (state.ordersBatchView = value),
  SET_ORDER_DETAILS: (state, value: OrderDetails) =>
    (state.orderDetails = value),
  SET_BATCH_ORDERS: (state, value: BatchOrders[]) =>
    (state.batchOrders = value),
  SET_NODE_CALCULATORS: (state, value: NodeCalculator) =>
    (state.orderDetails.nodeCalc = value),
  SET_META: (state, value: Meta) => (state.meta = value),
  SET_ORDER_TAB_VIEW: (state, value: number) => (state.orderTabView = value),
  RESET_ORDER_TAB_VIEW: (state) => (state.orderTabView = 0),
  SET_FILTER_ORDERS: (state, value: FilterOrders) =>
    (state.filterOrder = value),
  RESET_FILTER_ORDERS: (state) => (state.filterOrder = { ...filterOrderInit }),
  SET_FILTER_BATCH: (state, value: FilterBatch) => (state.filterBatch = value),
  RESET_FILTER_BATCH: (state) => (state.filterBatch = { ...filterBatchInit }),
  SET_TAB_BTN_BATCHVIEW: (
    state,
    value: { selectedTransferCost: number; step: number }
  ) => (state.tabBatchView = value),
}

export const actions: ActionTree<RootStateOrders, RootStateOrders> = {
  async getOrders(
    { commit },
    { params, isBatchView }: { params: ParamsGetOrder; isBatchView?: Boolean }
  ) {
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
      if (isBatchView) {
        commit('SET_ORDERS_BATCH_VIEW', data)
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
        this.$axios.$get(`api/clients/node-calculators`),
      ]
      const [
        responseOrderDetails,
        responseOrderItems,
        responseOrderUpdates,
        responseNodeCalculator,
      ] = await Promise.all(request)
      const data = {
        order: responseOrderDetails?.data[0] ?? {},
        orderItems: responseOrderItems?.orderItems ?? [],
        orderAllocationUpdates: responseOrderUpdates?.allocationUpdates ?? [],
        nodeCalc: responseNodeCalculator ?? {},
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
  async getSelectedLabels(_store, { data }: { data: { orderIds: string[] } }) {
    try {
      return await this.$axios.$post(`api/clients/orders/labels`, data, {
        responseType: 'blob',
      })
    } catch (error) {
      return error
    }
  },
  async getSelectedExports(_store, { data }: { data: string[] }) {
    try {
      return await this.$axios.$post(`api/clients/orders-export`, data, {
        responseType: 'blob',
      })
    } catch (error) {
      return error
    }
  },
  async getNodeCalculators({ commit }) {
    try {
      const response = await this.$axios.$get(`api/clients/node-calculators`)
      commit('SET_NODE_CALCULATORS', response)
      return response
    } catch (error) {
      return error
    }
  },
}
