import colors from 'vuetify/es5/util/colors'
// Icons
import OrderIcon from '@/components/base/Icon/Order.vue'
import Marketplace from '@/components/base/Icon/Marketplace.vue'
import ClientConnections from '@/components/base/Icon/ClientConnections.vue'
import Profile from '@/components/base/Icon/Profile.vue'

export default {
  breakpoint: {
    mobileBreakpoint: 'sm',
  },
  theme: {
    dark: false,
    themes: {
      light: {
        primary: {
          base: '#1961E4',
          darken1: '#1457D0',
          darken2: '#0947B7',
        },
        secondary: '#FF3D17',
        base: '#F7F7F7',
        info: colors.teal.lighten1,
      },
    },
  },
  icons: {
    // iconfont: 'mdi',
    values: {
      order: { component: OrderIcon },
      marketplace: { component: Marketplace },
      clientConnections: { component: ClientConnections },
      profile: { component: Profile },
    },
  },
}
