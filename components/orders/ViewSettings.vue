<template>
  <v-menu bottom offset-y :close-on-content-click="false">
    <template #activator="{ attrs, on }">
      <v-btn
        text
        :disabled="loading"
        color="primary"
        class="white--text mx-0 mx-md-2 mb-4 mb-md-0"
        v-bind="attrs"
        v-on="on"
      >
        View Settings

        <v-icon right> mdi-eye </v-icon>
      </v-btn>
    </template>

    <v-card color="transparent" style="backdrop-filter: blur(8px)">
      <v-row no-gutters class="py-4">
        <v-col cols="12" class="px-4">
          <span class="text--secondary subtitle-2">Only Show : </span>
        </v-col>

        <v-col cols="6">
          <v-list color="transparent">
            <v-list-item>
              <v-checkbox
                v-model="selectedViews"
                on-icon="mdi-checkbox-marked-circle"
                off-icon="mdi-checkbox-blank-circle-outline"
                label="Service Type"
                value="serviceType"
              />
            </v-list-item>

            <v-list-item>
              <v-checkbox
                v-model="selectedViews"
                on-icon="mdi-checkbox-marked-circle"
                off-icon="mdi-checkbox-blank-circle-outline"
                label="Status"
                value="status"
              />
            </v-list-item>

            <v-list-item>
              <v-checkbox
                v-model="selectedViews"
                on-icon="mdi-checkbox-marked-circle"
                off-icon="mdi-checkbox-blank-circle-outline"
                label="Origin"
                value="origin"
              />
            </v-list-item>

            <v-list-item>
              <v-checkbox
                v-model="selectedViews"
                on-icon="mdi-checkbox-marked-circle"
                off-icon="mdi-checkbox-blank-circle-outline"
                label="Origin Port"
                value="originPort"
              />
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="6">
          <v-list color="transparent">
            <v-list-item>
              <v-checkbox
                v-model="selectedViews"
                on-icon="mdi-checkbox-marked-circle"
                off-icon="mdi-checkbox-blank-circle-outline"
                label="Destination"
                value="destination"
              />
            </v-list-item>

            <v-list-item>
              <v-checkbox
                v-model="selectedViews"
                on-icon="mdi-checkbox-marked-circle"
                off-icon="mdi-checkbox-blank-circle-outline"
                label="Destination Port"
                value="destinationPort"
              />
            </v-list-item>

            <v-list-item>
              <v-checkbox
                v-model="selectedViews"
                on-icon="mdi-checkbox-marked-circle"
                off-icon="mdi-checkbox-blank-circle-outline"
                label="Creation Date"
                value="creationDate"
              />
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  useRoute,
} from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    value: {
      type: Array as PropType<string[]>,
      required: true,
    },
    loading: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const route = useRoute()
    const isOnOrdersPages = computed(
      () => !route.value.name?.includes('incoming-orders')
    )
    const selectedViews = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })

    return { selectedViews, isOnOrdersPages }
  },
})
</script>
