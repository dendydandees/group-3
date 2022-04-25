<template>
  <v-flex md12 class="chat-wrapper">
    <v-card elevation="2" tile>
      <v-layout row>
        <v-flex xs4 elevation="1">
          <v-toolbar flat dense>
            <v-toolbar-title>Messenger</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <ChatList :new-chat="newChat" @selectChat="selectChat"></ChatList>
        </v-flex>
        <v-divider vertical></v-divider>
        <v-flex xs8>
          <v-toolbar flat dense>
            <v-toolbar-title v-if="recipient">
              <v-avatar size="36">
                <img src="recipient.avatar || ''" />
              </v-avatar>
              {{ recipient.fullName }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu v-if="recipient" absolute offset-y>
              <template #activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>more_horiz</v-icon>
                </v-btn>
              </template>
              <v-list id="dropdown" one-line>
                <v-list-tile @click="">
                  <v-list-tile-title class="menu-item">
                    View Profile
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="">
                  <v-list-tile-title class="menu-item">
                    Block User
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="">
                  <v-list-tile-title class="menu-item">
                    Report User
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="">
                  <v-list-tile-title class="menu-item">
                    Clear Chat
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-toolbar>
          <v-divider></v-divider>
          <ChatWindow
            v-if="selectedChat"
            :key="selectedChat.url"
            :channel="selectedChat"
            @recipientMeta="setRecipient"
          ></ChatWindow>
          <v-layout v-else>
            <v-flex md12>
              <v-container>No chat selected</v-container>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
  </v-flex>
</template>

<script  lang="ts">
import {
  computed,
  defineComponent,
  useFetch,
  useStore,
  watch,
  ref,
  Ref,
  onUnmounted,
  useRoute,
} from '@nuxtjs/composition-api'
import ChatWindow from "./ChatWindow.vue";
import ChatList from "./ChatList.vue";
import {sb} from '~/store/sendBird/sendBird';
import { VuexModuleSendBird } from '~/types/sendBird/sendBird'

export default  defineComponent ({
  components: {
    ChatList,
    ChatWindow,
  },
  props: {},
  setup(props, { emit }) {
    const route = useRoute() as any
    const storeSendBird = useStore<VuexModuleSendBird>()
    const selectedChat = ref(null) as any
    const recipient = ref(null) as any
    const newChat = ref(null) as any

    function selectChat(channel: any) {
      selectedChat.value = channel;
    }
    function setRecipient(user: any) {
      recipient.value = user;
    }

    const { $fetchState, fetch } = useFetch(async () => {
      storeSendBird.dispatch(
        'sendBird/sendBird/connect',
        '002'
      )
      .then(async () => {
        console.log("PSR");
        if (route.params.recipient) {
          try {
            const currentUser = sb.currentUser.userId;
            const chat = await storeSendBird.dispatch(
              'sendBird/sendBird/startChat',
              [
                currentUser,
                `${route.params.recipient}`,
              ]
            )
            newChat.value = chat;
            selectedChat.value = chat;
          } catch (err) {
            console.log(err);
          }
        }
      });
    })
    return {
      selectedChat,
      recipient,
      newChat,
      selectChat,
      setRecipient
    }
  }
});
</script>

<style  lang="scss">
  .chat-wrapper {

    .v-toolbar__title {
      font-size: 1em;
      font-weight: 600;
    }
    #dropdown {
    }
    .menu-item {
      height: 28px;
      font-size: 11px !important;
    }
    .menu > .v-list__tile {
      font-size: 11px !important;
    }
    .v-menu__content {
      top: 70px;
      left: 860px;
    }
}
</style>

