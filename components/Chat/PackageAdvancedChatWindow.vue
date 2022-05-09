<template>
  <div
    class="chat-container-all"
  >
    <ChatWindow
      :current-user-id="USER_ID"
      :room-id="roomId"
      :rooms="rooms"
      :messages="messagesLines"
      :messages-loaded="messageOptions.messagesLoaded"
      :show-files="true"
      :show-emojis="false"
      :show-audio="false"
      :show-reaction-emojis="false"
      :show-add-room="false"
      :message-actions="[]"
      :accepted-files="'image/png, image/jpeg, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv'"
      :rooms-loaded="roomOptions.roomsLoaded"
      :styles="stylesCustom"
      @send-message="sendMessage"
      @fetch-more-rooms="fetchMoreRooms"
      @fetch-messages="fetchMessages"
      @open-file="openFile"
    >
      <!-- <template #room-header-info="{ room, typingUsers, userStatus }">
        <div
          style="font-size: 22px; font-weight: 900"
        >
          {{room.roomName}}
        </div>
      </template>
      <template #room-header-avatar="{ room }">
        <div/>
      </template> -->
      <!-- <template #message="{ message }">
        <v-card
          :class="`
            custom-card-chat mb-1 ${message.senderId === USER_ID ? 'white--text pa-2' : `ml-8 py-2 px-6   ${!checkMessage(message) ? 'mt-8' : ''}`}
          `"
          min-width="140px"
          :color="message.senderId === USER_ID ? 'primary' : ''"
          style="border-radius: 12px;"
          elevation="1"
        >
          <v-img
            v-if="(message.senderId !== USER_ID) && !checkMessage(message)"
            :aspect-ratio="30 / 30"
            height="40"
            width="40"
            class="rounded-circle primary avatar-custom"
          />
          <div
            v-if="(message.senderId !== USER_ID) && !checkMessage(message)"
            class="user-custom"
          >
            {{message.username}}
          </div>
          <div
            style="
              font-size: 14px;
            "
          >
            <v-img
              v-if="message.files && message.files[0] && ((message.files[0].type === 'image/png') || (message.files[0].type === 'image/jpeg'))"
              width="auto"
              height="150"
              class="rounded-lg d-flex justify-center"
              :src="message.files[0].url"
            />
            <div
              v-else-if="message.files && message.files[0] && ((message.files[0].type !== 'image/png') && (message.files[0].type !== 'image/jpeg'))"
            >
              download
              {{message.files[0].url}}
            </div>
            <span
            >
              {{message.content}}
            </span>
          </div>
          <div
            v-if="!checkMessage(message, 'last')"
            class="timestamp-custom"
          >
              {{message.timestamp}}
          </div>
        </v-card>
      </template> -->
    </ChatWindow>

  </div>
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
// import {sb} from '~/store/sendBird/sendBird';
import { VuexModuleSendBird } from '~/types/sendBird/sendBird'
import 'vue-advanced-chat/dist/vue-advanced-chat.css'
import {
  VuexModuleMarketplaces
} from '~/types/marketplace/marketplace'
import { VuexModuleChat, ChatUser } from '~/types/sendbird'

export default defineComponent ({
  components: {
    ChatWindow
  },
  props: {
  },
  setup(props, { emit }) {
    const {$dateFns, $config } = useContext()
    const sb = new SendBird({ appId: $config.sendBirdKey, localCacheEnabled: true });
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
    const USER_ID_CHAT = computed(
      () => storeChat.state.sendbird.chatUser)
    const channelHandler = new sb.ChannelHandler() as any
    // store manage
    const storeChat = useStore<VuexModuleChat>()
    const storeMarketplaces = useStore<VuexModuleMarketplaces>()
    const marketplacesConnected = computed(
      () =>{
        const data = storeMarketplaces.state.marketplaces.marketplaces.marketplacesChat
        return data
    })
    console.log({marketplacesConnected})
    const CHAN_URL = [
      'sendbird_group_channel_361080858_8545db5fdcb5c3afc10e18403292fe13718b95cd',
      'sendbird_group_channel_361072896_4fccc8e9c932b9c07187f6d53d16ec3867575e3c'
    ]
    let chan: SendBird.OpenChannel

    const stylesCustom = {
      // message: {
      //   backgroundMe: '#1961e4',
      // },
    }


    const { $fetchState, fetch } = useFetch(async () => {
      // sb.connect(USER_ID, function(user, error){
      // })
      await fetchRooms()
    })

    const sendMessage = async ({ content, roomId, files, replyMessage }: any) => {
      // console.log({files})
      const msg = new sb.UserMessageParams()
      msg.message = content ?? ''

      if(selectedRoomChannel.value && files && files.length > 0) {
        // msg.data = files[0].toString()
        const msgFile = new sb.FileMessageParams();
        const fileConvert = new File([files[0].blob], `${files[0].name}.${files[0].extension}`, files[0].blob)
        msgFile.file = fileConvert
        msgFile.fileName = `${files[0].name}.${files[0].extension}`;
        msgFile.fileSize = files[0].size;
        // console.log({fileConvert})
        const msgResp = selectedRoomChannel.value.sendFileMessage(msgFile, (msg: any, err: any) => {
          // console.log({msg, err})
          messages.value = [...messages.value, ...parsingMessages([msg])]
          msgInput.value = ''
        })
      }
      if(selectedRoomChannel.value && content) {
        const msgResp = selectedRoomChannel.value.sendUserMessage(msg, (msg: any, err: any) => {
          messages.value = [...messages.value, ...parsingMessages([msg])]
          msgInput.value = ''
        })

      }

    }

    const messagesLines = computed(() => {
      return messages.value
    })

    function parsingRooms (data: any) {

      return data.map( (x: any, i: number) => {
          const lastMessage = x?.lastMessage

          let lastMessageCust = {
            content: lastMessage?.message,
            senderId: lastMessage?._sender?.userId,
            username: lastMessage?._sender?.nickname,
            timestamp: $dateFns.format(
              new Date(lastMessage?.createdAt),
              'HH:mm'
            ),
            // saved: true,
            // distributed: false,
            // seen: false,
            // new: true
          }
          if(lastMessage && lastMessage?.messageType === 'file') {
            lastMessageCust = {
              ...lastMessageCust,
              content: lastMessage?.url
            }
          }
          return {
            roomId: x?.url,
            roomName: x?.name,
            avatar: x?.coverUrl,
            unreadCount: x?.unreadMessageCount,
            // index: 3,
            lastMessage: lastMessageCust,
            users: x?.members.map((y: any) => {
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
      if(data && data.length > 0) {
        return data.map( (x: any, i: number) => {
          return  {
            _id: x?.messageId,
            indexId: x?.messageId,
            content: x?.message ?? '',
            senderId: x?._sender.userId,
            username: x?._sender.nickname,
            avatar: '',
            date: $dateFns.format(
              new Date(x?.createdAt),
              'dd MMMM'
            ),
            timestamp: $dateFns.format(
              new Date(x?.createdAt),
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
            files: x?.plainUrl
            ?[
              {
                name: x?.name,
                size: x?.size,
                type: x?.type,
                // audio: true,
                // duration: 14.4,
                url: x?.url,
                preview: x?.url,
                // progress: 100
              }
            ]
            : [],
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

      } else {
        return []
      }
    }



    async function fetchMoreRooms() {
      roomOptions.value.roomsLoaded = true
      const roomsTemp =  await Promise.all(CHAN_URL.map(async (el: any) => {
        try {
          const room = await sb.GroupChannel.getChannel(el) as any
          room.markAsDelivered();
          return room

          // roomsTemp.push(room)
        } catch (error) {
          console.log('error'+ error);
        }
      }))


      // const roomsTest =  await Promise.all(marketplacesConnected.value.map(async (el: any) => {
      //   try {
      //     if(el?.channel_url) {

      //       const room = await sb.GroupChannel.getChannel(el?.channel_url) as any
      //       room.markAsDelivered();
      //       console.log({room})
      //       return room
      //     }

      //     // roomsTemp.push(room)
      //   } catch (error) {
      //     console.log('error'+ error);
      //   }
      // }))
      // console.log({roomsTest})

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
      // selectedRoomChannel.value = {}
			messageOptions.value.messagesLoaded = false
		}

    const onlyOnceMarkRead = ref(false) as Ref<Boolean>

    watch(
      () => ([messages.value,selectedRoomChannel.value , roomId.value]),
      ([newMessage, newRooms, newRoomId]) => {

        if((newRooms.url === newRoomId) && (newRooms.unreadMessageCount !== 0) && !onlyOnceMarkRead.value) {
          onlyOnceMarkRead.value = true
          newRooms.markAsRead()
          .then(() => {
            rooms.value = rooms.value.map((x: any) => {
              if(x.roomId === newRooms.url) {
                return {
                  ...x,
                  unreadCount: 0
                }
              } else {
                return x
              }
            })
            roomsChannel.value = roomsChannel.value.map((x: any) => {
              if(x.url === newRooms.url) {
                return {
                  ...x,
                  unreadMessageCount: 0
                }
              } else {
                return x
              }
            })
            onlyOnceMarkRead.value = false
          })
          .catch((err: any) => {console.log('ERR', err)})
        }
      },
      { deep: true }
    )

    function fetchMessages({ room, options = {} }: any) {
      const roomChannel = [...roomsChannel.value].filter((x:any) => x.url === room.roomId)[0]
      selectedRoomChannel.value = roomChannel
      if (options.reset && roomChannel) {
				resetMessages()
				roomId.value = room.roomId
        listQuery.value = roomChannel.createPreviousMessageListQuery();
			}


      channelHandler.onDeliveryReceiptUpdated = function(channel: any) {
          rooms.value = rooms.value.map((x: any) => {
            if(x.roomId === channel.url) {

              const lastMessage = channel.lastMessage
              const unreadCount = channel.unreadMessageCount ? channel.unreadMessageCount + 1  : channel.unreadMessageCount

              let lastMessageCust = {
                content: lastMessage?.message,
                senderId: lastMessage?._sender?.userId,
                username: lastMessage?._sender?.nickname,
                timestamp: $dateFns.format(
                  new Date(lastMessage?.createdAt),
                  'HH:mm'
                ),
                // saved: true,
                // distributed: false,
                // seen: false,
                // new: true
              }
              if(lastMessage && lastMessage?.messageType === 'file') {
                lastMessageCust = {
                  ...lastMessageCust,
                  content: lastMessage?.url
                }
              }
              return {
                ...x,
                unreadCount,
                lastMessage: lastMessageCust,
              }
            } else {
              return x
            }
          })
          roomsChannel.value = roomsChannel.value.map((x: any) => {
            if(x.url === channel.url) {
              return channel
            } else {
              return x
            }
          })
      }


      const LIMIT = 30
      listQuery.value.limit = LIMIT
      listQuery.value.load(function(messageList: any, error: any) {
          if (error) {
            console.log({error})
              // Handle error.
          }
          if (messageList && (messageList.length === 0 || messageList.length < LIMIT)) {
						setTimeout(() => (messageOptions.value.messagesLoaded = true), 0)
					}
          console.log({messageList})
          if (options.reset) messages.value = []
          messages.value = [...parsingMessages(messageList), ...messages.value]
      })

      channelHandler.onMessageReceived = function(channel: any, message: any) {
        // FILTERED DUPLICATED MESSAGE
        if (selectedRoomChannel.value.url === channel.url) {
          const filteredArr = [...messages.value, ...parsingMessages([message])].reduce((acc, current) => {
            const x = acc.find((item: any) => item.indexId === current.indexId);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
          messages.value = filteredArr
        }
      };

      sb.addChannelHandler(uuidv4(), channelHandler);
    }

    function checkMessage(data: any, type?: string) {
      let temp = false
      const customArray = [...messagesLines.value].filter((x: any) => data.senderId === x.senderId)
      const index = customArray.findIndex((x: any) => data.indexId === x.indexId)
      switch (type) {
        case 'last':
          if(
            customArray &&
            customArray.length > 0 &&
            customArray[index + 1]
          ) {

            temp = data.timestamp === customArray[index + 1].timestamp
          } else if(
            !customArray[index -1] &&
            !customArray[index +1]
          ) {
            temp = false
          }

          break;

        default:
          if(
            customArray &&
            customArray.length > 0 &&
            customArray[index -1]
          ) {

            temp = data.timestamp === customArray[index -1].timestamp
          } else if(
            !customArray[index -1] &&
            !customArray[index +1]
          ) {
            temp = false
          }
          break;
      }

      return temp
    }

    function openFile({ message, file }: { message: any, file: any }) {
      window.open(file?.file?.preview,'_self');
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
      messageOptions,
      checkMessage,
      openFile,
      stylesCustom
    }
  }
})
</script>
<style lang="scss">
  .chat-container-all {
    .avatar-custom {
      position: absolute;
      left: 0;
      top: 0;
      transform: translateX(-50%) translateY(-50%);
    }
    .user-custom {
      position: absolute;
      left: 25px;
      top: -5px;
      transform:  translateY(-100%);
      color: grey;
      font-weight: 600;
      font-size: 13px;
    }
    .timestamp-custom {
        font-size: 8px;
        justify-content: right;
        display: flex;
        position: absolute;
        color: grey;
        right: 5px;
        bottom: -2px;
        transform: translateY(100%);
    }
    .custom-card-chat {
      box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 9%), 0px 1px 5px 0px rgb(0 0 0 / 10%), 0px 1px 12px 0px rgb(0 0 0 / 8%) !important;
    }
    .vac-files-box{
      div:not(:nth-child(1)) {
        .vac-room-file-container {
          display: none !important;


        }
      }
      .vac-svg-button {
        display: none !important;
      }
    }
    .vac-media-preview {
      width: 100% !important;
    }
  }
</style>