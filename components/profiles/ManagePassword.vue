<template>
  <v-expand-transition>
    <v-row>
      <v-col cols="12" md="4">
        <BaseFeatureTitle
          title="Update Password"
          subtitle="Ensure your account is using along, random password to stay secure."
        />
      </v-col>

      <v-col cols="12" md="8">
        <v-card tile color="white" elevation="0">
          <!-- Form -->
          <ValidationObserver
            ref="updatePasswordFormObserver"
            v-slot="{ invalid }"
            tag="form"
            @submit.stop.prevent="doSubmit"
          >
            <v-card-text>
              <!-- Success and error messages -->
              <v-alert
                v-if="alert.isShow && invalid"
                tile
                type="error"
                class="text-capitalize mb-10"
              >
                {{ alert.message }}
              </v-alert>

              <!-- Email field -->
              <ValidationProvider
                v-slot="{ errors }"
                slim
                name="Email Address"
                rules="required|email"
                tag="div"
                class="my-4"
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
                  disabled
                />
              </ValidationProvider>

              <!-- Password field -->
              <ValidationProvider
                v-slot="{ errors }"
                slim
                name="Password"
                rules="required|min:8|max:16"
                vid="confirm"
                tag="div"
                class="mb-4"
              >
                <v-text-field
                  v-model="form.password"
                  :error-messages="errors"
                  :append-icon="
                    formSettings.isShowPassword ? 'mdi-eye-off' : 'mdi-eye'
                  "
                  :type="formSettings.isShowPassword ? 'text' : 'password'"
                  label="Password"
                  placeholder="Enter your password..."
                  required
                  outlined
                  @click:append="
                    formSettings.isShowPassword = !formSettings.isShowPassword
                  "
                />
              </ValidationProvider>

              <!-- Confirmation password field -->
              <ValidationProvider
                v-slot="{ errors }"
                slim
                name="Password"
                rules="required|confirmed:confirm"
                tag="div"
                class="mb-4"
              >
                <v-text-field
                  v-model="form.confirmPassword"
                  :error-messages="errors"
                  :append-icon="
                    formSettings.isShowConfirmationPassword
                      ? 'mdi-eye-off'
                      : 'mdi-eye'
                  "
                  :type="
                    formSettings.isShowConfirmationPassword
                      ? 'text'
                      : 'password'
                  "
                  label="Confirmation Password"
                  placeholder="Enter your confirmation password..."
                  required
                  outlined
                  @click:append="
                    formSettings.isShowConfirmationPassword =
                      !formSettings.isShowConfirmationPassword
                  "
                />
              </ValidationProvider>
            </v-card-text>

            <!-- Submit and reset form -->
            <v-card-actions class="pa-4">
              <v-spacer />

              <v-btn
                tile
                depressed
                text
                :disabled="formSettings.loading"
                :loading="formSettings.loading"
                class="mx-2"
                @click="doReset"
              >
                Reset
              </v-btn>

              <v-btn
                tile
                depressed
                color="primary"
                type="submit"
                :disabled="invalid || formSettings.loading"
                :loading="formSettings.loading"
              >
                Submit
              </v-btn>
            </v-card-actions>
          </ValidationObserver>
        </v-card>
      </v-col>
    </v-row>
  </v-expand-transition>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  PropType,
  Ref,
  useStore,
  computed,
  ComputedRef,
  reactive,
} from '@nuxtjs/composition-api'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
// Interface and types
import { User } from '~/types/login'
import { Alert, VForm, VuexModuleApplications } from '~/types/applications'

export default defineComponent({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    data: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  setup(props) {
    // Using applications store
    const store = useStore<VuexModuleApplications>()
    const stateOfApplicationsModule = store.state.applications
    const alert = computed(
      () => stateOfApplicationsModule.alert
    ) as ComputedRef<Alert>
    const setAlert = (value: Alert) => {
      store.commit('applications/SET_ALERT', value)
    }
    const resetAlert = () => {
      store.commit('applications/RESET_ALERT')
    }

    const formSettings = reactive({
      loading: false,
      isShowPassword: false,
      isShowConfirmationPassword: false,
    })
    const form = ref({
      email: props.data.email,
      password: '',
      confirmPassword: '',
    })

    // Form obeserver
    const updatePasswordFormObserver = ref(null) as unknown as Ref<VForm>

    // Submit form method
    const doSubmit = async () => {
      try {
        formSettings.loading = true
        resetAlert()

        // Check form validity
        const isValid = await updatePasswordFormObserver?.value?.validate()

        if (!isValid) return

        const data = {
          email: form.value.email,
          password: form.value.password,
        }

        return data
      } catch (error) {
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
        formSettings.loading = false
      }
    }

    // Reset form method
    const doReset = async () => {
      form.value = {
        email: props.data.email,
        password: '',
        confirmPassword: '',
      }

      await updatePasswordFormObserver?.value?.reset()
    }

    return {
      alert,
      formSettings,
      form,
      updatePasswordFormObserver,
      doSubmit,
      doReset,
    }
  },
})
</script>
