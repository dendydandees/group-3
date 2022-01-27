<template>
  <v-app-bar
    :elevate-on-scroll="true"
    app
    color="white"
    outlined
    tile
    style="border: 1px solid; border-color: rgba(0, 0, 0, 0.12)"
  >
    <NuxtLink
      v-if="$vuetify.breakpoint.mobile"
      to="/"
      class="d-flex align-center"
    >
      <NuxtImg
        src="/images/Luwjistik Logo FA-02.png"
        format="webp"
        height="24"
        preload
      />
    </NuxtLink>

    <v-spacer v-if="$vuetify.breakpoint.smAndDown" />

    <div class="d-flex align-center">
      <v-app-bar-nav-icon
        :class="[!$vuetify.breakpoint.smAndDown ? 'mr-4' : '']"
        @click.stop="$emit('doShowSideNav')"
      >
        <v-icon> {{ setIcon }} </v-icon>
      </v-app-bar-nav-icon>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useContext,
  PropType,
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    mini: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  },
  setup(props) {
    const { $vuetify } = useContext()
    const setIcon = computed(() => {
      return !$vuetify.breakpoint.mobile && !props.mini
        ? 'mdi-backburger'
        : !$vuetify.breakpoint.mobile && props.mini
        ? 'mdi-forwardburger'
        : 'mdi-menu'
    })

    return {
      setIcon,
    }
  },
})
</script>
