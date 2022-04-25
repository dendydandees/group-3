<template>
   <v-card flat class="chat-window">
        <div id="message-card">
          <v-flex v-scroll:#message-card="loadMoreMessages" xs12>
            <v-list>
              <template v-for="(item, index) in messages">
                <v-list-tile :key="index" class="ma-0 pa-0">
                  <v-spacer v-if="isCurrentUser(item)"></v-spacer>
                  <v-avatar v-if="!isCurrentUser(item)" size="24"><img :src="recipient.avatar || ''"/></v-avatar>
                  <v-chip :key="item.message_id" :color="isCurrentUser(item) ? 'secondary' : null" :class="`pa-0 my-0 message ${getClass(item)}`">{{ item.message }}</v-chip>
                </v-list-tile>
                <v-list-tile :key="index">
                  <v-spacer v-if="isCurrentUser(item)"></v-spacer>
                  <v-subheader class="caption" outline>{{ getDate(item.createdAt) }}</v-subheader>
                </v-list-tile>
              </template>
            </v-list>
          </v-flex>
        </div>
        <v-divider></v-divider>
        <v-card-actions>
          <v-form @submit.prevent>
            <v-text-field v-model="newMessage" label="Type Message..." solo flat>
              <template slot="append">
                <v-btn flat icon type="submit" @click="send()">
                  <v-icon dark>send</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-form>
        </v-card-actions>
        </v-card>
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
import {sb} from '~/store/sendBird/sendBird';
import { VuexModuleSendBird } from '~/types/sendBird/sendBird'

export default defineComponent ({
  props: {
    channel: {
      type : Object as any,
      required: false
    }
  },
  setup(props, { emit }) {
    const storeSendBird = useStore<VuexModuleSendBird>()
    const newMessage = ref('')
    const messages = ref([]) as any
    const recipient = ref({}) as any
    const messageQuery = ref(null)


    async function getMessages() {
      try{
        const history = await storeSendBird.dispatch(
          'sendBird/sendBird/getChatMessages',
          messageQuery.value
        )
        messages.value = [...history, ...messages.value];
      } catch(err) { console.log(err) }
    }
    async function loadMoreMessages(event: any) {
      const offsetTop = event.target.scrollTop;
      if(offsetTop === 0) await getMessages();
    }
    function getRecipient(){
      const currentUser = sb.currentUser
      const { members } = props.channel
      const [recipient] = members.filter((user: any) => user.userId !== currentUser.userId)
      recipient.value = { userId: recipient.userId, ...recipient.metaData };
    }
    function isCurrentUser(message: any) {
      return message._sender.userId !== recipient.value.userId;
    }
    function getClass(message: any) {
      return isCurrentUser(message) ? 'sent' : 'received';
    }
    function send() {
      if (newMessage.value) {
        storeSendBird.dispatch(
          'sendBird/sendBird/sendMessage',
          {
            channel: props.channel,
            message: newMessage.value
          }
        )
        .then(response => {
          messages.value.push(response);
          newMessage.value = '';
        }).then(() => { scrollToBottom() });
      }
    }
    function getDate(timestamp: any) {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    function scrollToBottom() {
      const messageCard = document.getElementById('message-card') as any
      messageCard.scrollTop = messageCard.scrollHeight - messageCard.clientHeight;
    }
    const { $fetchState, fetch } = useFetch(async () => {
      getRecipient();
      messageQuery.value = await props.channel.createPreviousMessageListQuery();
      await getMessages();
      scrollToBottom()
      emit('recipientMeta', recipient);
    })

    return {
      newMessage,
      messages,
      recipient,
      messageQuery,
      getMessages,
      loadMoreMessages,
      getRecipient,
      isCurrentUser,
      getClass,
      send,
      getDate,
      scrollToBottom
    }
  }
})
</script>

<style lang="scss">
  .chat-window {
    #message-card { max-height: 70vh; min-height: 70vh; overflow-y: scroll; overflow-x: hidden}
    .timestamp > .v-subheader{ font-size: 10px !important}
    .message { border-radius: 10px; max-width: 80%;}
    .v-card__actions{ height: 49px }
    .v-input__slot{ margin-top: 27px }
    .sent { background-color: rgb(41, 182, 246) !important; color: white !important }
    .received { }
    .v-form { width: 100%}
  }
</style>