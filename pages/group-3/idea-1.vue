<template>
  <section class="pa-4 pa-md-10 py-8">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" class="mb-6">
          <h2 class="pb-8 display-1 font-weight-bold">L-Freight</h2>

          <h4
            class="headline mb-2 font-weight-bold"
            style="cursor: pointer"
            @click="show.lFreight = !show.lFreight"
          >
            What is L-Freight ?
          </h4>

          <v-expand-transition>
            <template v-if="show.lFreight">
              <div>
                <p class="title">
                  The freight module is one of the core modular service. It aims
                  to empower both clients and freight forwarders to use
                  Luwjistik L-freight as the only go-to platform for their
                  operational and business needs by providing enterprise
                  features and functionalities with maximum transparency.
                </p>

                <NuxtImg
                  src="https://slabstatic.com/prod/uploads/7s5gpgkh/posts/images/5Vou-SD_v2r_TIjyk9clU0pp.png"
                  format="webp"
                  preload
                  class="mx-auto d-block mt-6 mb-4"
                  style="width: 100%"
                />

                <NuxtImg
                  src="https://slabstatic.com/prod/uploads/7s5gpgkh/posts/images/jEzef11oAy9ByoUKme4Wwr4v.png"
                  format="webp"
                  preload
                  class="mx-auto d-block"
                  style="width: 100%"
                />
              </div>
            </template>
          </v-expand-transition>
        </v-col>

        <v-col cols="12" class="mb-6">
          <h4
            class="headline mb-4 font-weight-bold"
            style="cursor: pointer"
            @click="show.revenue = !show.revenue"
          >
            Revenue
          </h4>

          <v-expand-transition>
            <template v-if="show.revenue">
              <div class="pl-4">
                <div class="pb-6">
                  <h5 class="headline font-weight-bold mb-2">Commercial</h5>

                  <NuxtImg
                    src="/images/potential.png"
                    format="webp"
                    preload
                    class="mx-auto d-block mb-6"
                    style="width: 100%"
                  />

                  <p class="title">
                    <span class="font-weight-bold">Potential Client</span>
                    <ul>
                      <li>Zalora Express</li>
                      <li>Shopee Express</li>
                      <li>Ecommerce Enabler</li>
                      <li>SME Logistics Provider</li>
                    </ul>
                  </p>

                  <p class="title">
                    <span class="font-weight-bold">Service To Sell</span>
                    <ul>
                      <li>Domestic and Crossborder Door to Port</li>
                      <li>Domestic and Crossborder Port to Port</li>
                    </ul>
                  </p>
                </div>

                <div class="pt-6">
                  <h5 class="headline font-weight-bold mb-2">Product, Platform & Operation</h5>

                  <p class="title">
                    <ul>
                      <li>Bagging <span class="headline primary--text font-weight-bold">#nobaggingnofreight</span></li>
                      <li>
                        <span>
                          Automatic Manifest Generation
                        </span>

                        <NuxtImg
                          src="/images/manifest.png"
                          format="webp"
                          preload
                          class="mx-auto d-block mb-6"
                          style="width: 100%"
                        />
                      </li>

                      <li>Cutting Cost Via Group Buy Concept</li>
                      <li>Documentation</li>
                      <li>Communication</li>
                      <li>
                        <span>Transparency</span>

                        <NuxtImg
                          src="/images/transparency.png"
                          format="webp"
                          preload
                          class="mx-auto d-block mb-6"
                          style="width: 100%"
                        />
                      </li>
                    </ul>
                  </p>


                </div>
              </div>
            </template>
          </v-expand-transition>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const show = ref({
      lFreight: false,
      b2b: false,
      revenue: false,
    })
    const state = { show }

    return {
      ...state,
    }
  },
})
</script>
