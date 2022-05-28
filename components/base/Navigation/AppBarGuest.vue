<template>
  <v-app-bar app color="primary" outlined tile elevation="0">
    <v-toolbar-title>
      <NuxtImg
        src="/images/luwjistik_logo_white_full.png"
        format="webp"
        preload
        class="d-block mr-10"
      />
    </v-toolbar-title>

    <slot name="content" />
  </v-app-bar>
</template>
