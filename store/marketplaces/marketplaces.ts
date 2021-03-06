// Interfaces
import { MutationTree, ActionTree } from 'vuex'
import { Meta } from '~/types/applications'
import {
  Marketplace,
  FilterDetails,
  PageView,
} from '~/types/marketplace/marketplace'
import {
  DetailMarketplace,
  Gallery,
  DetailProfile,
  Ratings,
} from '~/types/marketplace/detail'

interface GetMarketplaces {
  params: {
    page: string
    perPage: string
    search: string
    country: string
    service: string[]
    zone: string
    port: string
  }
  isLControl: Boolean
  isConnected?: Boolean
  isCOD?: Boolean
  isChat?: Boolean
  isOnNetworkPartners?: Boolean
}

export const initMarketplaceFilter = {
  // page: 1,
  // itemsPerPage: 8,
  search: '',
  country: '',
  service: '',
  port: '',
} as FilterDetails

export const state = () => ({
  marketplacesAll: [] as Marketplace[] | [],
  marketplaces: [] as Marketplace[] | [],
  marketplacesLControl: [] as Marketplace[] | [],
  marketplacesCOD: [] as Marketplace[] | [],
  marketplacesConnected: [] as Marketplace[] | [],
  marketplacesConnectedLength: 0 as number,
  marketplacesChat: [] as Marketplace[] | [],
  incomingChat: [] as Marketplace[] | [],
  loadedLControl: false as Boolean,
  meta: {
    page: 1,
    totalPage: 1,
    totalCount: 8,
  } as Meta,
  filter: { ...initMarketplaceFilter },
  detail: {} as DetailMarketplace | {},
  galleries: [] as Gallery[] | [],
  detailProfile: {} as DetailProfile | {},
  ratings: [] as Ratings[],
  // manage network partners view
  pageView: 'marketplaces' as PageView,
})

export type RootStateMarketplaces = ReturnType<typeof state>

export const mutations: MutationTree<RootStateMarketplaces> = {
  SET_MARKETPLACES_ALL: (state, value: Marketplace[] | []) =>
    (state.marketplacesAll = value),
  SET_MARKETPLACES: (state, value: Marketplace[] | []) =>
    (state.marketplaces = value),
  SET_MARKETPLACES_LCONTROL: (state, value: Marketplace[] | []) =>
    (state.marketplacesLControl = value),
  SET_MARKETPLACES_COD: (state, value: Marketplace[] | []) =>
    (state.marketplacesCOD = value),
  SET_MARKETPLACES_CONNECTED: (state, value: Marketplace[] | []) =>
    (state.marketplacesConnected = value),
  SET_MARKETPLACES_CHAT: (state, value: Marketplace[] | []) =>
    (state.marketplacesChat = value),
  SET_INCOMING_CHAT: (state, value: Marketplace[] | []) =>
    (state.incomingChat = value),
  SET_MARKETPLACES_CONNECTED_LENGTH: (state, value: number) =>
    (state.marketplacesConnectedLength = value),
  SET_LOADED_LCONTROL: (state, value: Boolean) =>
    (state.loadedLControl = value),
  SET_META: (state, value: Meta) => (state.meta = value),
  SET_FILTER: (state, value: FilterDetails) => (state.filter = value),
  RESET_FILTER: (state) => (state.filter = { ...initMarketplaceFilter }),
  SET_DETAIL_MARKETPLACE: (state, value: DetailMarketplace | {}) =>
    (state.detail = value),
  SET_GALLERY: (state, value: Gallery[] | []) => (state.galleries = value),
  SET_DETAIL_PROFILE: (state, value: DetailProfile[] | []) =>
    (state.detailProfile = value),
  RESET_DETAIL_MARKETPLACE: (state) =>
    (state.detail = {} as DetailMarketplace | {}),
  SET_RATINGS: (state, value: Ratings[]) => (state.ratings = value),
  SET_PAGE_VIEW: (state, value: PageView) => (state.pageView = value),
  RESET_PAGE_VIEW: (state) => (state.pageView = 'marketplaces'),
}

