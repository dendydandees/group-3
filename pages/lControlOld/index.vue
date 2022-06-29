<template>
  <section class="pa-4 pa-md-10 py-8 marketplace">
    <!-- <ChatPackageAdvancedChatWindow /> -->
    <BaseHeadlinePageCustom title="L-Control" subtitle="Automate your process">
    </BaseHeadlinePageCustom>
    <v-row align="center">
      <v-col>
        <v-btn @click="toggle()"> Add Country </v-btn>
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
    <v-row align="center">
      <v-col cols="12">
        <BaseTableListServer
          v-model="pagination"
          item-key="id"
          :loading="$fetchState.pending"
          :items="lControls"
          :headers="headers"
          :hide-default-footer="true"
          :meta="meta"
          :expanded-option="expandedOption"
          @addRuleModal="addRuleModal"
          @dialogDeleteModal="dialogDeleteModal"
        />
      </v-col>
    </v-row>
    <LcontrolCreateForm
      :dialog="dialog.ruleGroup"
      :error="errorPost.rg"
      @toggle="toggle('ruleGroup')"
      @addRuleGroup="addRuleGroup"
    />
    <LcontrolCreateForm
      :is-rule="true"
      :dialog="dialog.rule"
      :country-code="countryCode"
      :service="service"
      @toggle="toggle('rule')"
      @addRules="addRules"
    />
    <BaseModalConfirm
      v-model="dialog.deleteRule"
      :dialog-settings="dialogSettings"
      @doSubmit="deleteRules"
    />
    <BaseModalConfirm
      v-model="dialog.deleteRuleGroup"
      :dialog-settings="dialogSettings"
      @doSubmit="deleteRuleGroups"
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
  ref,
  Ref,
} from '@nuxtjs/composition-api'
// Interfaces or types
import { VuexModuleLControls } from '~/types/lControl/lControl'
import { VuexModuleApplications, ModalConfirm } from '~/types/applications'

