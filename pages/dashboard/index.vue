<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseHeadlinePage
      title="Dashboard"
      subtitle="View the analytics of order processing data such as status, destination, and category."
    />

    <v-row v-if="analytics" align="center">
      <v-col cols="12">
        <iframe
          :src="analytics"
          frameborder="0"
          width="100%"
          style="height: 100vh"
        />
      </v-col>
    </v-row>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useFetch,
  useStore,
} from '@nuxtjs/composition-api'
// types
import { VuexModuleOrders } from '~/types/dashboards'

export default defineComponent({
  name: 'DashboardPages',
  setup() {
    const storeDashboards = useStore<VuexModuleOrders>()
    const analytics = computed(() => storeDashboards.state.dashboards.analytics)

    useFetch(async () => {
      await storeDashboards.dispatch('dashboards/getAnalytics')
    })

    return {
      analytics,
    }
  },
})
</script>
