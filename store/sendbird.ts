// Interfaces
import { MutationTree, ActionTree } from 'vuex';
import {
  ChatUser,
  ChatChannel
} from '~/types/sendbird';

export const state = () => ({
  chatUser: {} as ChatUser,
  chatChannel: {} as ChatChannel
});

export type RootStateChat = ReturnType<typeof state>;

export const mutations: MutationTree<RootStateChat> = {
  SET_USER: (state, value: ChatUser) =>
    (state.chatUser = value),
  SET_CHANNEL: (state, value: ChatChannel) =>
    (state.chatChannel = value),
};

export const actions: ActionTree<RootStateChat, RootStateChat> = {
  async getUserChat({ commit }) {
    try {
      const response = await this.$axios.$get(`/api/clients/chat/user`);

      commit('SET_USER', response);

      return response;
    } catch (error) {
      return error;
    }
  },
  async getChatChannel({ commit }, partnerID: string) {
    try {
      console.log(partnerID);
      const response = await this.$axios.$get(`/api/clients/chat/channel/${ partnerID }`,);

      commit('SET_CHANNEL', response);

      return response;
    } catch (error) {
      return error;
    }
  },
};
