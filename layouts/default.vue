<template>
  <v-app>
    <BaseNavigationDrawer
      v-model="drawer"
      :mini="mini"
      @hideMiniSideNav="hideMiniSideNav"
      @doShowSideNav="doShowSideNav"
    />

    <BaseNavigationAppBar :mini="mini" @doShowSideNav="doShowSideNav" />

    <v-main class="base">
      <Nuxt class="main-content" />
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        offset-x
        :nudge-width="200"
        :nudge-top="580"
        :disabled="!isThereRoom"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            :key="'mdi-pencil'"
            :color="'primary'"
            fab
            large
            dark
            bottom
            fixed
            right
            class="v-btn--example btn-notif"
            v-bind="attrs"
            :loading="!isThereRoom"
            v-on="on"
          >
            <v-badge
              color="red"
              :content="countChat"
              :value="countChat"
              overlap
            >
              <v-icon>{{ 'mdi-message-text' }}</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <v-card>
          <v-tabs
            v-model="tab"
            background-color="transparent"
            color="basil"
            grow
          >
            <v-tab v-for="(item, i) in items" :key="i">
              {{ item.name }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item v-for="(item, i) in items" :key="i">
              <v-card width="800px">
                <ChatPackageAdvancedChatWindow
                  :is-incoming="item.isIncoming"
                  :is-open="menu"
                />
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-menu>

      <BaseNavigationFooter />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import {
  defineComponent,
  useContext,
  ref,
  Ref,
  useFetch,
  useStore,
  computed,
  watch,
} from '@nuxtjs/composition-api'
import SendBird from 'sendbird'
import { v4 as uuidv4 } from 'uuid'
import { VuexModuleMarketplaces } from '~/types/marketplace/marketplace'
import { VuexModuleChat } from '~/types/sendbird'

export default defineComponent({
  name: 'DefaultLayout',
  middleware: 'auth',
  setup() {
    const { $config } = useContext()
    const context = useContext()
    const storeMarketplaces = useStore<VuexModuleMarketplaces>()
    const storeChat = useStore<VuexModuleChat>()
    const sb = new SendBird({
      appId: $config.sendBirdKey,
      localCacheEnabled: true,
    })
    const tab = ref(null) as any

    const userEventHandler = new sb.UserEventHandler()
    const items = ref([
      {
        name: 'Messages',
        isIncoming: false,
      },
      {
        name: 'Incoming Messages',
        isIncoming: true,
      },
    ]) as any
    const USER_ID = 'abcxyz'
    // const USER_ID = '30551dfc-8f59-467c-9032-868483202a0f'
    const countChat = ref(0) as Ref<Number>
    const USER_ID_CHAT = computed(() => storeChat.state.sendbird.chatUser)
    const marketplacesConnected = computed(() => {
      const data =
        storeMarketplaces.state.marketplaces.marketplaces.marketplacesChat
      return data
    })
    const marketplacesConnectedIncoming = computed(() => {
      const data =
        storeMarketplaces.state.marketplaces.marketplaces.incomingChat
      return data
    })
    const isThereRoom = computed(() => {
      if (
        (marketplacesConnected.value &&
          marketplacesConnected.value.length > 0) ||
        (marketplacesConnectedIncoming.value &&
          marketplacesConnectedIncoming.value.length > 0)
      ) {
        return true
      } else {
        return false
      }
    })

    watch(
      () => [USER_ID_CHAT],
      ([newUserID]) => {
        if (newUserID.value && newUserID.value?.user_id) {
          sb.connect(newUserID.value?.user_id, function (_user, _error) {})
        }
      },
      { deep: true }
    )
    const { $fetchState } = useFetch(() => {
      setTimeout(async () => {
        await storeChat.dispatch('sendbird/getUserChat')
        await fetchMarketplaceConnected()
        const count = await sb.getTotalUnreadMessageCount()
        // const count = await sb.getTotalUnreadChannelCount();
        countChat.value = count
        userEventHandler.onTotalUnreadMessageCountUpdated = function (
          totalCount,
          _countByCustomTypes
        ) {
          countChat.value = totalCount
        }

        sb.addUserEventHandler(uuidv4(), userEventHandler)
      }, 5000)
    })

    // handle sidenav
    const drawer = ref(!context.$vuetify.breakpoint.mobile) as Ref<boolean>
    const mini = ref(false) as Ref<boolean>
    const menu = ref(false) as Ref<boolean>
    const doShowSideNav = () => {
      const isMobile = context.$vuetify.breakpoint.smAndDown

      if (isMobile) return (drawer.value = !drawer.value)

      return (mini.value = !mini.value)
    }
    const hideMiniSideNav = () => {
      mini.value = false
    }

    async function fetchMarketplaceConnected() {
      const dataParams = {
        page: 1,
        perPage: 10000,
      }
      try {
        $fetchState.pending = true
        await storeMarketplaces.dispatch(
          'marketplaces/marketplaces/getMarketplacesConnected',
          { params: dataParams, isChat: true }
        )
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }

    return {
      drawer,
      mini,
      menu,
      doShowSideNav,
      hideMiniSideNav,
      countChat,
      USER_ID,
      isThereRoom,
      tab,
      items,
    }
  },
})
</script>

<style lang="scss">
.main-content {
  margin-bottom: 35rem;
}

@media only screen and (min-width: 1024px) {
  .main-content {
    margin-bottom: 20rem;
  }
  .btn-notif {
    .notif-count {
      position: absolute;
      right: 5px;
      top: -5px;
      background: red;
      z-index: 1;
      font-size: 8px;
      padding: 2px;
      border-radius: 5px;
    }
  }
}
</style>
