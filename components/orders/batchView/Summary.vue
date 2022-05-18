<template>
  <article class="summary-tab pa-8">
    <v-data-table
      hide-default-footer
      :headers="dataTable.headers"
      :items="dataTable.desserts"
      item-key="name"
      :search="dataTable.search"
      disable-sort
    >
      <template #item="{ item }">
        <tr >
            <td
              v-for="(col,key) in item"
              :key="key"
              :style="`${showBorder(key)}`"
            >
              <!-- :style="{borderLeft: '1px solid blue'}" -->
                {{ col }}
            </td>
        </tr>
      </template>
      <!-- <template #item.iron="{ item }">
        <div
          :style="'border-right: 1px solid'"
        >
          {{item.iron}}
        </div>
      </template> -->
      <template #body.append>
        <tr>
          <td></td>
          <td>
            USD 0.00
          </td>
          <td>
            USD 0.00
          </td>
          <td>
            USD 0.00
          </td>
          <td>
            USD 0.00
          </td>
          <td
            class="error--text font-weight-bold"
            :style="{borderRight:'1px dashed red'}"
          >
            USD 0.00
          </td>
          <td
            class="error--text font-weight-bold"
          >
            USD 0.00
          </td>
          <td>
            USD 0.00
          </td>
        </tr>
      </template>
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
  },
  setup(props) {
    const router = useRouter()

    // manage store
    const storeApplications = useStore<VuexModuleApplications>()
    const storeOfOrders = useStore<VuexModuleOrders>()
    const alert = computed(() => storeApplications.state.applications.alert)


    // manage summary table

    const dataTable = ref({
      search: '',
      calories: '',
      desserts: [
        {
          name: 'Tesss Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%',
          tes: 1
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%',
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%',
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%',
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%',
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%',
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%',
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: '45%',
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: '22%',
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: '6%',
        },
      ],
      headers: [
        {
          text: 'ORDER ID',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'FIRST MILE', value: 'calories' },
        { text: 'FREIGHT', value: 'fat' },
        { text: 'CUSTOMS', value: 'carbs' },
        { text: 'LAST MILE', value: 'protein' },
        { text: 'TOTAL', value: 'iron' },
        { text: 'D&T', value: 'tes' },
        { text: 'ADMIN FEE', value: 'tes2' },
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

    return {
      dataTable,
      showBorder
    }
  },
})
</script>

<style lang="scss">
@import '~/assets/scss/color.module.scss';
  .summary-tab {
    thead th:nth-child(6) {
      border-right: 1px dashed red
    }
    .theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
      border-bottom: hidden !important;
    }
    .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
      border-bottom: hidden !important;
    }

  }
</style>
