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
            validationCard()
            ? 'green'
            : 'white'
          }`"
          min-height="500px"
          :class="`${
            validationCard()
            ?
            'white--text'
            :
            ''
          } pa-15 d-flex flex-column align-center justify-center`"
        >
          <div
            v-if="validationCard()"
            class="text-center"
          >
            <div class="text-h1 font-weight-bold mb-15">
              <!-- SINGAPORE - 1 -->
              {{allScanned[allScanned.length - 1]}}
            </div>
            <div class="text-h2">
              <!-- LUWDASLDKM123123 -->
              {{allScanned[allScanned.length - 1]}}
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
      @doSubmit="submit({isCancel: true})"
    />
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
import { VuexModuleFilters, Statuses } from '~/types/filters'

export default defineComponent({
  name: 'ScanPages',
  middleware: 'partner',
  setup() {
    const router = useRouter()
    const storeApplications = useStore<VuexModuleApplications>()
    const inputBarcode = ref('')
    const allScanned = ref([]) as Ref<any>
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


    async function submit(params: {isCancel?: boolean}) {
      try {
        dialogSettings.value.loading = true

        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'success',
          message: 'Print label successfully!',
        })
      } catch (error) {

        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'error',
          message: `Print label ${'error'}`,
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
    function handleCancel() {
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
        allScanned.value = [
          ...allScanned.value,
          inputBarcode.value
        ]
        inputBarcode.value = ''
      }
    }

    function validationCard() {
      return allScanned.value && allScanned.value.length && allScanned.value[allScanned.value.length - 1]
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
      validationCard
    }
  },
  head: {},
})
</script>

<style lang="scss">
.scanPage {
}
</style>
