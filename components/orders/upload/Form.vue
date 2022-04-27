<template>
  <article>
    <v-card-text class="pa-8">
      <v-scroll-y-transition hide-on-leave>
        <v-alert
          v-if="alert.isShow"
          :type="alert.type"
          rounded="xl"
          :icon="typeof alert.message === 'string'"
        >
          <template v-if="typeof alert.message === 'string'">
            {{ alert.message }}
          </template>

          <template v-else>
            <ul v-for="(item, index) in alert.message" :key="index">
              <li>{{ item }}</li>
            </ul>
          </template>
        </v-alert>
      </v-scroll-y-transition>

      <ValidationObserver
        ref="additionalObserver"
        tag="form"
        @submit.stop.prevent="doSubmitForm"
      >
        <OrdersUploadAdditionalFields v-if="step === 0" v-model="select" />
      </ValidationObserver>

      <OrdersFilePondCSV
        ref="filePond"
        v-model="form"
        :step="step"
        @changeLoading="loading = !loading"
      />

      <span class="caption text--secondary">
        Download sample file:
        <a
          :href="`/files/orders/${exampleFile}`"
          download
          class="secondary--text text-decoration-none font-weight-bold"
        >
          {{ exampleFile }}
        </a>
      </span>
    </v-card-text>

    <v-card-actions class="pa-8">
      <v-spacer />

      <v-btn
        outlined
        color="primary"
        class="mx-2"
        :disabled="loading"
        @click="doResetForm"
      >
        Reset
      </v-btn>

      <v-btn color="primary" :loading="loading" @click="doSubmitForm">
        Upload
      </v-btn>
    </v-card-actions>
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
  name: 'UploadForm',
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

    // manage example file
    const exampleFile = computed(() =>
      props.step === 0
        ? 'sample_orders_domestic.xlsx'
        : 'sample_orders_cross_borders.xlsx'
    )

    // manage select data (additional fields)
    const additionalObserver = ref(null) as unknown as Ref<VForm>
    const select = ref({
      country: '',
    }) as Ref<Select>
    const resetSelect = () => {
      select.value = {
        country: '',
      }
    }

    // manage upload
    const loading = ref(false)
    const form = ref([]) as Ref<OrderDomestic[] | OrderCrossBorder[]>
    const filePond = ref(null) as Ref<any>
    const uploadType = computed(() =>
      props.step === 0 ? 'domestic' : 'crossBorder'
    )
    const doResetForm = () => {
      try {
        loading.value = true
        form.value = []
        filePond.value.$refs.pondOrders.removeFiles()
        additionalObserver?.value?.reset()
        resetSelect()
        storeApplications.commit('applications/RESET_ALERT')
      } catch (error) {
        return error
      } finally {
        setTimeout(() => {
          loading.value = false
        }, 1000)
      }
    }
    const doSubmitForm = async () => {
      const isValid =
        props.step === 0 ? await additionalObserver?.value?.validate() : true
      const formEmpty = form.value.length === 0
      const type = uploadType.value
      let data = form.value

      try {
        storeApplications.commit('applications/RESET_ALERT')
        loading.value = true

        if (formEmpty) throw new Error('error')
        if (!isValid) return
        // set data for domestic
        if (props.step === 0) {
          const dataDomestic = data as OrderDomestic[]

          data = dataDomestic.map((item) => ({
            ...item,
            consigneeCountry: select.value.country,
            senderCountry: select.value.country,
          }))
        }

        const response = await storeOfOrders.dispatch('orders/uploadOrders', {
          data,
          type,
        })

        if (response !== 'ok') throw response.response

        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'success',
          message: `Orders successfully uploaded!`,
        })
        setTimeout(() => {
          router.push('/orders')
        }, 2000)
      } catch (error: any) {
        const {
          data: { error: normalError = '', ErrorDetails: listError = [] } = {},
        } = error as ErrorUpload
        let message =
          `Order upload data invalid, The data contained in the file you uploaded is incorrect. Please add data according to the existing sample file!` as
            | string
            | string[]

        if (normalError) {
          message = normalError
        }

        if (listError && listError.length > 0) {
          message = listError.map((item) => item.note)
        }

        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'error',
          message,
        })
      } finally {
        setTimeout(() => {
          loading.value = false
        }, 1000)
      }
    }

    onMounted(() => {
      storeApplications.commit('applications/RESET_ALERT')
    })

    // reset form if window upload changed
    watch(
      () => props.step,
      () => {
        doResetForm()
      }
    )

    return {
      // manage store
      alert,
      // manage example file
      exampleFile,
      // manage select data
      select,
      // manage upload
      additionalObserver,
      form,
      filePond,
      loading,
      doResetForm,
      doSubmitForm,
    }
  },
})
</script>
