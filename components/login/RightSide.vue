<template>
  <v-col
    cols="12"
    md="6"
    class="d-none d-md-block light-blue lighten-3 white--text"
  >
    <div class="patterns"></div>

    <v-row align="center" style="min-height: 100%">
      <v-col>
        <NuxtImg
          src="/images/Luwjistik Logo FA-01.png"
          format="webp"
          style="width: 100%"
          class="px-15"
          preload
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'RightSide',
})
</script>

<style lang="scss">
.patterns {
  background: rgb(33, 150, 243);
  background: linear-gradient(
    180deg,
    rgba(33, 150, 243, 1) 75%,
    rgba(0, 183, 252, 1) 100%
  );
}
</style>
