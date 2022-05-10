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
      <!-- <v-menu
        v-model="menu"
        :close-on-content-click="false"
        offset-x
        :nudge-width="200"
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
            class="v-btn--example"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>{{'mdi-message-text' }}</v-icon>
          </v-btn>
        </template>

        <v-card
          width="800px"
        >
          <ChatPackageAdvancedChatWindow />
        </v-card>
      </v-menu> -->

      <BaseNavigationFooter />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, useContext, ref, Ref, useFetch,useStore, computed, watch } from '@nuxtjs/composition-api'
import SendBird from 'sendbird';
import {
  VuexModuleMarketplaces
} from '~/types/marketplace/marketplace'
import { VuexModuleChat, ChatUser } from '~/types/sendbird'

export default defineComponent({
  name: 'DefaultLayout',
  middleware: 'auth',
  setup() {
    const {$dateFns, $config } = useContext()
    const context = useContext()
    const storeMarketplaces = useStore<VuexModuleMarketplaces>()
    const storeChat = useStore<VuexModuleChat>()
    const sb = new SendBird({ appId: $config.sendBirdKey, localCacheEnabled: true });
    const USER_ID = 'abcxyz'
    // const USER_ID = '30551dfc-8f59-467c-9032-868483202a0f'
    const countChat = ref(0) as Ref<Number>
    const USER_ID_CHAT = computed(
      () => storeChat.state.sendbird.chatUser)

    watch(
      () => [USER_ID_CHAT],
      ([newUserID]) => {
        console.log({newUserID})
        if(newUserID.value && newUserID.value?.user_id) {

          sb.connect(newUserID.value?.user_id, function(user, error){
          })
        }
      },
      { deep: true }
    )
    const { $fetchState, fetch } = useFetch(async () => {
      // await storeChat.dispatch(
      //   'sendbird/getUserChat'
      // )
      // sb.connect(USER_ID, function(user, error){
      // })
      // await fetchMarketplaceConnected()
      // sb.getTotalUnreadMessageCount(function(count, error) {
      //     if (error) {
      //         // Handle error.
      //     }
      //     countChat.value = count
      // });
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


    async function fetchMarketplaceConnected () {
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
}
</style>
