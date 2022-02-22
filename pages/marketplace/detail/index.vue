<template>
  <section class="pa-4 pa-md-10 py-8">

  <v-row
  >
    <v-col
      cols="4"
    >
      <v-row>
        <v-col
          cols="3"
          class="d-flex justify-center aling-center"
        >
          <v-card
            elevation="0"
            shaped
            tile
            class="rounded-circle"
            height="80px"
            width="80px"
            color="blue"
          >
          </v-card>
        </v-col>
        <v-col>
          <v-row>
            Ninja Van
          </v-row>
          <v-row>
            Ninja Van
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-col>
      tes
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
  reactive,
  watch,
  ref,
  useMeta,
  useRouter,
} from '@nuxtjs/composition-api'
// Interfaces or types

export default defineComponent({
  name: 'DetailMarketPlace',
  layout: 'default',
  head: {},
})
</script>

<style lang="scss">

</style>
