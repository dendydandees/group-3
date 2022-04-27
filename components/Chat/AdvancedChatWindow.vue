<template>
  <!-- <div>
    <pre id="chat">
      {{ messagesLines }}
    </pre>
    <input v-model="msgInput" type="text" />
    <button @click="sendMsg">Send</button>
  </div> -->
  <v-flex md12 class="chat-wrapper">
    <v-card elevation="2" tile>
      <v-layout row>
        <v-flex xs4 elevation="1">
          <v-toolbar flat dense>
            <v-toolbar-title>Messenger</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>

          <!-- <ChatList :new-chat="newChat" @selectChat="selectChat"></ChatList> -->
          <v-list one-line class="chat-list">
            <template v-for="(item, index) in rooms">
              <v-list-item
                :id="item.url"
                :key="item.url"
                class="chat-list-item"
                avatar ripple
              >
                <!-- @click="openChat(item)" -->
                <v-list-item-avatar>
                  <img

                    :src="item.coverUrl"
                  >
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    <span class="name">{{ item.name }}</span>
                    <!-- <span class="time">{{ getLastMessage(item).time }}</span> -->
                  </v-list-item-title>
                  <!-- <v-list-item-sub-title>{{  getLastMessage(item).message }}</v-list-item-sub-title> -->
                </v-list-item-content>
              </v-list-item>
              <v-divider :key="index"></v-divider>
            </template>
          </v-list>




        </v-flex>
        <v-divider vertical></v-divider>
        <v-flex xs8>
          <!-- <v-toolbar flat dense>
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
          </v-toolbar> -->
          <v-divider></v-divider>
          <v-card flat class="chat-window">
            <div id="message-card">
                <!-- v-scroll:#message-card="loadMoreMessages"  -->
              <v-flex
                xs12
              >
                <v-list>
                  <template v-for="(item, index) in messagesLines">
                    <v-list-item :key="item.messageId" class="ma-0 pa-0">
                      <v-spacer v-if="!isCurrentUser(item)"></v-spacer>
                      <v-avatar v-if="isCurrentUser(item)" size="24"><img :src="''"/></v-avatar>
                      <v-chip :key="item.message_id" :color="!isCurrentUser(item) ? 'secondary' : null" :class="`pa-0 my-0 message ${getClass(item)}`">{{ item.message }}</v-chip>
                    </v-list-item>
                    <v-list-item :key="index">
                      <v-spacer v-if="!isCurrentUser(item)"></v-spacer>
                      <v-subheader class="caption" outline>{{ getDate(item.createdAt) }}</v-subheader>
                    </v-list-item>
                  </template>
                </v-list>
              </v-flex>
            </div>
            <v-divider></v-divider>
            <v-card-actions>
              <v-form @submit.prevent>
                <v-text-field v-model="msgInput" label="Type Message..." solo flat>
                  <template slot="append">
                    <v-btn text icon type="submit" @click="sendMsg">
                      <v-icon dark>send</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-form>
            </v-card-actions>
          </v-card>
          <!-- <v-layout v-else>
            <v-flex md12>
              <v-container>No chat selected</v-container>
            </v-flex>
          </v-layout> -->
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
} from '@nuxtjs/composition-api'
import { PropType } from 'vue';
import ChatWindow from 'vue-advanced-chat'
import SendBird from 'sendbird';
import {sb} from '~/store/sendBird/sendBird';
import { VuexModuleSendBird } from '~/types/sendBird/sendBird'
import 'vue-advanced-chat/dist/vue-advanced-chat.css'

export default defineComponent ({
  components: {
    ChatWindow
  },
  props: {
  },
  setup(props, { emit }) {
    const storeSendBird = useStore<VuexModuleSendBird>()
    const rooms = ref([]) as any
    const messageAll = ref([]) as any
    const msgInput = ref('')
    const recipient = ref(null) as any
    const messages = ref([] as any)
    const USER_ID = 'abcxyz'
    const CHAN_URL = 'sendbird_open_channel_7003_10ec006caac2d0a76bb3d39abf05a4c392eb57f9'
    let chan: SendBird.OpenChannel

    useFetch(async () => {
      sb.connect(USER_ID, function(user, error){
        console.log({user, error})
      })
      chan = await sb.OpenChannel.getChannel(CHAN_URL)
      rooms.value = [chan]
      console.log({chan})

      const enterResp = await chan.enter()
      console.log({enterResp})



      const listQuery = chan.createPreviousMessageListQuery();
      listQuery.load(function(messageList, error) {
          if (error) {
            console.log({messageList,error})
              // Handle error.
          }
          // messages.value = messageList.map((el: any) => el.message)
          //   console.log({messageList})
          messages.value = messageList
            console.log({messageList})
      })


      const msg = new sb.UserMessageParams()
      // msg.message = 'Hello world'
      const msgResp = chan.sendUserMessage(msg, (msg, err) => {
        console.log({msg, err})
      })
      console.log({msgResp})

      const channelHandler = new sb.ChannelHandler();
      channelHandler.onMessageReceived = function(channel, message) {
        messages.value.push((message as any))
        // messages in on a per-channel basis
        // chanMesssages[channel.id].push({})

        console.log({channel, message})
      };
      sb.addChannelHandler('ABC123', channelHandler);


    })

    watch(
      () => ([messages.value]),
      ([newMessage]) => {
        setTimeout(() => {
          scrollToBottom()
        }, 500)
      }
    )

    const sendMsg = () => {
      // this also needs to be added to the messageLog
      const msg = new sb.UserMessageParams()
      msg.message = msgInput.value
      const msgResp = chan.sendUserMessage(msg, (msg, err) => {
        messages.value.push((msg as any))
        console.log({msg, err})
        msgInput.value = ''
      })
      console.log({msgResp})
    }

    const messagesLines = computed(() => {
      console.log(messages.value)
      return messages.value
    })
    function isCurrentUser(message: any) {
      // console.log('isCurrentUser', {message})
      return message._sender.userId !== USER_ID;
    }
    function getClass(message: any) {
      return isCurrentUser(message) ? 'received' : 'sent';
    }
    function getDate(timestamp: any) {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function scrollToBottom() {
      // const el = document.getElementsByClassName('message');
      // if (el && el.length > 0) {
      //   console.log({el})
      //   el[8].scrollIntoView({behavior: 'smooth'});
      // }
      const messageCard = document.getElementById('message-card') as any
      console.log({messageCard, height: messageCard.scrollHeight, clientHeight:messageCard.clientHeight,  top: messageCard.scrollHeight - messageCard.clientHeight})
      // messageCard.scrollTop = messageCard.scrollHeight - messageCard.clientHeight;
      messageCard.scrollTop = messageCard.scrollHeight
    }

    return {
      sendMsg,
      msgInput,
      messagesLines,
      USER_ID,

      rooms,
      messageAll,

      isCurrentUser,
      getClass,
      getDate
    }
  }
})
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
  .chat-list {
    .time{
      float: right;
      font-size: 11px;
      color: rgba(0,0,0,0.75);
    }
    .name{
      font-size: 15px;
      font-weight: 600
    }
  }
  .chat-window {
    #message-card { max-height: 70vh; min-height: 70vh; overflow-y: scroll; overflow-x: hidden}
    .timestamp > .v-subheader{ font-size: 10px !important}
    .message { border-radius: 10px; max-width: 80%;}
    .v-card__actions{ height: 49px }
    .v-input__slot{ margin-top: 27px }
    .received { background-color: rgb(167, 167, 167) !important; color: white !important }
    .sent { background-color: rgb(41, 182, 246) !important; color: white !important }
    .v-form { width: 100%}
  }
}
</style>