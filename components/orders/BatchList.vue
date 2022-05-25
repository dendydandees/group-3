<template>
  <v-col cols="12">
    <v-card
      v-for="batch in batchOrders"
      :key="batch.id"
      elevation="2"
      class="my-4"
    >
      <v-card-text>
        <v-col cols="12">
          <h2 class="title font-weight-bold primary--text">{{ batch.code }}</h2>
        </v-col>

        <v-col cols="12">
          <v-row>
            <v-col cols="12" md="4">
              <span class="d-block"> Last Updated </span>

              <span class="d-block">
                {{ $dateFns.format(batch.updatedAt, 'MMM dd, yyyy HH:mm') }}
              </span>
            </v-col>

            <v-col cols="12" md="4">
              <span class="d-block"> Created </span>

              <span class="d-block">
                {{ $dateFns.format(batch.createdAt, 'MMM dd, yyyy HH:mm') }}
              </span>
            </v-col>

            <v-col cols="12" md="4">
              <span class="d-block"> Number of Orders </span>

              <span class="d-block"> {{ batch.totalOrder }} </span>
            </v-col>
          </v-row>
        </v-col>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn color="primary" @click="$emit('doGetBatchDetails', batch)">
          View Details
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, useStore, computed } from '@nuxtjs/composition-api'
import { VuexModuleOrders } from '~/types/orders'

export default defineComponent({
  setup() {
    const storeOrders = useStore<VuexModuleOrders>()
    const batchOrders = computed(() => storeOrders.state.orders.batchOrders)

    return {
      batchOrders,
    }
  },
})
</script>
