<template>
  <v-col cols="12" md="6" class="d-none d-md-block white--text">
    <v-row
      align="center"
      style="
        min-height: 100%;
        background-color: transparent;
        position: relative;
      "
    >
      <div class="patterns" />

      <v-col style="z-index: 2">
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

<style lang="scss" scoped>
.patterns {
  position: absolute;
  top: 0;
  left: 0;
  background: rgb(33, 150, 243);
  background: linear-gradient(180deg, #4fc3f7 50%, #00d7f3 100%);
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
