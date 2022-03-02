<template>
  <div
    class="custom-rule"
  >
    <div>
      {{namePartnerPriority[index]}}
      {{ruleDefinitions}}
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
            :title="'tes'"
            :placeholder="'Country'"
            :data="[]"
          />
        </div>
        <LcontrolDropdownCustom
          :title="'tes'"
          :placeholder="'Country'"
          :data="[]"
        />
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
  PropType
} from '@nuxtjs/composition-api'
// Interfaces or types
import { RuleDefinitions,Rules,LControl } from '~/types/lcontrol'

export default defineComponent({
  props: {
    index: {
      type: Number as PropType<Number>,
      default: 0,
    },
    // value: {
    //   type: Array as PropType<RuleDefinitions[] | []>,
    //   default: () => [],
    // },
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
    const partnerComp = reactive({
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
    const dataOptRuleName = ['Order', 'Price', 'Weight']
    const rulesComp = computed({
      // get: () => props.value,
      get: () => props.ruleDefinitions,
      set: (value: RuleDefinitions[]) => {
        console.log({rulesComp: value})

        emit('input', value)
      }
    })
    const partnerCompForParent = computed({
      get: () => props.partner,
      set: (value: String) => {
        console.log({partnerCompForParent: value})
        emit('input', value)
      }
    })

    const addDeleteRule = (status: String, index: number)=> {
      switch (status) {
        case '+':
          console.log('ruleDefinitioan', rulesComp.value, partnerCompForParent.value)
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
        console.log('selected rulePartner', newData.value)
        partnerCompForParent.value = newData.value
      }
    )
    console.log({rules: props.ruleDefinitions})

    return {
      arrRule,
      addDeleteRule,
      rulesComp,
      namePartnerPriority,
      dataPartner,
      partnerComp
    }
  },
})
</script>
<style lang="scss">
  .custom-rule{

  }
</style>
