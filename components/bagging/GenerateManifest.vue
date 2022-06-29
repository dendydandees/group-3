<template>
  <v-dialog
    v-model="mawbInput.manifest"
    max-width="650"
    @click:outside="toggle()"
  >
    <v-card
      class="mawbCustom"
    >
      <v-card-title class="text-h5 pt-6 d-flex justify-start">
        {{ dialogSettings.title }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text
        class="mt-4"
      >
        <v-row>
          <v-col cols="12" md="12" class="px-2 py-4">
            <v-text-field
              v-model="mawbInput.mawb"
              clearable
              outlined
              dense
              rounded
              hide-details
              label="MAWB No"
              placeholder="Enter your MAWB..."
              background-color="white"
              type="search"
              class="input-filter"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-divider></v-divider>
        </v-row>
        <div
          v-for="(x, i) in 4"
          :key="i"
        >
          <v-row>
            <v-col cols="12" md="12" :class="`${i === 0 ? 'mt-4' : ''} pb-0`">
              <div>
                <span  class="font-weight-bold">Bag ID:</span>
                tes
              </div>
            </v-col>
          </v-row>
          <v-row
          >
            <v-col cols="12" md="3" class="px-2">
              <v-text-field
                v-model="mawbInput.mawb"
                clearable
                outlined
                dense
                rounded
                hide-details
                label="Length"
                placeholder="Length..."
                background-color="white"
                type="search"
                class="input-filter"
                append-icon="cm"
              />
            </v-col>
            <v-col cols="12" md="3" class="px-2">
              <v-text-field
                v-model="mawbInput.mawb"
                clearable
                outlined
                dense
                rounded
                hide-details
                label="Width"
                placeholder="Width..."
                background-color="white"
                type="search"
                class="input-filter"
                append-icon="cm"
              />
            </v-col>
            <v-col cols="12" md="3" class="px-2">
              <v-text-field
                v-model="mawbInput.mawb"
                clearable
                outlined
                dense
                rounded
                hide-details
                label="Height"
                placeholder="Height..."
                background-color="white"
                type="search"
                class="input-filter"
                append-icon="cm"
              />
            </v-col>
            <v-col cols="12" md="3" class="px-2">
              <v-text-field
                v-model="mawbInput.mawb"
                clearable
                outlined
                dense
                rounded
                hide-details
                label="Weight"
                placeholder="Weight..."
                background-color="white"
                type="search"
                class="input-filter"
                append-icon="kg"
              />
            </v-col>
          </v-row>

        </div>
      </v-card-text>
      <div>
        <v-divider></v-divider>
      </div>

      <v-card-actions class="px-6 pb-6 d-flex justify-center mt-3" >
        <v-col
          cols="6"
          class="pa-0 mx-2"
        >
          <v-btn
            v-if="dialogSettings.cancelText"
            outlined
            :loading="dialogSettings.loading"
            :disabled="dialogSettings.loading"
            color="primary"
            class="mx-2"
            width="100%"
            @click="doClose"
          >
            {{ dialogSettings.cancelText }}
          </v-btn>

        </v-col>
        <v-col
          cols="6"
          class="pa-0 mx-2"
        >
          <v-btn
            :loading="dialogSettings.loading"
            :disabled="dialogSettings.loading"
            :color="dialogSettings.submitColor"
            width="100%"
            @click="$emit('doSubmit')"
          >
            {{ dialogSettings.submitText }}
          </v-btn>

        </v-col>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@nuxtjs/composition-api'
// Interfaces and types
import { ModalConfirm } from '~/types/applications'
import { InputManifest} from '~/types/bagging/bagging'

export default defineComponent({
  props: {
    value: {
      type: Object as PropType<InputManifest>,
      required: true,
    },
    dialogSettings: {
      type: Object as PropType<ModalConfirm>,
      required: true,
    },
    isConfirm:{
      type: Boolean as PropType<boolean>,
      default: false,
    }
  },
  setup(props, { emit }) {
    const mawbInput = computed({
      get: () => props.value,
      set: (value: InputManifest) => emit('input', value),
    })
    const doClose = () => {
      if(props.isConfirm) {
        emit('doCancel')
      }
      mawbInput.value.manifest = false
    }
    const toggle = () => {
      mawbInput.value.manifest = !mawbInput.value.manifest
    }

    return {
      mawbInput,
      doClose,
      toggle
    }
  },
})
</script>
<style lang="scss">
.mawbCustom {
  .v-input__icon--append{
    .v-icon {
      font-size: 12px !important;
    }
  }
  .v-text-field__slot {
    label {
      font-size: 12px;
    }
  }
}
</style>
