<template>
  <div
    class="custom-rule"
  >
    <div>
      {{namePartnerPriority[index]}}
    </div>
    <div>
      <div
        v-for="(rule, i) in rulesComp"
        :key="i"
        class="d-flex align-center pb-3"
      >
        <div
          class="pr-3"
        >
          <LcontrolDropdownCustom
            v-model="ruleOpt.value"
            :title="'Rule'"
            :placeholder="'Country'"
            :data="dataOptRuleName"
          />
        </div>
        <LcontrolDropdownCustom
          v-if="ruleOpt.value && ruleOpt.value === 'zone'"
          :title="'tes'"
          :placeholder="'Country'"
          :data="[]"
        />
        <v-range-slider
          v-else-if="ruleOpt.value && ruleOpt.value !== 'zone'"
          v-model="range"
          :max="max"
          :min="min"
          hide-details
          class="align-center"
        >
          <template #prepend>
            <v-text-field
              :value="range[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(range, 0, $event)"
            ></v-text-field>
          </template>
          <template #append>
            <v-text-field
              :value="range[1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(range, 1, $event)"
            ></v-text-field>
          </template>
        </v-range-slider>
        <v-btn
          color="blue darken-1 white--text"
          @click="addDeleteRule('-', i)"
        >
          -
        </v-btn>
      </div>
      <v-btn
        color="blue darken-1 white--text"
        @click="addDeleteRule('+')"
      >
        + add condition
      </v-btn>
      <div
        class="d-flex align-center pb-3"
      >
        <div
          class="pr-3"
        >
          Partner
        </div>
        <LcontrolDropdownCustom
          v-model="partnerComp.value"
          :placeholder="'Partner'"
          :data="dataPartner"
          :partner="partnerComp.value"
        />
        <!-- <v-select
          v-model="partnerComp.value"
          :items="dataPartner"
          item-text="name"
          item-value="value"
          :placeholder="'Partner'"
          outlined
          rounded
          dense
          color="blue"
          class="custom-select"
        >
        </v-select> -->
      </div>
    </div>
  </div>
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
  PropType,
} from '@nuxtjs/composition-api'
// Interfaces or types
import { RuleDefinitions,Rules,LControl } from '~/types/lcontrol'

export default defineComponent({
  props: {
    index: {
      type: Number as PropType<Number>,
      default: 0,
    },
    value: {
      type: Array as PropType<RuleDefinitions[] | []>,
      default: () => [],
    },
    ruleDefinitions: {
      type: Array as PropType<RuleDefinitions[] | []>,
      default: () => [],
    },
    partner: {
      type: String as PropType<String | ''>,
      default: '',
    }
  },
  setup(props, {emit}) {
    const arrRule = reactive({
      data: [] as {index: number}[]
    })
    const range = ref([-20, 70])
    const partnerComp = reactive({
      value: ''
    })
    const ruleOpt = reactive({
      value: ''
    })
    const namePartnerPriority =[
      'Primary',
      'Secondary',
      'Tertiary'
    ] as string[]
    const dataPartner = [
      {
        name: 'RPX',
        value: 'rpx'
      },
      {
        name: 'JNE',
        value: 'jne'
      },
      {
        name: 'JNT',
        value: 'jnt'
      },
    ]
    const dataOptRuleName = [
      {
        name: 'Zone',
        value: 'zone'
      },
      {
        name: 'Order',
        value: 'order'
      },
      {
        name: 'Price',
        value: 'price'
      }
    ]
    const rulesComp = computed({
      get: () => props.value,
      // get: () => props.ruleDefinitions,
      set: (value: RuleDefinitions[]) => {
        // console.log({rulesComp: value})

        emit('input', value)
      }
    })
    const partnerCompForParent = computed({
      get: () => props.partner,
      set: (value: String) => {
        // console.log({partnerCompForParent: value})
        emit('input', value)
      }
    })

    const addDeleteRule = (status: String, index: number)=> {
      switch (status) {
        case '+':
          // console.log('ruleDefinitioan', rulesComp.value, partnerCompForParent.value)
          // alert(JSON.stringify(rulesComp.value))
          // alert( JSON.stringify(partnerCompForParent.value))
          rulesComp.value = [
            ...rulesComp.value,
            {
              ruleType: `ZONE${rulesComp.value.length + 1}`,
              value: "Bandung"
            }
          ]
          // arrRule.data.push({index: arrRule.data.length + 1})
          break;
        case '-':
          rulesComp.value.splice(index,1);
          // arrRule.data.splice(index,1);
          break;
        default:
          break;
      }
    }
    watch(
      partnerComp,
      (newData) => {
        // console.log('selected rulePartner', newData.value)
        // partnerCompForParent.value = newData.value
      },
      { deep: true }
    )
    watch(
      rulesComp,
      (newData) => {
        // console.log('selected rulesComp', newData)
      },
      { deep: true }
    )
    watch(
      ruleOpt,
      (newData) => {
        // alert(newData.value)
      },
      { deep: true }
    )

    return {
      arrRule,
      addDeleteRule,
      rulesComp,
      namePartnerPriority,
      dataPartner,
      partnerComp,
      dataOptRuleName,
      ruleOpt,
      range
    }
  },
})
</script>
<style lang="scss">
  .custom-rule{

  }
</style>
