<template>
  <section class="base">
    <v-row align="stretch" no-gutters style="min-height: 100vh">
      <LoginLeftSide />

      <LoginRightSide />
    </v-row>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'LoginPage',
  layout: 'guest',
})
</script>

<style lang="scss">
body {
  overflow: hidden;
}
</style>
