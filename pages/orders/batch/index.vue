<template>
  <section class="pa-4 pa-md-10 py-8 batchView">

    <BaseHeadlinePage
      title="Batch Order View"
      subtitle="LUW180123123109"
    />
    <v-row>
      <v-col
        cols="12"
        md="10"
      >
        <v-list>
          <v-list-item
          >
            <v-list-item-title class="font-weight-bold">
              Origin Country
            </v-list-item-title>
            <v-list-item-title class="font-weight-bold">
              Origin Port
            </v-list-item-title>
            <v-list-item-title class="font-weight-bold">
              Destination Country
            </v-list-item-title>
            <v-list-item-title class="font-weight-bold">
              Destination Port
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="font-weight-bold primary--text">
              Indonesia
            </v-list-item-title>
            <v-list-item-title class="font-weight-bold primary--text">
              Jakarta
            </v-list-item-title>
            <v-list-item-title class="font-weight-bold primary--text">
              Malaysia
            </v-list-item-title>
            <v-list-item-title class="font-weight-bold primary--text">
              Kuala Lumpur
            </v-list-item-title>
          </v-list-item>
        </v-list>

      </v-col>
    </v-row>

    <v-chip-group
      v-model="selectedTransferCost"
      active-class="primary accent-4 white--text"
      column
    >
      <v-chip
        v-for="(chip, i) in transferCost"
        :key="i"
        :value="chip.value"
        small
        class="custom-chips"
      >
        {{chip.text}}
      </v-chip>
    </v-chip-group>

    <v-sheet color="transparent" width="100%" class="mx-10">
      <template v-for="({ text, icon }, index) in stepList">
        <v-btn
          :key="text"
          :color="isActive(index) ? 'primary' : 'white'"
          :class="[isActive(index) ? 'white--text' : 'primary--text']"
          class="custom-tab mx-2"
          @click="doChangeWindow(index)"
        >
          <v-icon
            v-if="icon"
            left dark size="28"
          >
            {{ icon }}
          </v-icon>
          {{ text }}
        </v-btn>
      </template>
    </v-sheet>

    <v-card elevation="2">
      <v-window v-model="step">
        <v-window-item :value="0">
          <OrdersBatchViewSummary :step="step" />
        </v-window-item>

        <v-window-item :value="1">
          <OrdersBatchViewDetails :step="step" />
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
  name: 'BatchPage',
  setup() {
    const router = useRouter()

    // manage transfer cost
    const transferCost = ref([
      {
        text: 'Transfer',
        value: 'Transfer',
      },
      {
        text: 'Cost',
        value: 'Cost',
      },
    ])
    const selectedTransferCost = ref(undefined) as string | unknown

    // manage windows
    const step = ref(1)
    const stepList = ref([
      {
        text: 'Summary',
        icon: '',
      },
      {
        text: 'Details',
        icon: '',
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
      transferCost,
      selectedTransferCost
    }
  },
  head: {},
})
</script>

<style lang="scss">

.batchView {
  margin-bottom: 40rem;
  .custom-tab {
    border-top-left-radius: 16px !important;
    border-top-right-radius: 16px !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
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
  .v-list-item {
    min-height: 36px;
    padding: unset;
  }
  .custom-chips {
    color: $primary;
    background: transparent !important;
    border: 1px solid $primary;
    margin: 0px 8px 0px 0;

    &.v-chip--active {
      background: $primary !important;
    }

    &.blue {
      background: $primary !important;
      border: 1px solid $primary !important;
    }
  }
}
</style>
