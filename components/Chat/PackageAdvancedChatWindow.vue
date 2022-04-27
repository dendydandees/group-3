<template>
  <!-- <div>
    <pre id="chat">
      {{ messagesLines }}
    </pre>
    <input v-model="msgInput" type="text" />
    <button @click="sendMessage">Send</button>
  </div> -->
  <ChatWindow
    :current-user-id="USER_ID"
    :room-id="roomId"
    :rooms="rooms"
    :messages="messagesLines"
    :show-files="false"
    :show-emojis="false"
    :show-audio="false"
    :show-reaction-emojis="false"
    :show-add-room="false"
    :message-actions="[]"
    :rooms-loaded="roomOptions.roomsLoaded"
    @send-message="sendMessage"
    @fetch-more-rooms="fetchMoreRooms"
    @fetch-messages="fetchMessages"
  >
    <!-- [roomsLoaded]="true"
    [messagesLoaded]="messagesLoaded"
    [showFiles]="true"
    [showEmojis]="true"
    [showReactionEmojis]="true"
    [showFooter]="true"
    (fetch-messages)="fetchMessages($event.detail[0])"
    (send-message)="sendMessage($event.detail[0])" -->
  </ChatWindow>
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
    const roomId = ref('') as any
    const roomOptions = ref({
      roomsLoaded: false
    }) as any
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
      fetchRooms()
      // rooms.value = parsingRooms([chan])

      console.log({chan})

      const enterResp = await chan.enter()
      console.log({enterResp})


      // PREVIOUE MESSAGES
      // const listQuery = chan.createPreviousMessageListQuery();
      // listQuery.load(function(messageList, error) {
      //     if (error) {
      //       console.log({messageList,error})
      //     }
      //     messages.value = parsingMessages(messageList)
      //       console.log({messageList})
      // })


      // const msg = new sb.UserMessageParams()
      // // msg.message = 'Hello world'
      // const msgResp = chan.sendUserMessage(msg, (msg, err) => {
      //   console.log({msg, err})
      // })
      // console.log({msgResp})

      // RECEIVES NEW MESSAGES
      // const channelHandler = new sb.ChannelHandler();
      // channelHandler.onMessageReceived = function(channel, message) {
      //   // messages.value.push((message as any))
      //   // messages in on a per-channel basis
      //   // chanMesssages[channel.id].push({})
      //   messages.value = [...messages.value, ...parsingMessages([message])]

      //   console.log({channel, message})
      // };
      // sb.addChannelHandler('ABC123', channelHandler);


    })

    const sendMessage = async ({ content, roomId, files, replyMessage }: any) => {
      console.log({content})
      // alert(content)
      // this also needs to be added to the messageLog
      const msg = new sb.UserMessageParams()
      msg.message = content
      const msgResp = chan.sendUserMessage(msg, (msg, err) => {

        messages.value = [...messages.value, ...parsingMessages([msg])]
        console.log({msg, err})
        msgInput.value = ''
      })
      console.log({msgResp})
    }

    const messagesLines = computed(() => {
      console.log(messages.value)
      return messages.value
    })

    function parsingRooms (data: any) {
      return data.map((x: any) => {
        return  {
          roomId: x.url,
          roomName: x.name,
          avatar: x.coverUrl,
          // unreadCount: 4,
          // index: 3,
          // lastMessage: {
          //   content: 'Last message received',
          //   senderId: 1234,
          //   username: 'John Doe',
          //   timestamp: '10:20',
          //   saved: true,
          //   distributed: false,
          //   seen: false,
          //   new: true
          // },
          users: x.operators.map((y: any) => {
            return {
              _id: y.userId,
              username: y.nickname,
              avatar: '',
              // status: {
              //   state: 'online',
              //   lastChanged: 'today, 14:30'
              // }
            }
          })
          // typingUsers: [ 4321 ]
        }
      })
    }

    function parsingMessages (data: any) {
      return data.map((x: any, i: number) => {
        return {
          _id: x.messageId,
          indexId: i,
          content: x.message,
          senderId: x._sender.userId,
          username: x._sender.nickname,
          avatar: '',
          date: '',
          timestamp: '',
          // system: false,
          // saved: true,
          // distributed: true,
          // seen: true,
          // deleted: false,
          // failure: true,
          // disableActions: false,
          // disableReactions: false,
          // files: [
          //   {
          //     name: 'My File',
          //     size: 67351,
          //     type: 'png',
          //     audio: true,
          //     duration: 14.4,
          //     url: 'https://firebasestorage.googleapis.com/...',
          //     preview: 'data:image/png;base64,iVBORw0KGgoAA...',
          //     progress: 88
          //   }
          // ],
          // reactions: {
          //   😁: [
          //     1234, // USER_ID
          //     4321
          //   ],
          //   🥰: [
          //     1234
          //   ]
          // },
          // replyMessage: {
          //   content: 'Reply Message',
          //   senderId: 4321,
          //   files: [
          //     {
          //       name: 'My Replied File',
          //       size: 67351,
          //       type: 'png',
          //       audio: true,
          //       duration: 14.4,
          //       url: 'https://firebasestorage.googleapis.com/...',
          //       preview: 'data:image/png;base64,iVBORw0KGgoAA...'
          //     }
          //   ]
          // }
        }
      })
    }

    async function fetchMoreRooms() {
      roomOptions.value.roomsLoaded = true
      chan = await sb.OpenChannel.getChannel(CHAN_URL)
      rooms.value = parsingRooms([chan])
      roomOptions.value.roomsLoaded = false
    }
    function resetRooms() {
      roomOptions.value.roomsLoaded = false
      rooms.value = []
    }

    function fetchRooms() {
      resetRooms()
			fetchMoreRooms()
    }

    function fetchMessages({ room, options = {} }: any) {
      if (options.reset) {
				// resetMessages()
        console.log('fetchMessage', {room, options})
				roomId.value = room.roomId
        // chan.enter().then()
			}
      const listQuery = chan.createPreviousMessageListQuery();
      listQuery.load(function(messageList, error) {
          if (error) {
            console.log({messageList,error})
              // Handle error.
          }
          // messages.value = messageList.map((el: any) => el.message)
          //   console.log({messageList})
          // messages.value = messageList
          messages.value = parsingMessages(messageList)
            console.log({messageList})
      })

      const channelHandler = new sb.ChannelHandler();
      channelHandler.onMessageReceived = function(channel, message) {
        // messages.value.push((message as any))
        // messages in on a per-channel basis
        // chanMesssages[channel.id].push({})
        messages.value = [...messages.value, ...parsingMessages([message])]

        console.log({channel, message})
      };
      sb.addChannelHandler('ABC123', channelHandler);
    }

    return {
      sendMessage,
      msgInput,
      messagesLines,
      USER_ID,
      CHAN_URL,
      rooms,
      fetchRooms,
      fetchMoreRooms,
      roomOptions,
      fetchMessages,
      roomId
    }
  }
})
</script>