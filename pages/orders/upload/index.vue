<template>
  <section class="pa-4 pa-md-10 py-8 custom-margin">
    <NuxtImg
      src="/images/upload-orders/bg_luwjistik.png"
      format="webp"
      preload
      class="custom-bg"
    />

    <BaseBackButton @doBackTo="doBackTo" />

    <BaseHeadlinePage
      title="Upload Orders"
      subtitle="Upload the new order according to the sample file provided."
    />

    <v-sheet color="transparent" width="100%" class="mx-10">
      <v-btn
        :color="step === 1 ? 'white' : 'primary'"
        class="custom-tab primary--text"
      >
        <v-icon left dark size="32"> $freight </v-icon>
        Cross border
      </v-btn>
    </v-sheet>

    <v-card elevation="2">
      <v-window v-model="step">
        <v-window-item :value="1">
          <OrdersUploadCrossBorder />
        </v-window-item>
      </v-window>
    </v-card>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  useMeta,
  useRouter,
  ref,
} from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'UploadOrdersPages',
  setup() {
    useMeta({ titleTemplate: '%s | Upload Orders' })

    const router = useRouter()

    const step = ref(1)

    const doBackTo = () => {
      router.go(-1)
    }

    return {
      step,
      doBackTo,
    }
  },
  head: {},
})
</script>

<style scoped>
.custom-tab {
  border-top-left-radius: 16px !important;
  border-top-right-radius: 16px !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.custom-margin {
  margin-bottom: 40rem;
}

.custom-bg {
  position: absolute;
  bottom: 500px;
  margin-left: -100px;
}

@media only screen and (min-width: 1024px) {
  .custom-bg {
    bottom: 300px;
    width: 100vw;
    margin-left: -100px;
  }
}
</style>
