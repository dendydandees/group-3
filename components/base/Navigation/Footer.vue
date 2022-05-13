<template>
  <v-footer absolute padless dark color="primary">
    <v-col cols="12" md="4">
      <v-col cols="auto">
        <v-btn text href="#"> Contact </v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn text href="#"> About Us </v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn text href="#"> Terms & Conditions </v-btn>
      </v-col>
    </v-col>

    <v-col cols="12" md="4">
      <v-col cols="auto">
        <v-btn text href="#"> Carrers </v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn text href="#"> Change Country </v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn text href="https://luwjistik.document360.io/docs" target="_blank"> FAQ </v-btn>
      </v-col>
    </v-col>

    <v-col cols="12" class="pa-8 pt-0">
      <NuxtImg
        src="/images/luwjistik_logo_white_full_lg.png"
        format="webp"
        preload
        class="ml-auto d-block"
      />
    </v-col>
  </v-footer>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'BaseNavigationFooter',
  setup() {},
})
</script>
