<template>
  <section class="base">
    <v-row align="stretch" no-gutters style="min-height: 100vh">
      <LoginLeftSide />
      <LoginRightSide />
      <v-row>
        <v-btn @click="throwError()">Throw error</v-btn>
      </v-row>
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
      throw new Error("throw dev client error v2")
    }
  }
})
</script>

<style lang="scss">
body {
  overflow: hidden;
}
</style>
