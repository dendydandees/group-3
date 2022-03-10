<template>
  <section class="pa-4 pa-md-10 py-8 marketplace">
    <BaseHeadlinePageCustom
      title="L-Control"
      subtitle="Find and connect with our best vendors"
    >
    </BaseHeadlinePageCustom>
    <v-row align="center">
      <v-col>
        <v-btn
          @click="toggle()"
        >
          Add Country
        </v-btn>
      </v-col>
    </v-row>
    <!-- <v-row>
      {{JSON.stringify(lControls)}}
      <v-col>
        <v-btn
          @click="addRules()"
        >
          Add rules
        </v-btn>
      </v-col>
    </v-row> -->
    <LcontrolCreateForm
      :dialog="dialog.status"
      @toggle="toggle()"
      @addRuleGroup="addRuleGroup"
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
import { VuexModuleLControls,Definition,Rule,RuleGroup } from '~/types/lControl/lControl'
import { VuexModuleApplications } from '~/types/applications'


export default defineComponent({
  name: 'LControl',
  layout: 'default',
  setup() {
    // store manage
    const storeLControls = useStore<VuexModuleLControls>()
    const storeApplications = useStore<VuexModuleApplications>()
    const lControls = computed(() => storeLControls.state.lControls.lControls.lControls)
    const meta = computed(() => storeLControls.state.lControls.lControls.meta)

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


    const fetchRuleGroups = async () => {
      try {
        $fetchState.pending = true

        await storeLControls.dispatch('lControls/lControls/getLControls', {params: {} })
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const addRules = async () => {
      try {
        const payload = {
          id: "b4a95b88-77c8-4c32-a4a4-e2009ef55d07",
          data: {
            "partnerID": "6abf8aa4-f1ed-4bc1-8990-2707f287d778",
            "priority": 1,
            "definitions": [
                {
                    "type": "RULE_TYPE_ZONE",
                    "value": "KL"
                }
            ]
          }
        }

        $fetchState.pending = true

        await storeLControls.dispatch('lControls/lControls/addRules', payload)
        dialog.status = false
        fetch()
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const deleteRules  = async () => {
      try {
        const payload = {
          id: "b4a95b88-77c8-4c32-a4a4-e2009ef55d07",
          ruleId: "bd8e67aa-3f02-4c08-8ceb-716a9b38aafe"
        }

        $fetchState.pending = true

        await storeLControls.dispatch('lControls/lControls/deleteRules', payload)
        dialog.status = false
        fetch()
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }

    const addRuleGroup = async (
      payload: {
        defaultPartnerID: string,
        serviceType: string,
        countryCode: string,
    }) => {
      try {
        const {defaultPartnerID, serviceType, countryCode} = payload
        const data = {
          defaultPartnerID,
          serviceType,
          countryCode
        }

        $fetchState.pending = true

        await storeLControls.dispatch('lControls/lControls/addRuleGroup', data)
        dialog.status = false
        fetch()
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }


    const { $fetchState, fetch } = useFetch(async () => {
      await fetchRuleGroups()
    })
    watch(
      dialog,
      (newDialog) => {
      },
      { deep: true }
    )

    return {
      dialog,
      method,
      toggle,
      addPartner,
      addRuleGroup,
      lControls,
      addRules,
      deleteRules
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
