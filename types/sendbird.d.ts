import { RootStateChat } from '~/store/sendbird'

export interface VuexModuleChat {
  sendbird: RootStateChat
}

export interface ChatUser {
  user_id: string
  nickname: string
}
export interface ChatChannel {
  name: string
  channel_url: string
  logo?: string
  client_name: string
}
