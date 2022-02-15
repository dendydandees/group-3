<template>
  <section class="base">
    <v-row align="stretch" no-gutters style="min-height: 100vh">
      <LoginLeftSide />

      <LoginRightSide />
    </v-row>
    <v-row>
      <v-btn @click="throwError()">Throw error</v-btn>
    </v-row>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'LoginPage',
  layout: 'guest',
  methods: {
    throwError: function () {
      console.error("throw dev client error")
      throw new Error("throw dev client error")
    }
  }
})
</script>

<style lang="scss">
body {
  overflow: hidden;
}
</style>
