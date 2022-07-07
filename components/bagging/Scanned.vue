<template>
  <article class="scanned-tab pa-8">
    <v-container fluid class="pa-0">
      <v-row
        v-if="dataComp && dataComp.length"
      >
        <v-col
          v-for="(partner, u) in dataComp"
          :key="u"
          cols="4"
          class="d-flex align-center justify-space-between pa-4"
        >
          <v-card
            elevation="1"
            class="mx-auto"
            width="100%"
            :style="'overflow: hidden'"
          >
            <v-card-title class=" d-flex flex-column justify-center align-center text-center mb-3">
              <v-btn
                color="green darken-1 white--text mb-4"
                @click="toggleConfirm(partner)"
              >
                CLOSE BAG
              </v-btn>
              <div class="text-h4 mb-2">
                {{partner.group_name}}
              </div>
              <div class="title">
                Orders: {{partner.orders && partner.orders.length ? partner.orders.length : 0}}
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-virtual-scroll
              :items="partner.orders"
              :item-height="50"
              height="200"
            >
              <template #default="{ item }">
                <v-list-item
                  :class="`custom-list-item-scroll ${item.new ? 'bg-custom' : ''}`"
                >
                  <v-list-item-avatar>
                    <v-icon
                    >
                      {{
                        isBagTabPartner
                        ? 'mdi-bag-personal-outline'
                        : 'mdi-email-outline'
                      }}
                    </v-icon>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>
                      {{item.orderCode}}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </v-card>
        </v-col>
      </v-row>
      <v-row
        v-else
        class="d-flex justify-center font-weight-bold"
      >
        No Scanned Items
      </v-row>
    </v-container>


    <!-- Modal confirm -->
    <BaggingModalConfirm
      v-model="dialog.confirm"
      :dialog-settings="dialogSettings"
      :is-confirm="true"
      @doSubmit="submit"
      @doCancel="handleCancel"
    />
    <!-- Modal after click no -->
    <BaggingModalConfirm
      v-model="dialog.cancel"
      :dialog-settings="dialogSettings"
      @doSubmit="() => (dialog.cancel = false)"
    />

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
import { ModalConfirm, VuexModuleApplications } from '~/types/applications'
import { VuexModuleDetailBagging, FilterBagging, Unbagged, Bagged, Order, InputPostBag, InputLabelBags} from '~/types/bagging/bagging'

export default defineComponent({
  name: 'BaggingScanned',
  components: {
  },
  props: {
    data: {
      type: Array as PropType<Unbagged[]>,
      required: true
    },
    isBagTabPartner: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const storeApplications = useStore<VuexModuleApplications>()
    const storeBagging = useStore<VuexModuleDetailBagging>()
    const { app, $dateFns } = useContext()
    const dialog = ref({
      confirm: false,
      cancel: false
    })
    const dialogSettings = ref({
      loading: false,
      title: '',
      content: '',
      cancelText: '',
      submitText: '',
      submitColor: '',
    }) as Ref<ModalConfirm>
    const dataComp = computed(() => {
      let data = props.data.map((x: Unbagged,i: number) => {
        return x.order_group
      }) as any
      data = [].concat.apply([], data);
      return data
    }) as Ref<Bagged[]>
    const selectedUnbagged = ref({}) as Ref<InputPostBag | {}>

    function toggleConfirm(data: Bagged) {
      dialogSettings.value = {
        loading: false,
        title: 'Print label now ?',
        content: '',
        cancelText: 'No',
        submitText: 'Yes',
        submitColor: 'primary',
      }
      dialog.value.confirm = true

      const parseInput = {
        bag_name: data.group_name + '-' + $dateFns.format(
        new Date(),
        'yyyy-MM-dd\'T\'HH:mm:ss.SSS'
      ),
        order_ids: data.orders.map((x: Order) => x.id)
      }
      selectedUnbagged.value = parseInput
    }
    async function submit(params: {isCancel?: boolean}) {
      try {
        dialogSettings.value.loading = true
        const returnPostBag = await storeBagging.dispatch(
          'bagging/bagging/postBags',
          {payload: selectedUnbagged.value}
        )
        if(
          returnPostBag &&
          Object.keys(returnPostBag).length > 0 &&
          returnPostBag.id &&
          returnPostBag.group_name
        ) {
          const label = await postLabelBags({bag_id: returnPostBag.id, group_name: returnPostBag.group_name})
          if(!params?.isCancel && label) window.open(label, '_self')
        }
        await fetchBags()
        const textMsg = params?.isCancel ? 'Close Bag' : 'Print label'

        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'success',
          message: `${textMsg} successfully!`,
        })
      } catch (error) {

        const textMsg = params?.isCancel ? 'Close Bag' : 'Print label'
        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'error',
          message: `${textMsg} successfully!`,
        })
      } finally {
        dialogSettings.value.loading = false
        if(params?.isCancel) {
          dialog.value.cancel = false
        } else {
          dialog.value.confirm = false
        }
        setTimeout(() => {
          storeApplications.commit('applications/RESET_ALERT')
        }, 3000)
      }
    }

    async function fetchBags () {

      try {
        await storeBagging.dispatch('bagging/bagging/getBags')
      } catch (error) {
        return error
      }
    }
    async function handleCancel() {
      await submit({isCancel: true})
      dialogSettings.value = {
        loading: false,
        title: 'Make sure bags are arranged properly to prevent mix-up',
        content: '',
        cancelText: '',
        submitText: 'Ok',
        submitColor: 'primary',
      }
      dialog.value.cancel = true

    }

    async function postLabelBags (payload: InputLabelBags) {

      try {
        // $fetchState.pending = true
        return await storeBagging.dispatch('bagging/bagging/postLabelBags', {payload})
      } catch (error) {
        return error
      } finally {
        // $fetchState.pending = false
      }
    }
    return {
      dataComp,
      dialog,
      dialogSettings,
      toggleConfirm,
      submit,
      handleCancel
    }
  },
})
</script>

<style lang="scss">
@import '~/assets/scss/color.module.scss';
.scanned-tab {
  .custom-list-item-scroll {
    &:hover {
      background: $primary;
      color: white !important;
      .v-icon {
        color: white !important;
      }
    }
  }
  .bg-custom {
    background: $primary;
    color: white !important;
    .v-icon {
      color: white !important;
    }
  }
}
</style>
