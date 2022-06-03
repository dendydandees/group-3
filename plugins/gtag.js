import Vue from 'vue';
import VueGtag from 'vue-gtag';

// Vue.use(VueGtag, {
//   config: { id: process.env.VUE_APP_GOOGLE_ANALYTICS },
//   enable: process.env.NODE_ENV === 'production'
// });

export default ({ $config: { googleAnalytics } }) => {
  Vue.use(VueGtag, {
    config: { id: googleAnalytics.id },
    enable: process.env.NODE_ENV === 'production'
  });
};