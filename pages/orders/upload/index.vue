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
      <template v-for="({ text, icon }, index) in stepList">
        <v-btn
          :key="text"
          :color="isActive(index) ? 'white' : 'primary'"
          :class="[isActive(index) ? 'primary--text' : 'white--text']"
          class="custom-tab"
          @click="doChangeWindow(index)"
        >
          <v-icon left dark size="28"> {{ icon }} </v-icon>
          {{ text }}
        </v-btn>
      </template>
    </v-sheet>

    <v-card elevation="2">
      <v-window v-model="step">
        <v-window-item :value="0">
          <OrdersUploadForm :step="step" />
        </v-window-item>

        <v-window-item :value="1">
          <OrdersUploadForm :step="step" />
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
  computed,
} from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'UploadOrdersPages',
  setup() {
    const router = useRouter()

    // manage windows
    const step = ref(10)
    const stepList = ref([
      {
        text: 'Domestic',
        icon: '$domestic',
      },
      {
        text: 'Cross border',
        icon: '$freight',
      },
    ])
    const isActive = (data: number) => step.value === data
    const doChangeWindow = (data: number) => {
      step.value = data
    }
    // manage title
    const currentTitle = computed(() =>
      step.value === 0 ? 'Domestic' : 'Cross Border'
    )
    useMeta(() => ({
      title: `Client Portal | Upload ${currentTitle.value} Orders`,
    }))

    const doBackTo = () => {
      router.go(-1)
    }

    return {
      step,
      stepList,
      isActive,
      doChangeWindow,
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
