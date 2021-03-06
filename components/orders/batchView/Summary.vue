<template>
  <article class="details-tab pa-8">
    <v-row>
      <v-col cols="12" md="6">
        <OrdersBatchViewTable :data-table="dataTable" :is-service="true" />
      </v-col>

      <v-divider vertical :style="'border-right: 1px dashed red'" />

      <v-col cols="12" md="6">
        <OrdersBatchViewTable :data-table="dataTable2" />
      </v-col>
    </v-row>
  </article>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useStore,
  onMounted,
  PropType,
} from '@nuxtjs/composition-api'

// interfaces and types
import { VuexModuleApplications } from '~/types/applications'

export interface Select {
  country: string
}

export interface ParseNodeCalc {
  orderCode: String
  id: String
  fmCost: Number
  lmCost: Number
  ccCost: Number
  bobCost: Number
  codCost: Number
  total: Number
  dnt: Number
  adminFee: Number
  currency: String
}

export default defineComponent({
  name: 'SummaryTab',
  props: {
    step: {
      type: Number,
      required: true,
    },
    nodeCalculators: {
      type: Array as PropType<ParseNodeCalc[]>,
      required: true,
    },
  },
  setup(props) {
    // manage store
    const storeApplications = useStore<VuexModuleApplications>()
    const parseService = computed(() => {
      return [
        {
          name: 'First Mile',
          value: setTotal('fmCost'),
          currency:
            props.nodeCalculators[0] && props.nodeCalculators[0].currency
              ? props.nodeCalculators[0].currency
              : '',
        },
        {
          name: 'Last Mile',
          value: setTotal('lmCost'),
          currency:
            props.nodeCalculators[0] && props.nodeCalculators[0].currency
              ? props.nodeCalculators[0].currency
              : '',
        },
        {
          name: 'Customs',
          value: setTotal('ccCost'),
          currency:
            props.nodeCalculators[0] && props.nodeCalculators[0].currency
              ? props.nodeCalculators[0].currency
              : '',
        },
        {
          name: 'BOB',
          value: setTotal('bobCost'),
          currency:
            props.nodeCalculators[0] && props.nodeCalculators[0].currency
              ? props.nodeCalculators[0].currency
              : '',
        },
        {
          name: 'COD',
          value: setTotal('codCost'),
          currency:
            props.nodeCalculators[0] && props.nodeCalculators[0].currency
              ? props.nodeCalculators[0].currency
              : '',
        },
      ]
    })
    const parseCustom = computed(() => {
      return [
        {
          name: 'D&T',
          value: setTotal('dnt'),
          currency:
            props.nodeCalculators[0] && props.nodeCalculators[0].currency
              ? props.nodeCalculators[0].currency
              : '',
        },
        {
          name: 'Transmission Fee',
          value: setTotal('adminFee'),
          currency:
            props.nodeCalculators[0] && props.nodeCalculators[0].currency
              ? props.nodeCalculators[0].currency
              : '',
        },
      ]
    })

    // manage summary table

    const dataTable = ref({
      content: parseService.value,
      headers: [
        {
          text: 'Services',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: '', value: 'value' },
      ],
    })

    const dataTable2 = ref({
      content: parseCustom.value,
      headers: [
        {
          text: 'Customs',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: '', value: 'value' },
      ],
    })

    onMounted(() => {
      storeApplications.commit('applications/RESET_ALERT')
    })

    const showBorder = (item: any) => {
      if (item === 'iron') {
        // return {borderRight:'1px dashed red'}
        return 'border-right: 1px dashed red'
      }
      if (item === 'name') {
        // return {color:'#1961e4', fontWeight: 700}
        return 'color: #1961e4; font-weight: 700'
      }
    }
    function setTotal(key: string) {
      return props.nodeCalculators.reduce(function (
        a: Number | unknown,
        b: any
      ) {
        return a + b[key]
      },
      0)
    }

    return {
      dataTable,
      dataTable2,
      showBorder,
    }
  },
})
</script>

<style lang="scss">
@import '~/assets/scss/color.module.scss';
.details-tab {
  thead th:nth-child(6) {
    border-right: 1px dashed red;
  }
}
</style>
