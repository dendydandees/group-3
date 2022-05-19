<template>
  <v-data-table
    v-bind="tableSettings"
    :items="nodeCalc"
    :loading="fetchState.pending"
    :items-per-page="-1"
    class="elevation-0"
  >
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
  watch
} from '@nuxtjs/composition-api'
import { OrderItem, VuexModuleOrders } from '~/types/orders'
import { VuexModuleIncomingOrders } from '~/types/partnerPortals/incomingOrders'

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
  setup(props) {
    const route = useRoute() as any
    const storeOrders = useStore<VuexModuleOrders>()
    const storeIncomingOrders = useStore<VuexModuleIncomingOrders>()
    const nodeCalc = computed(() => {
      if(
        storeOrders.state.orders.orderDetails.nodeCalc &&
        storeOrders.state.orders.orderDetails.nodeCalc[route.value?.params?.id]
      )  {
        const dataNodeCalc = storeOrders.state.orders.orderDetails.nodeCalc[route.value?.params?.id]
        const temp = {
          "id": dataNodeCalc.id,
          "fmCost": Number(dataNodeCalc.fmCost),
          "lmCost": Number(dataNodeCalc.lmCost),
          "ccCost": Number(dataNodeCalc.ccCost),
          "bobCost": Number(dataNodeCalc.bobCost),
          "codCost": Number(dataNodeCalc.codCost),
          "total": Number(dataNodeCalc.fmCost) + Number(dataNodeCalc.lmCost) + Number(dataNodeCalc.ccCost) + Number(dataNodeCalc.bobCost) + Number(dataNodeCalc.codCost),
          "dnt": Number(dataNodeCalc.dutiesFee) + Number(dataNodeCalc.taxFee),
          "adminFee": Number(dataNodeCalc.fmTransmissionFee) + Number(dataNodeCalc.lmTransmissionFee) + Number(dataNodeCalc.ccTransmissionFee) + Number(dataNodeCalc.bobTransmissionFee),
          "currency": dataNodeCalc.currency
        }
        return [temp]
      } else {
        return []
      }
    })

    const tableSettings = reactive({
      itemKey: 'id',
      hideDefaultFooter: true,
      headers: [] as {text: String, value: String | Number}[],
    })


    watch(
      [nodeCalc],
      ([newNode]) => {
        let headerTemp = [] as any
        let objNewNode = {}
        if(newNode && newNode[0]) objNewNode = newNode[0]
        const objEntries = Object.entries(objNewNode)

        objEntries.forEach((x: any) => {
          const key = x[0]
          const value = x[1]
          switch (key) {
            case 'fmCost':
              if(value) {
                headerTemp.push(
                  {
                    text: 'First Mile',
                    value: 'fmCost',
                  }
                )
              }
              break;
            case 'ccCost':
              if(value) {
                headerTemp.push(
                  {
                    text: 'Customs',
                    value: 'ccCost',
                  }
                )
              }
              break;
            case 'lmCost':
              if(value) {
                headerTemp.push(
                  {
                    text: 'Last Mile',
                    value: 'lmCost',
                  }
                )
              }
              break;
            case 'bobCost':
              if(value) {
                headerTemp.push(
                  {
                    text: 'BOB',
                    value: 'bobCost',
                  }
                )
              }
              break;
            case 'codCost':
              if(value) {
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
        tableSettings.headers = headerTemp
      },
      { deep: true }
    )

    const setPrice = (price: string) => {
      return parseFloat(price).toFixed(2)
    }

    return {
      nodeCalc,
      tableSettings,
      setPrice,

    }
  },
})
</script>
