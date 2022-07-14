<template>
  <section class="pa-4 pa-md-10 py-8">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" class="mb-6">
          <h2 class="pb-8 display-1 font-weight-bold">
            <span class="primary--text">Engage</span>
            Small Network Partners
          </h2>

          <h4
            class="headline mb-2 font-weight-bold"
            style="cursor: pointer"
            @click="show.engage = !show.engage"
          >
            Current Situation
          </h4>

          <v-expand-transition>
            <template v-if="show.engage">
              <div class="pl-4">
                <p class="title">
                  <span class="font-weight-bold">Big Network Partners</span>
                  <ul>
                    <li>JNT</li>
                    <li>Ninja Van</li>
                  </ul>
                </p>

                <p class="title">
                    <span class="font-weight-bold">Advantages</span>
                    <ul>
                      <li>Known brand name to clients</li>
                    </ul>
                  </p>

                <p class="title">
                    <span class="font-weight-bold">Disadvantages</span>
                    <ul>
                      <li>We give small volume so less resources allocated to Luwjistik</li>
                      <li>Big NPs have their own systems, unlikely to log in to our portal to handle CS issues, status updates, etc</li>
                    </ul>
                  </p>
              </div>
            </template>
          </v-expand-transition>
        </v-col>

        <v-col cols="12" class="mb-6">
          <h4
            class="headline mb-2 font-weight-bold"
            style="cursor: pointer"
            @click="show.proposal = !show.proposal"
          >
            Proposal
          </h4>

          <v-expand-transition>
            <template v-if="show.proposal">
              <div class="pl-4">
                <p class="title">
                    <span class="font-weight-bold">Explore engaging small NPs</span>
                    <ul>
                      <li>Help to promote smaller NPs on our platform. Give them a brand, give them a voice</li>
                      <li>We identify top local heroes using data & analytics</li>
                    </ul>
                  </p>

                <p class="title">
                    <span class="font-weight-bold">Advantages</span>
                    <ul>
                      <li>Client have much more options (A lot of small NPs to choose from rather than few big NPs)</li>
                      <li>NP can allocate more resource to us to resolve issues (Better CS)</li>
                      <li>Lower Cost (Better rates)</li>
                      <li>Small NPs do not have their own systems so easier to onboard onto Luwjistik system</li>
                    </ul>
                  </p>

                <p class="title">
                    <span class="font-weight-bold">Disadvantages</span>
                    <ul>
                      <li>Term of payment is much shorter (Eg. 14 days for small NP compared to 30 days for big NP)</li>
                      <li>Lack of manpower (We cannot give them too high volume, or if we are going to give them higher volume we need to inform in advance)</li>
                    </ul>
                  </p>
              </div>
            </template>
          </v-expand-transition>
        </v-col>

        <v-col cols="12" class="mb-6">
          <h4
            class="headline mb-2 font-weight-bold"
            style="cursor: pointer"
            @click="show.revenue = !show.revenue"
          >
            Improvement
          </h4>

          <v-expand-transition>
            <template v-if="show.revenue">
              <div class="pl-4">
                <p class="title">
                    <span class="font-weight-bold">SLA</span>
                    <ul>
                      <li>Average Lead Time</li>
                    </ul>
                  </p>

                <p class="title">
                    <span class="font-weight-bold">Rates</span>
                    <ul>
                      <li>Comparision</li>
                      <li>Range Calculation</li>
                    </ul>
                  </p>

                <p class="title">
                    <span class="font-weight-bold">Customer Service</span>
                    <ul>
                      <li>Average Response Time</li>
                      <li>Average Daily First Chat Interval Per Client</li>
                      <li>Status Quality</li>
                    </ul>
                  </p>
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
      engage: false,
      proposal: false,
      revenue: false
    })
    const state = { show }

    return {
      ...state,
    }
  },
})
</script>
