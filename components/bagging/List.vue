<template>
  <article class="bagging-tab pa-8">
    <v-card
      class="mx-auto"

    >
      <v-list>

        <v-list-group
          v-for="(parent, index) in dataTemp"
          :key="index"
        >
          <template #activator>
            <v-list-item-title>{{parent.dest_country}} - {{parent.dest_port}}</v-list-item-title>
            <v-list-item-subtitle>Total Orders: {{orderTotal(parent.order_group)}}</v-list-item-subtitle>
          </template>

          <v-list-group
            v-for="(sub, subIndex) in parent.order_group"
            :key="subIndex"
            no-action
            sub-group
          >
            <template #activator>
              <v-list-item-content>
                <v-list-item-title>{{sub.group_name}}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-content class="custom-item-content">
                <v-list-item-subtitle>Total Orders: {{sub.orders && sub.orders.length ? sub.orders.length : 0}}</v-list-item-subtitle>
              </v-list-item-content>
            </template>
            <v-list-item-group
              v-model="checklist"
              multiple
              active-class=""
            >
              <v-list-item
                v-for="(x, orderIndex) in sub.orders"
                :key="orderIndex"
                :value="x"
                :class="`${x.new ? 'bg-custom' : ''}`"
                :style="`margin-left: 30px; `"
                :disabled="handleDisabled({order: x, sub, parent, index:{parent: index, sub: subIndex, order: orderIndex}})"
              >
                <template #default="{ active }">
                  <v-list-item-action>
                    <!-- <v-checkbox :input-value="active"></v-checkbox> -->

                    <v-checkbox
                      v-ripple
                      on-icon="mdi-checkbox-marked-circle"
                      off-icon="mdi-checkbox-blank-circle-outline"
                      color="primary"
                      :input-value="active"
                    />
                  </v-list-item-action>

                  <v-list-item-content
                  >
                    <!-- <v-list-item-title>{{x.orderCode}}</v-list-item-title> -->
                    <v-list-item-title>
                      <v-btn text color="primary" @click.stop="changePage">
                        <span>
                          {{ x.orderCode }}
                        </span>
                      </v-btn>
                    </v-list-item-title>
                  </v-list-item-content>
                </template>

              </v-list-item>
            </v-list-item-group>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-card>
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
  PropType,
  useContext
} from '@nuxtjs/composition-api'
import { VuexModuleDetailBagging, FilterBagging, Unbagged, Bagged, Order, InputPostBag} from '~/types/bagging/bagging'

export default defineComponent({
  name: 'BaggingList',
  components: {
  },
  props: {
    data: {
      type: Array as PropType<Unbagged[] | []>,
      required: true
    },
    value: {
      type: Object as PropType<InputPostBag | {}>,
      required: true
    },
  },
  setup(props, { emit }) {
    const { app, $dateFns } = useContext()
    const checklist = ref([]) as Ref<any>
    const dataTemp = props.data as Unbagged[]
    const selectedUnbagged = computed({
      get: () => props.value,
      set: (value) => {
        emit('input', value)
      },
    })

    watch(
      () => [checklist.value],
      ([newChecklist]) => {
        let finalPayload = {}

        if(newChecklist && newChecklist.length > 0) {
          const id = newChecklist[0].id
          let orderGroups = dataTemp.map((x: Unbagged) => x.order_group) as any
          orderGroups = [].concat.apply([], orderGroups);
          const filterData = (orderGroups.filter((x: Bagged) => x.orders && x.orders.some((y: Order) => y.id === id)))[0]
          finalPayload = {
            bag_name: filterData.group_name + '-' + $dateFns.format(
            new Date(),
            'yyyy-MM-dd\'T\'HH:mm:ss.SSS'
          ),
            order_ids: newChecklist.map((x: Order) => x.id)
          }
        }
        selectedUnbagged.value = finalPayload
      },
      { deep: true }
    )

    function handleDisabled({order,sub,parent, index}: {order: any, sub: any, parent: any, index?:{parent: number, sub: number, order: number}}) {
      let nameParent = ''
      let nameSub = ''
      if(checklist.value && checklist.value[0]) {
        const data = dataTemp
        const indexParent = data.findIndex((x: Unbagged) => x?.order_group.some((y: Bagged) => y?.orders.some((z: Order) => z.orderCode === checklist.value[0].orderCode)))
        const indexSub = data[indexParent].order_group.findIndex((x: Bagged) => x?.orders.some((y: Order) => y.orderCode === checklist.value[0].orderCode))
        nameParent = data[indexParent].dest_country
        nameSub = data[indexParent].order_group[indexSub].group_name
      }

      if(!nameParent || !nameSub) return false
      if(
        parent.dest_country === nameParent &&
        sub.group_name === nameSub
      ) {
        return false
      } else {
        return true
      }
    }
    function changePage() {
      // alert('yes')
    }
    function orderTotal(data: Bagged[]) {
      return data.reduce(function (acc, obj) { return acc + (obj.orders && obj.orders.length ? obj.orders.length : 0); }, 0);
    }
    return {
      checklist,
      dataTemp,
      handleDisabled,
      changePage,
      orderTotal
    }
  },
})
</script>

<style lang="scss">
@import '~/assets/scss/color.module.scss';
.bagging-tab {
  .v-list-group {
    .v-icon {
      color: white;
      &.mdi-checkbox-blank-circle-outline {
        color: rgba(0, 0, 0, 0.54) !important;
      }
    }
    .mdi-checkbox-blank-outline {
      color: grey
    }
    .v-list-group__header {
      background: $primary;
      color: white !important;
      border-radius: 20px;
      margin: 2px 0;
      min-height: 56px !important;
    }
    .v-list-group--sub-group {
      margin-left: 30px;
    }
    .theme--light.v-list-item:hover::before {
      border-radius: 15px;
    }
    .v-list-item__subtitle {
      flex: 1 .5 100%;
      color: white !important
    }
    .custom-item-content {
      flex: 3.5;
    }
  }
  .bg-custom {
    background: $primary;
    color: white !important;
    .v-icon {
      color: white !important;
    }
    .v-btn__content {
      color: white !important;
    }
  }
}
</style>
