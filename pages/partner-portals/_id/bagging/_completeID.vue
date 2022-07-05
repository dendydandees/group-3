<template>
  <section class="pa-4 pa-md-10 py-8 editComplete">

    <v-row align="start" justify="space-between">
      <v-card
        color="primary"
        class="pa-5"
        width="450px"
      >
        <v-card-title
          class="white--text pa-0 mb-2"
        >
          TEST-MAINBAG
        </v-card-title>
        <v-card-text
          class="pa-0 white--text"
        >
          <div
            v-for="(x, i) in 3"
            :key="i"
            class="d-flex align-start"
          >
            <div
              class="pr-2 font-weight-bold"
              :style="'width: 27.5%'"
            >
              Order ID
            </div>
            <div>
              : dsadalk213123
            </div>
          </div>
        </v-card-text>
      </v-card>
      <v-btn
        color="primary"
        min-width="200px"
        @click="handleStop"
      >
        DONE
      </v-btn>
    </v-row>
    <v-row
      class="mt-10"
    >
      <v-col
        cols="12"
        md="12"
        class="pa-0"
      >
        <v-card
          elevation="2"
          width="100%"
        >
          <article class="scanned-tab pa-8">
            <v-container fluid class="pa-0">
              <v-row
              >
                <v-col
                  v-for="(partner, u) in [1,2,3,4]"
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
                        color="primary darken-1 white--text mb-4"
                        @click="actionCard.toggleConfirm({isBulk: true})"
                      >
                        DELETE BAG
                      </v-btn>
                      <div class="text-h4 mb-2">
                        TESSSSLALLALALALLALALA
                      </div>
                      <div class="title">
                        Orders: 1000
                      </div>
                    </v-card-title>

                    <v-divider></v-divider>

                    <v-virtual-scroll
                      :items="[1,2,3,4,5,6,7,8,9,10]"
                      :item-height="50"
                      height="200"
                    >
                      <template #default="{ item, index }">
                        <v-list-item
                          v-if="index !== 9"
                          :class="`custom-list-item-scroll ${item.new ? 'bg-custom' : ''}`"
                        >
                          <v-list-item-avatar>
                            <v-icon
                            >
                              mdi-email-outline
                            </v-icon>
                          </v-list-item-avatar>

                          <v-list-item-content>
                            <v-list-item-title>
                              TESSADDSADSAD
                            </v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-icon
                            class="custom-icon-bagging"
                            @click="actionCard.toggleConfirm()"
                          >
                            <v-icon>
                              mdi-delete-outline
                            </v-icon>
                          </v-list-item-icon>
                        </v-list-item>
                        <v-list-item
                          v-else
                          :class="`${false ? 'bg-custom' : ''}`"
                          @click="actionCard.addItem()"
                        >
                          <v-list-item-avatar>
                            <v-icon
                            >
                              mdi-plus-circle-outline
                            </v-icon>
                          </v-list-item-avatar>

                          <v-list-item-content>
                            <v-list-item-title>
                              Add Order
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-virtual-scroll>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </article>
        </v-card>
      </v-col>
    </v-row>
    <!-- Modal confirm -->
    <BaggingModalConfirm
      v-model="dialog.confirm"
      :dialog-settings="dialogSettings"
      :is-confirm="true"
      @doSubmit="submit"
      @doCancel="actionCard.handleCancel"
    />
    <!-- Modal after click no -->
    <BaggingModalConfirm
      v-model="dialog.cancel"
      :dialog-settings="dialogSettings"
      @doSubmit="() => (dialog.cancel = false)"
    />
   <v-snackbar
      :value="alert.isShow"
      rounded="pill"
      right
      bottom
      :color="alert.type"
    >
      {{ alert.message }}
    </v-snackbar>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  useFetch,
  useMeta,
  useStore,
  computed,
  ref,
  Ref,
  watch,
  useRoute,
  useRouter,
  useContext,
  onMounted,
} from '@nuxtjs/composition-api'
// Interface and types
import {
  FilterDetails,
  ModalConfirm,
  VuexModuleApplications,
  Alert,
  Header,
} from '~/types/applications'
import { VuexModuleFilters, Statuses, CountryCode } from '~/types/filters'
import { VuexModuleDetailBagging, FilterBagging, Unbagged, InputPostBag, Order, Bagged} from '~/types/bagging/bagging'

