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
  background-color: #e5e5f7;
  opacity: 0.1;
  background: repeating-linear-gradient(
    -45deg,
    #2196f3,
    #424242 17.5px,
    #e5e5f7 17.5px,
    #424242 87.5px
  );
  min-width: 100%;
  min-height: 100%;
  position: absolute;
  top: 0;
}
</style>
