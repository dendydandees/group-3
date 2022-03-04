<template>
  <section class="base">
    <v-row
      align="center"
      justify="center"
      no-gutters
      style="min-height: 100vh"
      class="primary"
    >
      <v-col cols="12" md="8" class="white rounded-xl pa-4 py-8 pa-md-15">
        <v-row align="center" justify="center">
          <v-col cols="12" md="5" class="text-center">
            <LoginLeftSide />
          </v-col>

          <v-col cols="12" md="7" class="d-none d-md-block pl-15">
            <div style="width: 100%">
              <NuxtImg
                src="/images/image_login.png"
                format="webp"
                class="d-inline-block"
                style="
                  width: 100%;
                  filter: drop-shadow(1px 1px 1px rgb(0, 0, 0, 1));
                "
                preload
              />
            </div>
          </v-col>
        </v-row>
      </v-col>
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
