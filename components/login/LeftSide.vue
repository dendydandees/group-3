<template>
  <v-col cols="12" md="6" class="white pa-4 pa-md-6">
    <v-row align="center" justify="center" style="min-height: 100%">
      <v-col cols="12" md="8">
        <NuxtImg
          src="/images/Luwjistik Logo FA-02.png"
          format="webp"
          height="48"
          preload
          class="mb-4"
        />

        <h1 class="display-2 font-weight-bold mb-10 mb-md-15">
          Welcome to Client Portal
        </h1>

        <!-- Login form -->
        <ValidationObserver
          ref="loginFormObserver"
          v-slot="{ invalid }"
          tag="form"
          @submit.stop.prevent="doLogin"
        >
          <!-- Email field -->
          <ValidationProvider
            v-slot="{ errors }"
            slim
            name="Email Address"
            rules="required|email"
            tag="div"
            class="mb-4"
          >
            <v-text-field
              v-model="form.email"
              :error-messages="errors"
              label="Email Address"
              placeholder="Enter your email address..."
              type="email"
              required
              outlined
              autocomplete
            ></v-text-field>
          </ValidationProvider>

          <!-- Password field -->
          <ValidationProvider
            v-slot="{ errors }"
            slim
            name="Password"
            rules="required"
            tag="div"
            class="mb-4"
          >
            <v-text-field
              v-model="form.password"
              :error-messages="errors"
              :append-icon="isShowPassword ? 'mdi-eye-off' : 'mdi-eye'"
              :type="isShowPassword ? 'text' : 'password'"
              label="Password"
              placeholder="Enter your password..."
              required
              outlined
              @click:append="isShowPassword = !isShowPassword"
            ></v-text-field>
          </ValidationProvider>

          <v-btn
            block
            x-large
            tile
            color="primary"
            type="submit"
            class="mr-4 my-8"
            :disabled="invalid || loading"
            :loading="loading"
          >
            Submit
          </v-btn>

          <v-alert
            v-if="alert.isShow && invalid"
            type="error"
            class="text-capitalize"
          >
            {{ alert.message }}
          </v-alert>
        </ValidationObserver>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  Ref,
  ref,
  defineComponent,
  reactive,
  useContext,
  useStore,
} from '@nuxtjs/composition-api'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
// Interface and type
import { Login } from '@/types/login'
import { Alert, VuexModuleApplications } from '@/types/applications'

export type VForm = Vue & {
  validate: () => boolean
  reset: () => boolean
}

export default defineComponent({
  name: 'LeftSide',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  setup() {
    const { $auth } = useContext()
    const store = useStore<VuexModuleApplications>()
    const stateOfApplicationsModule = store.state.applications
    const loginFormObserver = ref(null) as unknown as Ref<VForm>
    const alert = computed(
      () => stateOfApplicationsModule.alert
    ) as ComputedRef<Alert>
    const loading = ref(false) as Ref<boolean>
    const isShowPassword = ref(false) as Ref<boolean>
    const form = reactive({
      email: '',
      password: '',
    }) as Login
    const setAlert = (value: Alert) => {
      store.commit('applications/SET_ALERT', value)
    }
    const resetAlert = () => {
      store.commit('applications/RESET_ALERT')
    }
    const doLogin = async () => {
      try {
        loading.value = true
        resetAlert()

        // Check form validity before hit API endpoint
        const isValid = await loginFormObserver?.value?.validate()

        if (!isValid) return

        const data = { ...form }
        const response = await $auth.loginWith('local', {
          data,
        })
        const status = response?.status

        // Throw error if user not exist
        if (status !== 200) throw response

        const { clientId, role, email } = response?.data
        const user = {
          clientId,
          role: role.toLowerCase().replaceAll('_', ' '),
          initial: email.charAt(0).toUpperCase(),
          email,
        }

        // Set user data to local storage
        $auth.setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
      } catch (error) {
        form.password = ''
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const reset = await loginFormObserver?.value?.reset()
        const message =
          (error as any)?.response?.data?.message ??
          (error as any)?.response?.data?.error ??
          (error as Error)?.message

        // Show alert if login failed
        setAlert({
          isShow: true,
          message,
        })
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      isShowPassword,
      form,
      alert,
      doLogin,
      loginFormObserver,
    }
  },
})
</script>
