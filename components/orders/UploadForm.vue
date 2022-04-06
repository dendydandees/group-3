<template>
  <article>
    <v-card-text class="pa-8">
      <v-expand-transition>
        <v-alert v-if="alert.isShow" :type="alert.type" rounded="xl">
          {{ alert.message }}
        </v-alert>
      </v-expand-transition>

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

// Interfaces adn types
import { VuexModuleApplications } from '~/types/applications'
import { VuexModuleOrders } from '~/types/orders'

export default defineComponent({
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

    const exampleFile = computed(() =>
      props.step === 0
        ? 'sample_orders_domestic.xlsx'
        : 'sample_orders_cross_borders.xlsx'
    )
    const uploadType = computed(() =>
      props.step === 0 ? 'domestic' : 'crossBorder'
    )

    // manage upload
    const loading = ref(false)
    const form = ref([])
    const filePond = ref(null) as Ref<any>
    const doResetForm = () => {
      try {
        loading.value = true
        filePond.value.$refs.pondOrders.removeFiles()
        form.value = []
        storeApplications.commit('applications/RESET_ALERT')
      } catch (error) {
        return error
      } finally {
        setTimeout(() => {
          loading.value = false
        }, 500)
      }
    }
    const doSubmitForm = async () => {
      try {
        storeApplications.commit('applications/RESET_ALERT')
        loading.value = true

        if (form.value.length === 0) throw new Error('error')

        const response = await storeOfOrders.dispatch('orders/uploadOrders', {
          data: form.value,
          type: uploadType.value,
        })

        if (response !== 'ok') throw response.response

        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'success',
          message: `Orders successfully uploaded!`,
        })
        setTimeout(() => {
          router.push('/orders')
        }, 1500)
      } catch (error) {
        const message =
          (error as any)?.data?.error ??
          `Order upload data invalid, The data contained in the file you uploaded is incorrect. Please add data according to the existing sample file!`

        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'error',
          message,
        })
      } finally {
        setTimeout(() => {
          loading.value = false
        }, 500)
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
      alert,
      exampleFile,
      form,
      filePond,
      loading,
      doResetForm,
      doSubmitForm,
    }
  },
})
</script>
