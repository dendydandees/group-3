import colors from 'vuetify/es5/util/colors'

const development = process.env.NODE_ENV === 'development'

export default {
  // Rendering property : https://nuxtjs.org/docs/features/rendering-modes
  ssr: false,
  // Server property: https://nuxtjs.org/docs/configuration-glossary/configuration-server#the-server-property
  server: {
    port: process.env.PORT,
    host: process.env.HOST,
  },

  // Loading property: https://nuxtjs.org/docs/features/loading
  loading: {
    color: '#2196F3',
    failedColor: '#F44336',
    height: '4px',
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Client Portal',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Luwjistik client orders',
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: 'luwjistik, client, orders',
      },
      { hid: 'author', name: 'author', content: 'Luwjistik' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver',
        body: true,
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/scss/main.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/vee-validate.js', '~/plugins/customUtils.ts'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api/module',
    '@vueuse/nuxt',
    // https://github.com/harlan-zw/nuxt-webpack-optimisations
    'nuxt-webpack-optimisations',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxt/image',
    '@nuxtjs/sentry',
  ],

  // Auth modules configuration: https://auth.nuxtjs.org
  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          required: true,
          type: '',
          maxAge: 86400,
        },
        user: {
          property: false,
          autoFetch: false,
        },
        endpoints: {
          login: { url: '/api/login', method: 'post' },
          user: false,
          logout: false,
        },
      },
    },
  },

  // Nuxt image configuration: https://image.nuxtjs.org
  image: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/scss/variables.scss'],
    treeShake: true,
    breakpoint: {
      mobileBreakpoint: 'sm',
    },
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.blue.darken2,
          secondary: colors.red.base,
          base: colors.grey.lighten4,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vee-validate/dist/rules'],
    loaders: {
      vue: {
        prettify: false,
      },
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    proxy: development,
    baseURL: development ? '/' : process.env.API_URL,
    browserBaseURL: '/',
  },

  proxy: {
    '/api/': process.env.API_URL,
  },

  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    publishRealse: true,
    config: {
      release: process.env.RELEASE || '',
    },
  },

  webpackOptimisations: {
    // hard source is the riskiest, if you have issues don't enable it
    hardSourcePlugin: development,
    parallelPlugin: development,
  },
}
