<template>
  <ChatWindow
    :current-user-id="USER_ID"
    :room-id="roomId"
    :rooms="rooms"
    :messages="messagesLines"
    :messages-loaded="messageOptions.messagesLoaded"
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
    <!--
    [messagesLoaded]="messagesLoaded"
    [showFiles]="true"
    [showEmojis]="true"
    [showReactionEmojis]="true"
    [showFooter]="true"
    (fetch-messages)="fetchMessages($event.detail[0])"
    (send-message)="sendMessage($event.detail[0])" -->

    <!-- <template #message="{ message }">
      tes
    </template> -->
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
  useContext,
  onUnmounted,
} from '@nuxtjs/composition-api'
import { PropType } from 'vue';
import ChatWindow from 'vue-advanced-chat'
import SendBird from 'sendbird';
import { v4 as uuidv4 } from 'uuid'
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
    const {$dateFns } = useContext()
    const storeSendBird = useStore<VuexModuleSendBird>()
    const rooms = ref([]) as any
    const roomsChannel = ref([]) as any
    const selectedRoomChannel = ref({}) as any
    const roomId = ref('') as any
    const roomOptions = ref({
      roomsLoaded: false
    }) as any
    const messageOptions = ref({
      messagesLoaded: false
    }) as any
    const messageAll = ref([]) as any
    const msgInput = ref('')
    const recipient = ref(null) as any
    const listQuery = ref({}) as any
    const messages = ref([] as any)
    const USER_ID = 'abcxyz'
    const CHAN_URL = [
      'sendbird_open_channel_7003_10ec006caac2d0a76bb3d39abf05a4c392eb57f9',
      'sendbird_open_channel_7003_7908f2fc5d059a1906f5f5bf19934bfeb5932e44'
    ]
    let chan: SendBird.OpenChannel


    useFetch(async () => {
      sb.connect(USER_ID, function(user, error){
      })
      fetchRooms()
    })

    const sendMessage = async ({ content, roomId, files, replyMessage }: any) => {
      const msg = new sb.UserMessageParams()
      msg.message = content

      const msgResp = selectedRoomChannel.value.sendUserMessage(msg, (msg: any, err: any) => {
        messages.value = [...messages.value, ...parsingMessages([msg])]
        msgInput.value = ''
      })
    }

    const messagesLines = computed(() => {
      return messages.value
    })

    function parsingRooms (data: any) {
      return data.map((x: any, i: number) => {
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
      return data.map((x: any) => {
        return {
          _id: x.messageId,
          indexId: x.messageId,
          content: x.message,
          senderId: x._sender.userId,
          username: x._sender.nickname,
          avatar: '',
          date: $dateFns.format(
            new Date(x.createdAt),
            'dd MMMM'
          ),
          timestamp: $dateFns.format(
            new Date(x.createdAt),
            'HH:mm'
          ),
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
      const roomsTemp = [] as any
      await Promise.all(CHAN_URL.map(async (el: any) => {
        try {
          const room = await sb.OpenChannel.getChannel(el)
          roomsTemp.push(room)
        } catch (error) {
          console.log('error'+ error);
        }
      }))

      await Promise.all(roomsTemp.map(async (el: any) => {
        try {
          await  el.enter()
        } catch (error) {
          console.log('error'+ error);
        }
      }))
      rooms.value = parsingRooms(roomsTemp)
      roomsChannel.value = roomsTemp
    }
    function resetRooms() {
      roomOptions.value.roomsLoaded = false
      rooms.value = []
    }

    function fetchRooms() {
      resetRooms()
			fetchMoreRooms()
    }
    function resetMessages() {
			messages.value = []
			messageOptions.value.messagesLoaded = false
		}

    function fetchMessages({ room, options = {} }: any) {
      const roomChannel = [...roomsChannel.value].filter((x:any) => x.url === room.roomId)[0]
      if (options.reset) {
				resetMessages()
				roomId.value = room.roomId
        listQuery.value = roomChannel.createPreviousMessageListQuery();
			}

      selectedRoomChannel.value = roomChannel
      const LIMIT = 30
      listQuery.value.limit = LIMIT
      listQuery.value.load(function(messageList: any, error: any) {
          if (error) {
            console.log({messageList,error})
              // Handle error.
          }
          if (messageList.length === 0 || messageList.length < LIMIT) {
						setTimeout(() => (messageOptions.value.messagesLoaded = true), 0)
					}

          if (options.reset) messages.value = []
          messages.value = [...parsingMessages(messageList), ...messages.value]
      })

      const channelHandler = new sb.ChannelHandler();
      channelHandler.onMessageReceived = function(channel, message) {
        messages.value = [...messages.value, ...parsingMessages([message])]
      };
      sb.addChannelHandler(uuidv4(), channelHandler);
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
      roomId,
      messageOptions
    }
  }
})
</script>