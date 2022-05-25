<template>
  <div v-if="allRatings.length === 0" class="text-star-wrapper">
    <!-- for overall -->
    <div>
      <div class="text-star d-flex align-center mb-2">
        <v-col class="mr-3 pl-0">
          <span
            class="primary--text font-weight-regular subtitle-1 font-weight-bold"
          >
            Overall rate
          </span>
        </v-col>

        <v-col class="pr-0">
          <template v-for="icon in 5">
            <v-icon :key="icon" :size="14" class="ml-1"> $rateOutline </v-icon>
          </template>
        </v-col>
      </div>
    </div>
  </div>

  <div v-else class="text-star-wrapper">
    <!-- for overall -->
    <div>
      <template v-for="{ id, status, rating } in overallRates">
        <div
          :key="id"
          class="text-star d-flex align-center mb-2"
          :style="
            lastMileRates.length !== 0 || customRates.length !== 0
              ? 'border-bottom: 4px dotted #1961e4'
              : ''
          "
        >
          <v-col class="mr-3 pl-0">
            <span
              class="primary--text font-weight-regular subtitle-1 font-weight-bold"
            >
              {{ setRateLabel(status) }}
            </span>
          </v-col>

          <v-col class="pr-0">
            <template
              v-for="(icon, indexStar) in setRatingValue({
                value: rating,
                type: status,
              })"
            >
              <v-icon :key="indexStar" :size="16" class="ml-1" color="#ff3d17">
                $rateFill
              </v-icon>
            </template>
          </v-col>
        </div>
      </template>
    </div>

    <!-- for last mile -->
    <div>
      <template v-for="({ id, status, rating }, LMRatesIndex) in lastMileRates">
        <span
          v-if="LMRatesIndex === 0"
          :key="id"
          class="text-center d-block font-weight-bold subtitle-2 mt-3"
        >
          Last Mile
        </span>

        <div
          :key="id"
          class="text-star d-flex align-center mb-2"
          :style="
            LMRatesIndex + 1 === lastMileRates.length &&
            customRates.length !== 0
              ? 'border-bottom: 4px dotted #1961e4'
              : ''
          "
        >
          <v-col class="mr-3 pl-0">
            <span class="primary--text font-weight-regular subtitle-2">
              {{ setRateLabel(status) }}
            </span>
          </v-col>

          <v-col class="pr-0">
            <template
              v-for="(icon, indexStar) in setRatingValue({
                value: rating,
                type: status,
              })"
            >
              <v-icon :key="indexStar" :size="14" class="ml-1">
                $rateFill
              </v-icon>
            </template>
          </v-col>
        </div>
      </template>
    </div>

    <!-- for custom -->
    <div>
      <template
        v-for="({ id, status, rating }, customRatesIndex) in customRates"
      >
        <span
          v-if="customRatesIndex === 0"
          :key="id"
          class="text-center d-block font-weight-bold subtitle-2 mt-3"
        >
          Custom
        </span>

        <div :key="customRatesIndex" class="text-star d-flex align-center mb-2">
          <v-col class="mr-3 pl-0">
            <span class="primary--text font-weight-regular subtitle-2">
              {{ setRateLabel(status) }}
            </span>
          </v-col>

          <v-col class="pr-0">
            <template
              v-for="(icon, indexStar) in setRatingValue({
                value: rating,
                type: status,
              })"
            >
              <v-icon :key="indexStar" :size="14" class="ml-1">
                $rateFill
              </v-icon>
            </template>
          </v-col>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, useStore } from '@nuxtjs/composition-api'
// types
import { VuexModuleMarketplaces } from '~/types/marketplace/marketplace'

export default defineComponent({
  name: 'PartnerRates',
  setup() {
    const storeDetailMarketplace = useStore<VuexModuleMarketplaces>()
    const allRatings = computed(() => {
      const ratings =
        storeDetailMarketplace.state.marketplaces.marketplaces.ratings

      if (!ratings || ratings.length === 0) return []

      return [...ratings]
    })
    const setRateLabel = (status: string) => {
      const formatStatus =
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()

      return formatStatus === 'Overall ratings'
        ? 'Overall'
        : formatStatus.replace('ratings', 'rate')
    }
    const setRatingValue = ({
      value,
      type,
    }: {
      value: number
      type: string
    }): number => {
      let partnerRatingValue = value
      // ratings default
      let ratings = new Map([
        [1, 90],
        [2, 92],
        [3, 94],
        [4, 96],
        [5, 98],
      ])

      // rating for last mile failed
      if (type === 'First Delivery Attempt Success Ratings') {
        ratings = new Map([
          [1, 78],
          [2, 83],
          [3, 88],
          [4, 93],
          [5, 96],
        ])
      }

      for (const [keyMap, valueMap] of ratings.entries()) {
        if (valueMap !== value) {
          continue
        }

        partnerRatingValue = keyMap
      }

      return partnerRatingValue
    }

    // manage overall
    const overallRates = computed(() =>
      [...allRatings.value].filter((rate) => rate.status === 'Overall Ratings')
    )

    // manage last mile
    const lastMileRates = computed(() =>
      [...allRatings.value].filter(
        (rate) =>
          !overallRates.value.some(
            (overallRate) => rate.status === overallRate.status
          ) && rate.status !== 'Clearance Ratings'
      )
    )

    // manage custom
    const customRates = computed(() =>
      [...allRatings.value].filter(
        (rate) =>
          !overallRates.value.some(
            (overallRate) => rate.status === overallRate.status
          ) &&
          !lastMileRates.value.some(
            (lastMileRate) => rate.status === lastMileRate.status
          )
      )
    )

    return {
      allRatings,
      setRateLabel,
      setRatingValue,
      // manage overall
      overallRates,
      // manage last mile
      lastMileRates,
      // manage custom
      customRates,
    }
  },
})
</script>
