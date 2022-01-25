<template>
  <section class="base">
    <v-row align="stretch" no-gutters style="min-height: 100vh">
      <LeftSide />

      <RightSide />
    </v-row>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import RightSide from '~/components/login/RightSide.vue'
import LeftSide from '~/components/login/LeftSide.vue'

export default defineComponent({
  name: 'LoginPage',
  components: { RightSide, LeftSide },
  layout: 'guest',
})
</script>

<style lang="scss">
body {
  overflow: hidden;
}
</style>
