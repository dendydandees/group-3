<template>
  <v-app-bar :elevate-on-scroll="true" app color="white">
    <NuxtLink
      v-if="$vuetify.breakpoint.smAndDown"
      to="/"
      class="d-flex align-center"
    >
      <NuxtImg
        src="/images/Luwjistik Logo FA-02.png"
        format="webp"
        height="32"
        preload
      />
    </NuxtLink>

    <v-spacer v-if="$vuetify.breakpoint.smAndDown" />

    <client-only>
      <div class="d-flex align-center">
        <v-app-bar-nav-icon
          :class="[!$vuetify.breakpoint.smAndDown ? 'mr-4' : '']"
          @click.stop="$emit('doShowSideNav')"
        >
          <v-icon> {{ setIcon }} </v-icon>
        </v-app-bar-nav-icon>
      </div>
    </client-only>
  </v-app-bar>
</template>

<script lang="ts">
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    mini: {
      type: Boolean as () => boolean,
      required: true,
    },
  },
  setup({ mini }) {
    const { $vuetify } = useContext()
    const setIcon = computed(() => {
      return !$vuetify.breakpoint.smAndDown && !mini
        ? 'mdi-backburger'
        : !$vuetify.breakpoint.smAndDown && mini
        ? 'mdi-forwardburger'
        : 'mdi-menu'
    })

    return {
      setIcon,
    }
  },
})
</script>
