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
            <v-list-item-title>{{parent.name}} - {{parent.port}}</v-list-item-title>
            <v-list-item-subtitle>Total Orders: {{parent.total_orders}}</v-list-item-subtitle>
          </template>

          <v-list-group
            v-for="(sub, subIndex) in parent.sub"
            :key="subIndex"
            no-action
            sub-group
          >
            <template #activator>
              <v-list-item-content>
                <v-list-item-title>{{sub.name}}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-content class="custom-item-content">
                <v-list-item-subtitle>Total Orders: {{sub.total_orders}}</v-list-item-subtitle>
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
                :style="'margin-left: 30px;'"
                :disabled="handleDisabled({order: x, sub, parent, index:{parent: index, sub: subIndex, order: orderIndex}})"
              >
                <template #default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active"></v-checkbox>
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
} from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'BaggingList',
  components: {
  },
  props: {
  },
  setup(props) {
    const checklist = ref([]) as Ref<any>
    const dataTemp = [
      {
        name: 'Malaysia',
        port: 'KUL',
        total_orders: 15,
        sub: [
          {
            name: 'Malaysia - 1',
            total_orders: 10,
            orders: [
              {
                orderCode: 'TES1321'
              }
            ]
          },
          {
            name: 'Malaysia - 2',
            total_orders: 5,
            orders: [
              {
                orderCode: 'TES123'
              },
              {
                orderCode: 'TES321'
              },
              {
                orderCode: 'TES456'
              }
            ]
          }
        ]
      },
      {
        name: 'Singapore',
        port: 'SIN',
        total_orders: 15,
        sub: [
          {
            name: 'Singapore - 1',
            total_orders: 10,
            orders: [
              {
                orderCode: 'SIN1321'
              }
            ]
          },
          {
            name: 'Singapore - 2',
            total_orders: 5,
            orders: [
              {
                orderCode: 'SIN123'
              },
              {
                orderCode: 'SIN321'
              },
              {
                orderCode: 'SIN456'
              }
            ]
          }
        ]
      }
    ]
    function handleDisabled({order,sub,parent, index}: {order: any, sub: any, parent: any, index?:{parent: number, sub: number, order: number}}) {
      let nameParent = ''
      let nameSub = ''
      if(checklist.value && checklist.value[0]) {
        const data = dataTemp
        const indexParent = data.findIndex((x: any) => x?.sub.some((y: any) => y?.orders.some((z: any) => z.orderCode === checklist.value[0].orderCode)))
        const indexSub = data[indexParent].sub.findIndex((x: any) => x?.orders.some((y: any) => y.orderCode === checklist.value[0].orderCode))
        nameParent = data[indexParent].name
        nameSub = data[indexParent].sub[indexSub].name
      }

      if(!nameParent || !nameSub) return false
      if(
        parent.name === nameParent &&
        sub.name === nameSub
      ) {
        return false
      } else {
        return true
      }
    }
    function changePage() {
      // alert('yes')
    }
    return {
      checklist,
      dataTemp,
      handleDisabled,
      changePage
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
}
</style>
