<template>
  <article class="details-tab pa-8">
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <OrdersBatchViewTable
          :data-table="dataTable"
          :is-service="true"
        />
      </v-col>
      <v-divider
        vertical
        :style="'border-right: 1px dashed red'"
      />
      <v-col
        cols="12"
        md="6"
      >
        <OrdersBatchViewTable
          :data-table="dataTable2"
        />
      </v-col>
    </v-row>
  </article>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  Ref,
  useStore,
  useRouter,
  onMounted,
  watch,
  PropType
} from '@nuxtjs/composition-api'
import { ValidationObserver } from 'vee-validate'

// interfaces and types
import { VForm, VuexModuleApplications } from '~/types/applications'
import {
  OrderCrossBorder,
  OrderDomestic,
  VuexModuleOrders,
} from '~/types/orders'

export interface Select {
  country: string
}

interface ErrorUpload {
  data: {
    error: string
    ErrorDetails: { field: string; reason: string; note: string }[]
  }
}

export interface ParseNodeCalc {
  orderCode: String
  "id": String
  "fmCost": Number
  "lmCost": Number
  "ccCost": Number
  "bobCost": Number
  "codCost": Number
  "total": Number
  "dnt": Number
  "adminFee": Number
  "currency": String
}

export default defineComponent({
  name: 'DetailsTab',
  components: {
    ValidationObserver,
  },
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
    const router = useRouter()

    // manage store
    const storeApplications = useStore<VuexModuleApplications>()
    const storeOfOrders = useStore<VuexModuleOrders>()
    const alert = computed(() => storeApplications.state.applications.alert)
    const parseService = computed(() => {
      const temp =[
        {
          name: 'First Mile',
          value: setTotal('fmCost')
        },
        {
          name: 'Customs',
          value: setTotal('ccCost')
        },
        {
          name: 'BOB',
          value: setTotal('bobCost')
        },
        {
          name: 'COD',
          value: setTotal('codCost')
        },
      ]
      return temp
    })
    const parseCustom = computed(() => {
      const temp =[
        {
          name: 'D&T',
          value: setTotal('dnt')
        },
        {
          name: 'Admin Fee',
          value: setTotal('adminFee')
        },
      ]
      return temp
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
      if (item === "iron") {

        // return {borderRight:'1px dashed red'}
        return 'border-right: 1px dashed red'
      }
      if(item === 'name') {
        // return {color:'#1961e4', fontWeight: 700}
        return 'color: #1961e4; font-weight: 700'
      }

    }
    function setTotal(key: string) {
      return props.nodeCalculators.reduce( function(a: Number | unknown, b: any){
          return a + b[key];
        }, 0)

    }

    return {
      dataTable,
      dataTable2,
      showBorder
    }
  },
})
</script>

<style lang="scss">
@import '~/assets/scss/color.module.scss';
  .details-tab {
    thead th:nth-child(6) {
      border-right: 1px dashed red
    }

  }
</style>
