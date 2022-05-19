<template>
  <article class="summary-tab pa-8">
    <v-data-table
      hide-default-footer
      :headers="headersComp"
      :items="nodeCalculators"
      item-key="orderCode"
      :items-per-page="1000000"
      :search="dataTable.search"
      disable-sort
    >
      <!-- <template #item.orderCode="{ item }">
        <div
          class="primary--text font-weight-bold"
        >
          {{item.orderCode}}
        </div>
      </template>
      <template #[`item.fmCost`]="{ item }">
        {{ item.currency }} {{ setPrice(item.fmCost) }}
      </template>
      <template #[`item.ccCost`]="{ item }">
        {{ item.currency }} {{ setPrice(item.ccCost) }}
      </template>
      <template #[`item.lmCost`]="{ item }">
        {{ item.currency }} {{ setPrice(item.lmCost) }}
      </template>
      <template #[`item.bobCost`]="{ item }">
        {{ item.currency }} {{ setPrice(item.bobCost) }}
      </template>
      <template #[`item.codCost`]="{ item }">
        {{ item.currency }} {{ setPrice(item.codCost) }}
      </template>
      <template #[`item.total`]="{ item }">
        {{ item.currency }} {{ setPrice(item.total) }}
      </template>
      <template #[`item.dnt`]="{ item }">
        {{ item.currency }} {{ setPrice(item.dnt) }}
      </template>
      <template #[`item.adminFee`]="{ item }">
        {{ item.currency }} {{ setPrice(item.adminFee) }}
      </template> -->
      <template #body="{items, headers}">
        <tr
          v-for="(x, i) in items"
          :key="i"
        >
          <td
            v-for="(y, index) in headers"
            :key="index"
            :class="
              (y.value === 'orderCode' &&'primary--text font-weight-bold') + ' td-custom'
            "
            :style="
              y.value === 'total' && {borderRight:'1px dashed red'}
            "
          >
            {{x[y.value]}}
          </td>
        </tr>
        <tr
          v-if="items && items.length > 0"
        >
          <td
            v-for="(x, i) in headers"
            :key="i"
            :style="
              x.value === 'total' && {borderRight:'1px dashed red'}
            "
            class="td-custom"
          >
            <span
              v-if="x.value === 'orderCode' "
            >

            </span>
            <span
              v-else
              :class="
                x.value === 'total' || x.value === 'dnt'
                ? 'error--text font-weight-bold'
                : ''
              "
            >
              {{setTotal(x.value)}}
            </span>
          </td>
        </tr>
        <tr
          v-else
        >
          <td
            :colspan="headers.length"
            class="font-weight-bold grey--text td-custom"
            :style="'text-align: center'"
          >
            No Data

          </td>
        </tr>
      </template>
      <!-- <template #body.append="{headers}">
        <tr>
          <td
            v-for="(x, i) in headers"
            :key="i"
            :style="
              x.value === 'total' && {borderRight:'1px dashed red'}
            "
          >
            <span
              v-if="x.value === 'orderCode' "
            >

            </span>
            <span
              v-else
              :class="
                x.value === 'total' || x.value === 'dnt'
                ? 'error--text font-weight-bold'
                : ''
              "
            >
              {{setTotal(x.value)}}
            </span>
          </td>
        </tr>
      </template> -->
    </v-data-table>
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
  NodeCalculator,
  Order,
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
  name: 'SummaryTab',
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
    const alert = computed(() => storeApplications.state.applications.alert)
    const headersComp = computed(() => {
      let objKeysComp = [] as String[]
      if(props.nodeCalculators[0]) objKeysComp = Object.keys(props.nodeCalculators[0])

        let headerTemp = [] as any

        objKeysComp.forEach((x: any) => {
          switch (x) {
            case 'orderCode':
              headerTemp.push(
                {
                  text: 'ORDER ID',
                  align: 'start',
                  sortable: false,
                  value: 'orderCode',
                }
              )
              break;
            case 'fmCost':
              if(setTotal(x, true)) {
                headerTemp.push(
                  {
                    text: 'First Mile',
                    value: 'fmCost',
                  }
                )
              }
              break;
            case 'ccCost':
              if(setTotal(x, true)) {
                headerTemp.push(
                  {
                    text: 'Customs',
                    value: 'ccCost',
                  }
                )
              }
              break;
            case 'lmCost':
              if(setTotal(x, true)) {
                headerTemp.push(
                  {
                    text: 'Last Mile',
                    value: 'lmCost',
                  }
                )
              }
              break;
            case 'bobCost':
              if(setTotal(x, true)) {
                headerTemp.push(
                  {
                    text: 'BOB',
                    value: 'bobCost',
                  }
                )
              }
              break;
            case 'codCost':
              if(setTotal(x, true)) {
                headerTemp.push(
                  {
                    text: 'COD',
                    value: 'codCost',
                  }
                )
              }
              break;

            default:
              break;
          }
        })
        headerTemp = [
          ...headerTemp,
          {
            text: 'Total',
            value: 'total',
          },
          {
            text: 'D&T',
            value: 'dnt',
          },
          {
            text: 'Admin Fee',
            value: 'adminFee',
          }
        ]
      return headerTemp
    })


    // manage summary table

    const dataTable = ref({
      search: '',
    })



    onMounted(() => {
      storeApplications.commit('applications/RESET_ALERT')
    })

    const showBorder = (item: any) => {
      if (item === "codCost") {

        // return {borderRight:'1px dashed red'}
        return 'border-right: 1px dashed red'
      }
      if(item === 'orderCode') {
        // return {color:'#1961e4', fontWeight: 700}
        return 'color: #1961e4; font-weight: 700'
      }

    }
    const setPrice = (price: string) => {
      return parseFloat(price).toFixed(2)
    }
    function setTotal(key: string, isNotSetPrice?: Boolean) {
      const total = props.nodeCalculators.reduce( function(a: Number | unknown, b: any){
          return a + b[key];
        }, 0)
      if(isNotSetPrice) {
        return total
      } else {
        return setPrice(
          total
        )
      }
    }

    return {
      dataTable,
      headersComp,
      // nodeCalculators,
      setPrice,
      showBorder,
      setTotal
    }
  },
})
</script>

<style lang="scss">
@import '~/assets/scss/color.module.scss';
  .summary-tab {
    th[aria-label="Total"] {
      border-right: 1px dashed red
    }
    thead th {
      white-space: nowrap;
    }
    tbody td:nth-child(7) {
      border-right: 1px dashed red
    }
    .theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
      border-bottom: hidden !important;
    }
    .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
      border-bottom: hidden !important;
    }
    .td-custom {
      font-size: 0.875rem;
      height: 48px;
      padding: 0 16px;
      transition: height 0.2s  cubic-bezier(0.4, 0, 0.6, 1);text-align: start
    }

  }
</style>
