<template>
  <v-data-table
    v-bind="tableSettings"
    :items="nodeCalc"
    :loading="fetchState.pending"
    :items-per-page="-1"
    class="elevation-0"
  >
    <template #[`item.fmCost`]="{ item }">
      {{ setPrice(item.fmCost, item.currency) }}
    </template>
    <template #[`item.ccCost`]="{ item }">
      {{ setPrice(item.ccCost, item.currency) }}
    </template>
    <template #[`item.lmCost`]="{ item }">
      {{ setPrice(item.lmCost, item.currency) }}
    </template>
    <template #[`item.bobCost`]="{ item }">
      {{ setPrice(item.bobCost, item.currency) }}
    </template>
    <template #[`item.codCost`]="{ item }">
      {{ setPrice(item.codCost, item.currency) }}
    </template>
    <template #[`item.total`]="{ item }">
      {{ setPrice(item.total, item.currency) }}
    </template>
    <template #[`item.dnt`]="{ item }">
      {{ setPrice(item.dnt, item.currency) }}
    </template>
    <template #[`item.adminFee`]="{ item }">
      {{ setPrice(item.adminFee, item.currency) }}
    </template>
  </v-data-table>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  useStore,
  useRoute,
  watch,
} from '@nuxtjs/composition-api'
import { VuexModuleOrders } from '~/types/orders'

export default defineComponent({
  props: {
    fetchState: {
      type: Object,
      default: () => ({}),
    },
    isUpcoming: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const route = useRoute() as any
    const storeOrders = useStore<VuexModuleOrders>()
    const nodeCalc = computed(() => {
      if (
        storeOrders.state.orders.orderDetails.nodeCalc &&
        storeOrders.state.orders.orderDetails.nodeCalc[route.value?.params?.id]
      ) {
        const dataNodeCalc =
          storeOrders.state.orders.orderDetails.nodeCalc[
            route.value?.params?.id
          ]
        const temp = {
          id: dataNodeCalc.id,
          fmCost: Number(dataNodeCalc.fmCost),
          lmCost: Number(dataNodeCalc.lmCost),
          ccCost: Number(dataNodeCalc.ccCost),
          bobCost: Number(dataNodeCalc.bobCost),
          codCost: Number(dataNodeCalc.codCost),
          total:
            Number(dataNodeCalc.fmCost) +
            Number(dataNodeCalc.lmCost) +
            Number(dataNodeCalc.ccCost) +
            Number(dataNodeCalc.bobCost) +
            Number(dataNodeCalc.codCost),
          dnt: Number(dataNodeCalc.dutiesFee) + Number(dataNodeCalc.taxFee),
          adminFee:
            Number(dataNodeCalc.fmTransmissionFee) +
            Number(dataNodeCalc.lmTransmissionFee) +
            Number(dataNodeCalc.ccTransmissionFee) +
            Number(dataNodeCalc.bobTransmissionFee),
          currency: dataNodeCalc.currency,
        }
        return [temp]
      } else {
        return []
      }
    })

    const tableSettings = reactive({
      itemKey: 'id',
      hideDefaultFooter: true,
      headers: [] as { text: String; value: String | Number }[],
    })

    watch(
      [nodeCalc],
      ([newNode]) => {
        let headerTemp = [] as any
        let objNewNode = {}
        if (newNode && newNode[0]) objNewNode = newNode[0]
        const objEntries = Object.entries(objNewNode)

        objEntries.forEach((x: any) => {
          const key = x[0]
          const value = x[1]
          switch (key) {
            case 'fmCost':
              if (value) {
                headerTemp.push({
                  text: 'First Mile',
                  value: 'fmCost',
                })
              }
              break
            case 'ccCost':
              if (value) {
                headerTemp.push({
                  text: 'Customs',
                  value: 'ccCost',
                })
              }
              break
            case 'lmCost':
              if (value) {
                headerTemp.push({
                  text: 'Last Mile',
                  value: 'lmCost',
                })
              }
              break
            case 'bobCost':
              if (value) {
                headerTemp.push({
                  text: 'BOB',
                  value: 'bobCost',
                })
              }
              break
            case 'codCost':
              if (value) {
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
            text: 'Transmission Fee',
            value: 'adminFee',
          },
        ]
        tableSettings.headers = headerTemp
      },
      { deep: true }
    )

    const setPrice = (price: string, currency: string) => {
      if (!price || !currency) return ''

      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        maximumFractionDigits: 2,
        currencyDisplay: 'code',
        currency,
      }).format(parseFloat(price))
    }

    return {
      nodeCalc,
      tableSettings,
      setPrice,
    }
  },
})
</script>
