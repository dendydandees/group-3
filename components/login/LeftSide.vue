<template>
  <div>
    <div class="mb-8">
      <NuxtImg
        src="/images/Luwjistik Logo FA-01.png"
        format="webp"
        class="d-inline-block"
        style="width: 125px"
        preload
      />
    </div>

    <div class="mb-15">
      <h1 class="primary--text font-weight-bold text-h4 mb-4">Welcome Back!</h1>

      <span>Login with your account!</span>
    </div>

    <div>
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
          class="mb-2"
        >
          <v-text-field
            v-model="form.email"
            :error-messages="errors"
            label="Email Address"
            placeholder="Enter your email address..."
            type="email"
            required
            outlined
            rounded
            single-line
            autocomplete
          />
        </ValidationProvider>

        <!-- Password field -->
        <ValidationProvider
          v-slot="{ errors }"
          slim
          name="Password"
          rules="required"
          tag="div"
          class="mb-2"
        >
          <v-text-field
            v-model="form.password"
            :error-messages="errors"
            :append-icon="isShowPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="isShowPassword ? 'text' : 'password'"
            label="Password"
            placeholder="Enter your password..."
            single-line
            required
            rounded
            outlined
            @click:append="isShowPassword = !isShowPassword"
          />
        </ValidationProvider>

        <v-btn
          block
          x-large
          rounded
          color="primary"
          type="submit"
          class="mr-4 my-8"
          :disabled="invalid"
          :loading="loading"
        >
          Login
        </v-btn>

        <v-alert
          v-if="alert.isShow && invalid"
          :type="alert.type"
          rounded="xl"
          class="text-capitalize"
        >
          {{ alert.message }}
        </v-alert>
      </ValidationObserver>
    </div>

    <div
      v-if="false"
    >
      <NuxtLink to="#" class="text-decoration-none secondary--text">
        Forgot Password ?
      </NuxtLink>

      <p class="mt-4">
        Don't have an account ?
        <NuxtLink to="#" class="text-decoration-none secondary--text">
          Register
        </NuxtLink>
      </p>
    </div>
  </div>
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
import { Alert, VuexModuleApplications, VForm } from '@/types/applications'

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

        const { clientId, role, email, partnerProfiles } = response?.data
        const user = {
          clientId,
          role: role.toLowerCase().replaceAll('_', ' '),
          email,
          partnerProfiles,
        }

        // Set user data to local storage
        $auth.setUser(user)
        $auth.$storage.setUniversal('user', user)
      } catch (error) {
        form.password = ''
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await loginFormObserver?.value?.reset()
        const message =
          (error as any)?.response?.data?.message ??
          (error as any)?.response?.data?.error ??
          (error as Error)?.message

        // Show alert if login failed
        setAlert({
          isShow: true,
          type: 'error',
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