export default defineComponent({
  name: 'LControl',
  layout: 'default',
  setup() {
    // store manage
    // const storeMarketplaces = useStore<VuexModuleMarketplaces>()
    const storeLControls = useStore<VuexModuleLControls>()
    const storeApplications = useStore<VuexModuleApplications>()
    // const marketplaces = computed(
    //   () => storeMarketplaces.state.marketplaces.marketplaces.marketplaces
    // )
    const lControls = computed(
      () => (storeLControls.state.lControls.lControls as any).lControls
    )
    const meta = computed(
      () => (storeLControls.state.lControls.lControls as any).meta
    )
    const pagination = ref({
      ...storeApplications.state.applications.pagination,
    })
    const expandedOption = ref({
      singleExpand: true,
      showExpand: true,
    })
    const errorPost = ref({
      rg: '',
    })
    const service = ref('')
    const countryCode = ref('')
    const ruleGroupID = ref('')
    const ruleID = ref('')

    const headers = reactive([
      {
        text: 'Country',
        value: 'countryCode',
        sortable: false,
      },
      {
        text: 'Default Partner',
        value: 'defaultPartner',
        sortable: false,
      },
      {
        text: '',
        value: 'actionsLControl',
        sortable: false,
      },
      {
        text: '',
        value: 'data-table-expand',
        sortable: false,
      },
    ])

    const method = reactive({
      opt: 'add',
    })
    const dialog = reactive({
      ruleGroup: false,
      rule: false,
      deleteRule: false,
      deleteRuleGroup: false,
    })
    const dialogSettings = ref({
      loading: false,
      title: 'Are you sure you want to delete this rule?',
      content: '',
      cancelText: 'No',
      submitText: 'Yes',
      submitColor: 'red white--text',
    }) as Ref<ModalConfirm>

    const toggle = (key: string) => {
      if (method.opt === 'add' || method.opt === 'edit') {
        switch (key) {
          case 'rule':
            dialog.rule = !dialog.rule
            break
          default:
            dialog.ruleGroup = !dialog.ruleGroup
            break
        }
      }
    }
    const addPartner = () => {
      toggle('ruleGroup')
    }

    const addRuleModal = (data: any) => {
      service.value = data.serviceType
      countryCode.value = data.countryCode
      ruleGroupID.value = data.id
      toggle('rule')
    }

    const dialogDeleteModal = (data: { id: string; name: string }) => {
      switch (data.name) {
        case 'rule':
          dialog.deleteRule = true
          ruleID.value = data.id
          break

        default:
          dialog.deleteRuleGroup = true
          ruleGroupID.value = data.id
          dialogSettings.value.title =
            'Are you sure you want to delete this rule group?'
          break
      }
    }

    const fetchRuleGroups = async () => {
      try {
        $fetchState.pending = true

        await storeLControls.dispatch('lControls/lControls/getLControls', {
          params: {},
        })
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }
    const addRules = async (data: any) => {
      try {
        const id = ruleGroupID.value
        if (data.definitions) {
          data.definitions = data.definitions.map((el: any) => {
            delete el.id
            return el
          })
        }
        const payload = {
          id,
          data,
        }

        $fetchState.pending = true

        await storeLControls.dispatch('lControls/lControls/addRules', payload)
        dialog.ruleGroup = false
        fetch()
      } catch (error) {
        return error
      } finally {
        toggle('rule')
        $fetchState.pending = false
      }
    }
    const deleteRules = async () => {
      try {
        dialogSettings.value.loading = true

        $fetchState.pending = true

        await storeLControls.dispatch('lControls/lControls/deleteRules', {
          ruleID: ruleID.value,
        })
        fetch()
      } catch (error) {
        return error
      } finally {
        dialogSettings.value.loading = false
        dialog.deleteRule = false
        $fetchState.pending = false
      }
    }

    const deleteRuleGroups = async () => {
      try {
        dialogSettings.value.loading = true

        $fetchState.pending = true

        await storeLControls.dispatch(
          'lControls/lControls/deleteRuleGroups',
          ruleGroupID.value
        )
        fetch()
      } catch (error) {
        return error
      } finally {
        dialogSettings.value.loading = false
        dialog.deleteRuleGroup = false
        $fetchState.pending = false
      }
    }

    const addRuleGroup = async (payload: {
      defaultPartnerID: string
      serviceType: string
      countryCode: string
      useBOB: boolean
    }) => {
      try {
        const { defaultPartnerID, serviceType, countryCode, useBOB } = payload
        const data = {
          defaultPartnerID: useBOB ? '' : defaultPartnerID,
          serviceType,
          countryCode,
          useBOB,
        }

        $fetchState.pending = true

        const res = await storeLControls.dispatch(
          'lControls/lControls/addRuleGroup',
          data
        )
        if (res?.response?.data?.error) {
          throw res?.response?.data?.error
        }
        dialog.ruleGroup = false
        fetch()
      } catch (error: any) {
        if (error) {
          errorPost.value.rg = error
        }
        return error
      } finally {
        setTimeout(() => {
          errorPost.value.rg = ''
        }, 7500)
        $fetchState.pending = false
      }
    }

    const { $fetchState, fetch } = useFetch(async () => {
      await fetchRuleGroups()
    })
    // watch(
    //   () => [dialog.ruleGroup, dialog.rule],
    //   ([newDialogRG, newDialogR]) => {
    //     console.log({newDialogRG})
    //   },
    //   { deep: true }
    // )

    return {
      dialog,
      dialogSettings,
      method,
      toggle,
      addPartner,
      addRuleGroup,
      lControls,
      addRules,
      addRuleModal,
      deleteRules,
      headers,
      meta,
      pagination,
      expandedOption,
      dialogDeleteModal,
      deleteRuleGroups,
      errorPost,
      countryCode,
      service,
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
      background: #2196f3;
      .opacity-custom {
        opacity: 1;
      }
    }
    .opacity-custom {
      opacity: 0.7;
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
        border-color: #2196f3;
      }
    }
    .v-text-field__details {
      display: none;
    }
  }

  .custom-chips {
    color: #2196f3;
    background: transparent !important;
    border: 1px solid #2196f3;
  }
}
.card-chip-group {
  .v-slide-group__next,
  .v-slide-group__prev {
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
  .v-slide-group__prev--disabled,
  .v-slide-group__next--disabled {
    display: none;
  }
}
</style>
