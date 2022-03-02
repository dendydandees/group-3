<template>
  <div>
    <v-dialog v-model="dialogComp.status" persistent max-width="600">
      <v-card
        class="rounded-xl pa-6"
      >
        <LcontrolDropdownCustom
          :label="'Country'"
          :placeholder="'Country'"
          :data="[]"
          class="pb-3"
        />
        <LcontrolDropdownCustom
          :label="'Default Partner'"
          :placeholder="'Default Partner'"
          :data="[]"
        />
        <LcontrolBorderHorizontal
          class="my-6"
        />
        <div
          v-if="!isAddRule.status"
        >
          <div
            class="subtitle-2"
          >
            Optional*
          </div>
          <v-btn
            color="blue darken-1 white--text"
            @click="actionAddRule()"
          >
            + Add Rule
          </v-btn>
        </div>
        <div
          v-else
        >
          <div
            class="h-5 font-weight-medium"
          >
            Rule
          </div>
          <div>
            <!-- <LcontrolRulePartner
              v-for="(x, i) in arrPartner.data"
              :key="i"
              v-model="arrPartner.data[i]"
              :index="i"
            /> -->
            <LcontrolRulePartner
              v-for="(x, i) in arrPartner.data"
              :key="i"
              v-model="x.ruleDefinitions"
              :index="i"
            />
          </div>
          <v-btn
            v-if="arrPartner.data.length < 3"
            color="blue darken-1 white--text"
            @click="addDeleteRule('+')"
          >
            + add network partner
          </v-btn>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="toggle()"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1 white--text"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
} from '@nuxtjs/composition-api'
// Interfaces or types
import { RuleDefinitions,Rules,LControl } from '~/types/lcontrol'

export default defineComponent({
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({}),
    }
  },
  setup(props, {emit}) {
    const arrPartner = reactive({
      data: [
        {
          "priority": 1,
          "partnerID": "partner1",
          "ruleDefinitions": []
        }
      ] as Rules[]
    })

    const dialogComp = computed({
      get: () => props.dialog,
      set: (value: boolean) => emit('input', value)
    })
    const isAddRule = reactive({
      status: false
    })
    const toggle = () => {
      emit('toggle')
    }
    const actionAddRule = () => {
      isAddRule.status = !isAddRule.status
    }

    const addDeleteRule = (status: String, index: number)=> {
      switch (status) {
        case '+':
          arrPartner.data.push({
            "priority": arrPartner.data.length + 1,
            "partnerID": ``,
            "ruleDefinitions": []
          })
          break;
        case '-':
          arrPartner.data.splice(index,1);
          break;
        default:
          break;
      }
    }
    watch(
      arrPartner,
      (newData) => {
        console.log('Parent', newData.data)
      }
    )
    return {
      toggle,
      dialogComp,
      isAddRule,
      actionAddRule,
      arrPartner,
      addDeleteRule,
    }
  },
})
</script>
