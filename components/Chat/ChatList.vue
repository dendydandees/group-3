<template>
  <v-list one-line class="chat-list">
    <template v-for="(item, index) in chatList">
      <v-list-tile
        :id="item.url"
        :key="index"
        class="chat-list-item"
        avatar
        ripple
        @click="openChat(item)"
      >
        <v-list-tile-avatar>
          <img :src="getRecipient(item).avatar" />
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>
            <span class="name">{{ getRecipient(item).name }}</span>
            <span class="time">{{ getLastMessage(item).time }}</span>
          </v-list-tile-title>
          <v-list-tile-sub-title>{{
            getLastMessage(item).message
          }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider :key="index"></v-divider>
    </template>
  </v-list>
</template>

<script lang="ts">
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
import users from './userMocks.js'
import { sb } from '~/store/sendBird/sendBird'
import { VuexModuleSendBird } from '~/types/sendBird/sendBird'

export default defineComponent({
  props: { newChat: { type: Object, required: false } },
  setup(props, { emit }) {
    const storeSendBird = useStore<VuexModuleSendBird>()
    const chatList = ref([])
    const selectedId = ref(null)
    function getList() {
      storeSendBird
        .dispatch('sendBird/sendBird/connect', '002')
        .then(async (res) => {
          const list = await storeSendBird.dispatch(
            'sendBird/sendBird/getChatList'
          )
          chatList.value = list
        })
    }
    function getRecipient(chat: any) {
      const currentUser = sb.currentUser
      const { members } = chat
      const [recipient] = members.filter(
        (user: any) => user?.userId !== currentUser?.userId
      )
      return {
        name: recipient?.metaData?.fullName,
        avatar: recipient?.metaData?.avatar || null, // could have a default picture for every profile
      }
    }
    function getLastMessage(chat: any) {
      if (chat.lastMessage) {
        const {
          lastMessage: { createdAt, message },
        } = chat
        const timestamp = new Date(createdAt).toLocaleDateString('en-US')
        return { time: timestamp, message }
      }
      return { time: '', message: '' }
    }
    async function deleteChat(channel: any) {
      try {
        await storeSendBird.dispatch('sendBird/sendBird/deleteChat', channel)
      } catch (err) {
        console.log(err)
      }
    }
    function openChat(channel: any) {
      const prevClicked = document.getElementById(selectedId.value as any)
      if (prevClicked) prevClicked.style.background = 'white'

      const currentClicked = document.getElementById(channel.url) as any
      selectedId.value = channel.url
      if (currentClicked) currentClicked.style.background = '#E0E0E0'
      emit('selectChat', channel)
    }
    watch(
      () => [props.newChat],
      (newChat) => {
        getList()
        openChat(newChat)
      },
      { deep: true }
    )

    const { $fetchState, fetch } = useFetch(async () => {
      await getList()
    })

    return {
      chatList,
      selectedId,
      getList,
      getRecipient,
      getLastMessage,
      deleteChat,
      openChat,
    }
  },
})
</script>
<style lang="scss">
.chat-list {
  .time {
    float: right;
    font-size: 11px;
    color: rgba(0, 0, 0, 0.75);
  }
  .name {
    font-size: 15px;
    font-weight: 600;
  }
}
</style>