export default defineComponent({
  name: 'EditComplete',
  middleware: 'partner',
  setup() {
    const { app, $dateFns } = useContext()
    const router = useRouter()
    const route = useRoute()
    const storeApplications = useStore<VuexModuleApplications>()
    const storeFilters = useStore<VuexModuleFilters>()
    const storeBagging = useStore<VuexModuleDetailBagging>()
    const alert = computed(() => storeApplications.state.applications.alert)
    const unbaggedData = computed(() => ((storeBagging.state.bagging as any).bagging.unbagged))
    const countryCodes = computed(() => storeFilters.state.filters.countryCodes)
    const inputBarcode = ref('')
    const user = localStorage.getItem('auth.user') ? JSON.parse(localStorage.getItem('auth.user') as string) : {}
    const isBagsTabPartner = computed(() => {
      const data = route.value?.params?.isBagsTabPartner
      const query = route.value?.query?.bag && Number(route.value?.query?.bag)
      return data || !!query
    })

    const lastEnter = ref('')
    const allScanned = ref([]) as Ref<any>
    const cardData = ref({}) as Ref<any>
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
    function handleStop() {
      router.go(-1)
    }

    const speech = ref({
      isLoading: true,
      name: '',
      selectedVoice: 49, // GOOGLE voice
      synth: window.speechSynthesis,
      voiceList: [] as any,
      greetingSpeech: new window.SpeechSynthesisUtterance()
    })


    const newScanned = computed(() => {
      if(!localStorage.getItem(`newScanned.${isBagsTabPartner.value ? 'bagsTab' : 'scannedTab'}.partner.${user.email}`) || (!user && !user.email)) {
        return []
      } else {
        return localStorage.getItem(`newScanned.${isBagsTabPartner.value ? 'bagsTab' : 'scannedTab'}.partner.${user.email}`) ? JSON.parse(localStorage.getItem(`newScanned.${isBagsTabPartner.value ? 'bagsTab' : 'scannedTab'}.partner.${user.email}`) as string) : []
      }
    })

    onMounted(() => {
      const temp = newScanned.value.map((x: any) => {
        return {
          ...x,
          new: false
        }
      })
      localStorage.setItem(`newScanned.${isBagsTabPartner.value ? 'bagsTab' : 'scannedTab'}.partner.${user.email}`, JSON.stringify( temp))

    })

    function parseInput() {
      let orderGroups = unbaggedData.value.map((x: Unbagged) => x.order_group && x.order_group).filter((z: any) => z && z.length > 0)
      orderGroups = [].concat.apply([], orderGroups);
      const payload = orderGroups.map((x: Bagged) => {
        return {
          bag_name: x.group_name + '-' + $dateFns.format(
            new Date(),
            'yyyy-MM-dd\'T\'HH:mm:ss.SSS'
          ),
          order_ids: (x.orders && x.orders.filter((y) => (allScanned.value.some((z: {orderCode: string, new: boolean}) => (z.orderCode === y.orderCode) && z.new))))?.map((k) => k.id)
        }
      }).filter((q: InputPostBag) => q.order_ids && q.order_ids.length)
      return payload
    }


    async function submit(params: {isCancel?: boolean}) {
      try {
        dialogSettings.value.loading = true
        const payloadArr = parseInput()
        await Promise.all(
          payloadArr.map(async (el: InputPostBag) => {
            try {
              await storeBagging.dispatch(
                'bagging/bagging/postBags',
                {payload: el}
              )
            } catch (error) {
              return error
            }
          })
        )
        await fetchBags()
        allScanned.value = allScanned.value.map((x: any) => {
          return {
            ...x,
            new: false
          }
        })

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


    function handleBagScanBag() {
      dialogSettings.value = {
        loading: false,
        title: 'Print label now ?',
        content: '',
        cancelText: 'No',
        submitText: 'Yes',
        submitColor: 'primary',
      }
      dialog.value.confirm = true
    }

    function enterInput(event: KeyboardEvent) {
      if(event.key === 'Enter') {
        // let temp = 'Indonesia - '
        // if(allScanned.value.length % 2 !== 0) {
        //   temp = temp + '2'
        // } else {
        //   temp = temp + '1'
        // }
        const data = {
          orderCode: inputBarcode.value,
          new: true
        }
        // const data = inputBarcode.value
        const user = localStorage.getItem('auth.user') ? JSON.parse(localStorage.getItem('auth.user') as string) : {}
        const initialData = user && user.email && localStorage.getItem(`newScanned.${isBagsTabPartner.value ? 'bagsTab' : 'scannedTab'}.partner.${user.email}`) ? JSON.parse(localStorage.getItem(`newScanned.${isBagsTabPartner.value ? 'bagsTab' : 'scannedTab'}.partner.${user.email}`) as string) : allScanned.value

        let mergeAllscanned = []
        if( Object.keys(searchName(inputBarcode.value)).length) {
          mergeAllscanned = [
            ...initialData,
            data
          ]
        } else {
          mergeAllscanned = [
            ...initialData
          ]
        }

        allScanned.value = mergeAllscanned.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.orderCode === value.orderCode
          ))
        )
        localStorage.setItem(`newScanned.${isBagsTabPartner.value ? 'bagsTab' : 'scannedTab'}.partner.${user.email}`, JSON.stringify( allScanned.value))

        let destCountry = searchName(inputBarcode.value).dest_country  as any
        cardData.value = searchName(inputBarcode.value)
        if(destCountry ) {
          destCountry = searchCountry(destCountry)

        }


        greet(destCountry ?? 'No Data')
        lastEnter.value = inputBarcode.value
        inputBarcode.value = ''
      }
    }

    function searchName(barcode: string) {
      let dataFilter = [...unbaggedData.value].map((x: Unbagged,i: number) => {
        return x.order_group
      }) as any

      dataFilter = [].concat.apply([], dataFilter);
      dataFilter = dataFilter.filter((x: Bagged) => x.orders && x.orders.some((y: Order) => y.orderCode === barcode))

      if(dataFilter && dataFilter.length > 0) {
        const mainData = dataFilter[0] as Bagged

        return {
          dest_country: mainData.dest_country,
          dest_port: mainData.dest_port,
          group_name: mainData.group_name
        }
      } else {
        return {}
      }
    }

    function searchCountry(countryCode: string) {
      const filterCountry = ([...countryCodes.value].filter((x: CountryCode) => x.value === countryCode))[0]
      return filterCountry?.name ?? 'No Data'
    }

    function validationCard(params?: {isText?: Boolean}) {

      const isNew = allScanned.value.some((x: any) => x.new)

      if(!params?.isText) {
        if(
          allScanned.value &&
          allScanned.value.length &&
          searchName(lastEnter.value)?.dest_country
        ) {
          return 'green'
        } else {
          return 'red'
        }
      }
      if(params?.isText) {
        if(
          allScanned.value &&
          allScanned.value.length &&
          searchName(lastEnter.value) &&
          isNew
        ) {
          return 'white--text'
        } else {
          return ''
        }
      }
      // return allScanned.value && allScanned.value.length && allScanned.value[allScanned.value.length - 1]
    }

    function greet (text: string) {
      // it should be 'craic', but it doesn't sound right
      speech.value.greetingSpeech.text = text
      speech.value.greetingSpeech.voice = speech.value.voiceList[speech.value.selectedVoice]
      speech.value.synth.speak(speech.value.greetingSpeech)
    }
    function listenForSpeechEvents () {
      speech.value.greetingSpeech.onstart = () => {
        speech.value.isLoading = true
      }
      speech.value.greetingSpeech.onend = () => {
        speech.value.isLoading = false
      }
    }

    const fetchCountryCodes = async () => {
      try {
        $fetchState.pending = true

        await storeFilters.dispatch('filters/getCountryCodes', {
          params: { isActive: true },
        })
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }

    async function fetchBags () {

      try {
        $fetchState.pending = true
        await storeBagging.dispatch('bagging/bagging/getBags')
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }

    const { $fetchState, fetch } = useFetch(async () => {
      await fetchBags()
      await fetchCountryCodes()
      speech.value.voiceList = speech.value.synth.getVoices()
      speech.value.synth.onvoiceschanged = () => {
      speech.value.voiceList = speech.value.synth.getVoices()
        setTimeout(() => {
          speech.value.isLoading = false
        }, 800)
      }
      listenForSpeechEvents()
    })

    function disabledCloseBag() {
      return !allScanned.value.some((x: any) => x.new)
    }
    const actionCard = {
      deleteItem: () => {
        console.log('test')
      },
      addItem: () => {
        console.log('add')
      },
      toggleConfirm: (params?: {data?: Bagged, isBulk?: Boolean}) => {
        dialogSettings.value = {
          loading: false,
          title: 'Delete {orderID} now ?',
          content: '',
          cancelText: 'No',
          submitText: 'Yes',
          submitColor: 'error',
        }
        if(params?.isBulk) {
          dialogSettings.value.title = 'Delete {group_name} now ?'
        }
        dialog.value.confirm = true
      },
      handleCancel: () => {
        dialogSettings.value = {
          loading: false,
          title: '',
          content: '',
          cancelText: '',
          submitText: '',
          submitColor: '',
        }
        dialog.value.confirm = false
      }
    }

    useMeta(() => ({ title: 'Partner Portal | Edit' }))

    return {
      handleStop,
      submit,
      dialog,
      dialogSettings,
      handleBagScanBag,
      inputBarcode,
      enterInput,
      allScanned,
      validationCard,
      cardData,
      searchCountry,
      disabledCloseBag,
      alert,

      actionCard
    }
  },
  head: {},
})
</script>

<style lang="scss">
.editComplete {
  .list-custom {
    min-height: unset;
    padding: unset
  }
  .custom-icon-bagging {
    cursor: pointer;
    &:hover {
      .v-icon {
        color: rgb(255, 111, 111) !important
      }
    }
  }
}
</style>
