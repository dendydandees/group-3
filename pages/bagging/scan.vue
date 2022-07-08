<template>
  <section class="pa-4 pa-md-10 py-8 scanPage">

    <v-row align="center" justify="end">
      <div
        :style="'width: 30%'"
      >
        <v-text-field
          v-model="inputBarcode"
          clearable
          outlined
          dense
          rounded
          single-line
          hide-details
          label="Input Barcode"
          placeholder="Enter your barcode..."
          background-color="white"
          type="search"
          class="input-filter mr-3"
          @keydown="enterInput"
        />
      </div>
      <v-btn
        color="green"
        min-width="200px"
        class="mr-3 white--text"
        :disabled="disabledCloseBag()"
        @click="handleBagScanBag"
      >
        <v-icon
          class="mr-2"
          small
        >
          mdi-bag-suitcase-outline
        </v-icon>
        CLOSE BAG
      </v-btn>
      <v-btn
        color="primary"
        min-width="200px"
        @click="handleStop"
      >
        <v-icon
        small
          class="mr-2"
        >
          mdi-block-helper
        </v-icon>
        STOP SCAN
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
          :color="`${
            allScanned.length && allScanned.some((x) => x.new)
            ? validationCard()
            : 'white'
            // validationCard()
            // ? 'green'
            // : 'white'
          }`"
          min-height="500px"
          :class="`${
            validationCard({isText: true})
            // validationCard()
            // ?
            // 'white--text'
            // :
            // ''
          } pa-15 d-flex flex-column align-center justify-center`"
        >
          <div
            v-if="allScanned.length && allScanned.some((x) => x.new)"
            class="text-center"
          >
            <div class="text-h1 font-weight-bold mb-15">
              <!-- SINGAPORE - 1 -->
              {{searchCountry(cardData.dest_country)}}
            </div>
            <div class="text-h2">
              <!-- LUWDASLDKM123123 -->
              {{cardData.group_name}}
            </div>
          </div>
          <div
            v-else
            class="text-center"
          >
            <div class="text-h1 font-weight-bold">
              PLEASE SCAN ITEM
            </div>
          </div>
        </v-card>

      </v-col>
    </v-row>
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
import { VuexModuleDetailBagging, FilterBagging, Unbagged, InputPostBag, Order, Bagged, InputLabelBags} from '~/types/bagging/bagging'

export default defineComponent({
  name: 'ScanPages',
  layout: 'default',
  setup() {
    const { app, $dateFns } = useContext()
    const router = useRouter()
    const storeApplications = useStore<VuexModuleApplications>()
    const storeFilters = useStore<VuexModuleFilters>()
    const storeBagging = useStore<VuexModuleDetailBagging>()
    const alert = computed(() => storeApplications.state.applications.alert)
    const unbaggedData = computed(() => ((storeBagging.state.bagging as any).bagging.unbagged))
    const countryCodes = computed(() => storeFilters.state.filters.countryCodes)
    const inputBarcode = ref('')
    const user = localStorage.getItem('auth.user') ? JSON.parse(localStorage.getItem('auth.user') as string) : {}

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
      if(!localStorage.getItem(`newScanned.${user.email}`) || (!user && !user.email)) {
        return []
      } else {
        return localStorage.getItem(`newScanned.${user.email}`) ? JSON.parse(localStorage.getItem(`newScanned.${user.email}`) as string) : []
      }
    })

    onMounted(() => {
      const temp = newScanned.value.map((x: any) => {
        return {
          ...x,
          new: false
        }
      })
      localStorage.setItem(`newScanned.${user.email}`, JSON.stringify( temp))

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
        const returnLabels =  await Promise.all(
          payloadArr.map(async (el: InputPostBag) => {
            try {
              const returnPostBag = await storeBagging.dispatch(
                'bagging/bagging/postBags',
                {payload: el}
              )
              if(
                returnPostBag &&
                Object.keys(returnPostBag).length > 0 &&
                returnPostBag.id &&
                returnPostBag.group_name
              ) {
                const label = await postLabelBags({bag_id: returnPostBag.id, group_name: returnPostBag.group_name})
                // if(!params?.isCancel && label) await window.open(label, '_self')
                return label
              }
            } catch (error) {
              return error
            }
          })
        )
        app.$customUtils.multiDownload(returnLabels);
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
        const initialData = user && user.email && localStorage.getItem(`newScanned.${user.email}`) ? JSON.parse(localStorage.getItem(`newScanned.${user.email}`) as string) : allScanned.value

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
        localStorage.setItem(`newScanned.${user.email}`, JSON.stringify( allScanned.value))

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

    async function postLabelBags (payload: InputLabelBags) {

      try {
        $fetchState.pending = true
        return await storeBagging.dispatch('bagging/bagging/postLabelBags', {payload})
      } catch (error) {
        return error
      } finally {
        $fetchState.pending = false
      }
    }

    useMeta(() => ({ title: 'Client Portal | Scan' }))

    return {
      handleStop,
      handleCancel,
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
      alert
    }
  },
  head: {},
})
</script>

<style lang="scss">
.scanPage {
}
</style>
