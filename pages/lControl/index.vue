<template>
  <section class="pa-4 pa-md-10 py-8 marketplace">
    <BaseHeadlinePageCustom
      title="L-Control"
      subtitle="Find and connect with our best vendors"
    >
    </BaseHeadlinePageCustom>
    <v-row align="center">
      <v-col cols="12" md="7">
        <!-- Search filter field -->
        <BaseSearchFieldCustom
          v-model="filter.search"
          :filter="showFilter"
        />
      </v-col>
      <v-col>
        <v-btn
          @click="toggle()"
        >
          tes
        </v-btn>
      </v-col>
    </v-row>
    <LcontrolCreateForm
      :dialog="dialog"
      @toggle="toggle()"
    />
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useFetch,
  useStore,
  reactive,
  watch,
  ref,
  useMeta,
  useRouter,
} from '@nuxtjs/composition-api'
// Interfaces or types
import { Marketplace, VuexModuleMarketplaces,FilterDetails, PartnerServiceZone } from '~/types/marketplace'
import { VuexModuleApplications } from '~/types/applications'


export default defineComponent({
  name: 'LControl',
  layout: 'default',
  setup() {
    // store manage
    const filter = reactive({
      search: ''
    })
    const showFilter = reactive({
      status: false
    })
    const filterIcon = reactive({
      active: 'mdi-view-stream',
      passive: 'mdi-view-stream-outline'
    })
    const method = reactive({
      opt: 'add'
    })
    const dialog = reactive({
      status: false
    })
    const toggle = () => {
      if (method.opt === 'add' || method.opt === 'edit') {
        dialog.status = !dialog.status
      }
    }
    const addPartner = () => {
      toggle()
    }

    return {
      filter,
      dialog,
      method,
      toggle,
      addPartner,
      showFilter,
      filterIcon,
    }
  },
  head: {},
})
</script>

<style lang="scss">
  .marketplace {
    .carousel-3d-slide {
      border: unset;
      border-radius: 20px;
      /* padding: 20px; */
      background: #48a3ee;
      color: white;
      box-shadow: 0px 0px 40px 0px #36363626;
      &.current {
        background: #2196F3;
        .opacity-custom {
          opacity: 1;
        }
      }
      .opacity-custom {
        opacity: .7;
      }
    }
    .custom-select {
      .v-select__slot {
        label {
          font-size: 12px;
          color: red;
          font-weight: bold;
        }
      }
      .v-input__slot {
        margin-bottom: unset !important;
        /* outline: 1px solid #2196F3; */
        fieldset {
          border-color: #2196F3;
        }
      }
      .v-text-field__details {
        display: none;
      }
    }

    .custom-chips {
      color: #2196F3;
      background: transparent !important;
      border: 1px solid #2196F3;
    }
  }
  .card-chip-group {
    .v-slide-group__next, .v-slide-group__prev {
      min-width: unset;
      flex: unset;
      i {
        color: rgba(255, 255, 255, 0.534);
        font-size: 18px;
      }
    }

    .v-chip--disabled {
      opacity: 1;
    }
    .v-slide-group__prev--disabled, .v-slide-group__next--disabled {
      display: none;
    }
  }
</style>