export const actions: ActionTree<RootStateMarketplaces, RootStateMarketplaces> =
  {
    async getMarketplacesAll({ commit }) {
      try {
        const response = await this?.$axios?.$get(
          `/api/clients/partners?page=1&perPage=1000`
        )
        const { data } = response
        // const { data, page, totalPage, totalCount } = response

        if (!data) throw response

        // const meta = {
        //   page,
        //   totalPage,
        //   totalCount,
        // }
        commit('SET_MARKETPLACES_ALL', data)

        return response
      } catch (error) {
        return error
      }
    },
    async getMarketplaces(
      { commit, state },
      { params, isLControl, isCOD }: GetMarketplaces
    ) {
      let serviceParams = 'service='
      if (params && params?.service && params?.service.length > 0) {
        serviceParams = params.service
          .map((el) => {
            return `service=${el}`
          })
          .join('&')
      }
      const uri = params
        ? `?page=${params.page ?? ''}&perPage=${params.perPage ?? ''}&search=${
            params.search ?? ''
          }&country=${params.country ?? ''}&${serviceParams ?? ''}&zone=${
            params.zone ?? ''
          }&port=${params.port ?? ''}&cod=${isCOD ?? ''}`
        : ''
      try {
        const response = await this?.$axios?.$get(`/api/clients/partners${uri}`)
        const { data, page, totalPage, totalCount } = response

        if (!data) throw response

        const meta = {
          page,
          totalPage,
          totalCount,
        }
        if (!isLControl) {
          commit('SET_MARKETPLACES', data)
          commit('SET_META', meta)
        }
        if (!state.loadedLControl || isLControl) {
          commit('SET_MARKETPLACES_LCONTROL', data)
          commit('SET_LOADED_LCONTROL', true)
        }

        return response
      } catch (error) {
        return error
      }
    },
    async getMarketplacesConnected(
      { commit, dispatch },
      { params, isCOD, isChat, isOnNetworkPartners = false }: GetMarketplaces
    ) {
      let serviceParams = 'service='
      if (params && params?.service && params?.service.length > 0) {
        serviceParams = params.service
          .map((el) => {
            return `service=${el}`
          })
          .join('&')
      }
      const uri = params
        ? `?connection=connected&page=${params.page ?? ''}&perPage=${
            params.perPage ?? ''
          }&search=${params.search ?? ''}&country=${params.country ?? ''}&${
            serviceParams ?? ''
          }&zone=${params.zone ?? ''}&port=${params.port ?? ''}&cod=${
            isCOD ?? ''
          }`
        : ''
      try {
        const response = await this?.$axios?.$get(`/api/clients/partners${uri}`)
        const { data, page, totalPage, totalCount } = response

        if (!data) throw response

        if (isChat && !isCOD) {
          let listChannel = await Promise.all(
            data.map(async (el: any) => {
              try {
                const channel = await dispatch(
                  'sendbird/getChatChannel',
                  el.id,
                  { root: true }
                )
                return {
                  name: el.name,
                  channel_url: channel?.channel_url ?? '',
                  logo: el.logo ? 'data:image/png;base64,' + el.logo : '',
                }
              } catch (error) {
                return error
              }
            })
          )
          listChannel = listChannel.filter((x: any) => x.channel_url)

          const incomingChats = await dispatch(
            'sendbird/getChatIncoming',
            {},
            { root: true }
          )
          const allArr = listChannel
          // if (incomingChats) allArr = listChannel.concat(incomingChats);

          commit('SET_MARKETPLACES_CONNECTED_LENGTH', data.length)
          commit('SET_MARKETPLACES_CHAT', allArr)
          commit('SET_INCOMING_CHAT', incomingChats)
        }
        if (!isChat && !isCOD) {
          commit('SET_MARKETPLACES_CONNECTED', data)
        }
        if (isCOD) {
          commit('SET_MARKETPLACES_COD', data)
        }
        // if it's on network partners view set meta to this connected network partners
        if (isOnNetworkPartners) {
          commit('SET_META', {
            page,
            totalPage,
            totalCount,
          })
        }

        return response
      } catch (error) {
        return error
      }
    },
    async addConnection(_store, { id }: { id: String }) {
      try {
        const response = await this?.$axios?.$post(
          `/api/clients/connections/${id}`
        )

        return response
      } catch (error: any) {
        return error?.response?.data
      }
    },
    async getDetail({ commit }, id: string) {
      try {
        const response = await this?.$axios?.$get(
          `/api/clients/partner-details/${id ?? ''}`
        )

        if (!response) throw response
        let temp = response?.partnerGallery
        if (response?.partnerGallery?.length > 0) {
          temp = temp.map((el: Gallery) => {
            return { src: el.path }
          })
        }
        if (response?.partnerServiceTypes) {
          // console.log({ partnerServiceTypes: response?.partnerServiceTypes });
          response.partnerServiceTypes = response.partnerServiceTypes.filter(
            (el: any) => el.name
          )
        }
        commit('SET_DETAIL_MARKETPLACE', response)
        commit('SET_GALLERY', temp)
        // commit('SET_DETAIL_PROFILE', response);

        return response
      } catch (error) {
        return error
      }
    },
    async getGalleries({ commit }, id: string) {
      try {
        const response = await this?.$axios?.$get(
          `api/clients/partners/${id ?? ''}/profile`
        )

        if (!response) throw response
        let temp = response?.gallery
        if (response?.gallery?.length > 0) {
          temp = temp.map((el: Gallery) => {
            return { src: el.path }
          })
        }

        if (response?.serviceType) {
          response.serviceType = response.serviceType.filter(
            (el: any) => el.name
          )
        }

        commit('SET_GALLERY', temp)
        commit('SET_DETAIL_PROFILE', response)

        return response
      } catch (error) {
        return error
      }
    },
    async getRatesAvailable(_state, { partnerID }: { partnerID: string }) {
      try {
        const response = await this?.$axios?.$get(
          `/api/clients/partners/${partnerID ?? ''}/rates/is-rates-available`
        )
        return response
      } catch (error) {
        return error
      }
    },
    async getRatesDownload(
      _state,
      { partnerID, name }: { partnerID: string; name: string }
    ) {
      try {
        const response = await this?.$axios({
          url: `/api/clients/partners/${partnerID ?? ''}/rates/download`,
          method: 'GET',
          responseType: 'blob', // important
        })

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${name ?? 'rates-NP'}.xls`)
        document.body.appendChild(link)
        link.click()
        return link
      } catch (error) {
        return error
      }
    },
    async getRatings({ commit }, { partnerId }: { partnerId: string }) {
      try {
        const data = await this.$axios.$get(
          `api/clients/partners/${partnerId}/ratings`
        )

        commit('SET_RATINGS', data)
        return data
      } catch (error) {
        return error
      }
    },
  }
