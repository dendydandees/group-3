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
      <template #body="{ items, headers }">
        <tr v-for="(x, i) in items" :key="i">
          <td
            v-for="(y, index) in headers"
            :key="index"
            :class="
              (y.value === 'orderCode' && 'primary--text font-weight-bold') +
              ' td-custom'
            "
            :style="y.value === 'total' && { borderRight: '1px dashed red' }"
          >
            <v-btn
              v-if="y.value === 'orderCode'"
              text
              color="primary"
              @click="doGetDetails(x)"
            >
              <span
                class="font-weight-bold"
              >
                {{
                  y.value && y.value !== 'orderCode'
                    ? setValueByCurrency(x[y.value], x.currency)
                    : x[y.value] || ''
                }}
              </span>
            </v-btn>

            <span
              v-else
            >
              {{
                y.value && y.value !== 'orderCode'
                  ? setValueByCurrency(x[y.value], x.currency)
                  : x[y.value] || ''
              }}
            </span>
          </td>
        </tr>

        <tr v-if="items && items.length > 0">
          <td
            v-for="(x, i) in headers"
            :key="i"
            :style="x.value === 'total' && { borderRight: '1px dashed red' }"
            class="td-custom"
          >
            <span v-if="x.value === 'orderCode'"> </span>

            <span
              v-else
              :class="
                x.value === 'total' || x.value === 'dnt'
                  ? 'primary--text font-weight-bold'
                  : ''
              "
            >
              {{ items[0] && items[0].currency ? setTotal(x.value) : '' }}
            </span>
          </td>
        </tr>

        <tr v-else>
          <td
            :colspan="headers.length"
            class="grey--text td-custom"
            :style="'text-align: center'"
          >
            No data available
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
  useStore,
  onMounted,
  PropType,
  useRouter,
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
  name: 'DetailsTab',
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
    const headersComp = computed(() => {
      let objKeysComp = [] as String[]
      if (props.nodeCalculators[0])
        objKeysComp = Object.keys(props.nodeCalculators[0])

      let headerTemp = [] as any

      objKeysComp.forEach((x: any) => {
        switch (x) {
          case 'orderCode':
            headerTemp.push({
              text: 'ORDER ID',
              align: 'start',
              sortable: false,
              value: 'orderCode',
            })
            break
          case 'fmCost':
            if (setTotal(x, true)) {
              headerTemp.push({
                text: 'First Mile',
                value: 'fmCost',
              })
            }
            break
          case 'ccCost':
            if (setTotal(x, true)) {
              headerTemp.push({
                text: 'Customs',
                value: 'ccCost',
              })
            }
            break
          case 'lmCost':
            if (setTotal(x, true)) {
              headerTemp.push({
                text: 'Last Mile',
                value: 'lmCost',
              })
            }
            break
          case 'bobCost':
            if (setTotal(x, true)) {
              headerTemp.push({
                text: 'BOB',
                value: 'bobCost',
              })
            }
            break
          case 'codCost':
            if (setTotal(x, true)) {
              headerTemp.push({
                text: 'COD',
                value: 'codCost',
              })
            }
            break

          default:
            break
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
        },
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
      if (item === 'codCost') {
        return 'border-right: 1px dashed red'
      }
      if (item === 'orderCode') {
        return 'color: #1961e4; font-weight: 700'
      }
    }
    const setValueByCurrency = (price: number, currency: string) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
        currency,
      }).format(price)
    }
    function setTotal(key: string, isNotSetPrice?: Boolean) {
      const total = props.nodeCalculators.reduce(function (
        a: Number | unknown,
        b: any
      ) {
        return a + b[key]
      },
      0)

      // get the highest occurrence of currency
      const currency = [...props.nodeCalculators]
        ?.sort(
          (itemA: any, itemB: any) =>
            props.nodeCalculators.filter(
              (value: any) => value.currency === itemA.currency
            ).length -
            props.nodeCalculators.filter(
              (value: any) => value.currency === itemB.currency
            ).length
        )
        ?.pop()?.currency as string

      if (isNotSetPrice) {
        return total
      } else {
        return setValueByCurrency(total, currency)
      }
    }
    const doGetDetails = (data: any) => {
      router.push(`/orders/${data.orderId}`)
    }


    return {
      dataTable,
      headersComp,
      showBorder,
      setValueByCurrency,
      setTotal,
      doGetDetails
    }
  },
})
</script>

<style lang="scss">
@import '~/assets/scss/color.module.scss';
.summary-tab {
  th[aria-label='Total'] {
    border-right: 1px dashed red;
  }
  thead th {
    white-space: nowrap;
  }
  tbody td:nth-child(7) {
    border-right: 1px dashed red;
  }
  .theme--light.v-data-table
    > .v-data-table__wrapper
    > table
    > thead
    > tr:last-child
    > th {
    border-bottom: hidden !important;
  }
  .theme--light.v-data-table
    > .v-data-table__wrapper
    > table
    > tbody
    > tr
    > td {
    border-bottom: hidden !important;
  }
  .td-custom {
    font-size: 0.875rem;
    height: 48px;
    padding: 0 16px;
    transition: height 0.2s cubic-bezier(0.4, 0, 0.6, 1);
    text-align: start;
  }
}
</style>
