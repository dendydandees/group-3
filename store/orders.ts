import { MutationTree, ActionTree } from 'vuex'
// Interfaces
import { Orders, ParamsFetch } from '~/types/orders'

export const state = () => ({
  orders: [] as Orders[] | [],
  params: {
    page: 1,
    totalPage: 4,
    totalCount: 64,
  } as ParamsFetch,
})

export type RootStateOrders = ReturnType<typeof state>

export const mutations: MutationTree<RootStateOrders> = {
  SET_ORDERS: (state, value: Orders[] | []) => (state.orders = value),
}

export const actions: ActionTree<RootStateOrders, RootStateOrders> = {
  getOrders: ({ commit }) => {
    try {
      const data = [
        {
          id: 'c7a52c87-0122-4462-bb0c-16cde3d602c5',
          orderCode: 'Test111222333-10',
          clientId: 'a7787a24-7520-45b4-86f1-9c8a85842f82',
          consigneeName: 'Smith',
          consigneeNumber: '+6599033394',
          consigneeAddress: '399 RIVER VALLEY ROAD',
          consigneePostal: '68000',
          consigneeCountry: 'Malaysia',
          consigneeCity: 'Kuala Lumpur',
          consigneeState: 'Malaysia',
          consigneeProvince: 'Klangvalley',
          consigneeEmail: 'karel@luwjistik.com',
          length: 10,
          width: 50,
          height: 40,
          weight: 30,
          paymentType: 'cod',
          pickupContactName: 'Karel Test',
          pickupContactNumber: '082292020136',
          pickupState: 'Singapore',
          pickupCity: 'Singapore',
          pickupProvince: 'Singapore',
          pickupPostal: '11470',
          pickupCountry: 'Singapore',
          pickupAddress: 'Orachard road',
          refID: 1749,
        },
        {
          id: '3e5140e1-7041-44cc-9aee-78c2e632505d',
          orderCode: 'Test111222333-09',
          clientId: 'a7787a24-7520-45b4-86f1-9c8a85842f82',
          consigneeName: 'Nam',
          consigneeNumber: '+8490999878',
          consigneeAddress: '399 RIVER VALLEY ROAD',
          consigneePostal: '68000',
          consigneeCountry: 'Malaysia',
          consigneeCity: 'Kuala Lumpur',
          consigneeState: 'Malaysia',
          consigneeProvince: 'Klangvalley',
          consigneeEmail: 'karel@luwjistik.com',
          length: 10,
          width: 34,
          height: 25,
          weight: 30,
          paymentType: 'prepaid',
          pickupContactName: 'Karel Test',
          pickupContactNumber: '082292020136',
          pickupState: 'Singapore',
          pickupCity: 'Singapore',
          pickupProvince: 'Singapore',
          pickupPostal: '11470',
          pickupCountry: 'Singapore',
          pickupAddress: 'Orachard road',
          refID: 1748,
        },
      ]

      commit('SET_ORDERS', data)

      return data
    } catch (error: any) {
      return error
    }
  },
}
