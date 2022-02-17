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
              <v-expand-transition>
                <v-alert
                  v-if="alert.isShow && alert.message.includes('Password')"
                  :type="alert.type"
                  tile
                  class="mb-10"
                >
                  {{ alert.message }}
                </v-alert>
              </v-expand-transition>

              <!-- Old password field -->
              <ValidationProvider
                v-slot="{ errors }"
                slim
                name="Old Password"
                rules="required|min:8|max:16"
                tag="div"
                class="mb-4"
              >
                <v-text-field
                  v-model="form.oldPassword"
                  :error-messages="errors"
                  :append-icon="
                    formSettings.isShowOldPassword ? 'mdi-eye-off' : 'mdi-eye'
                  "
                  :type="formSettings.isShowOldPassword ? 'text' : 'password'"
                  label="Old Password"
                  placeholder="Enter your old password..."
                  required
                  outlined
                  @click:append="
                    formSettings.isShowOldPassword =
                      !formSettings.isShowOldPassword
                  "
                />
              </ValidationProvider>

              <!-- New Password field -->
              <ValidationProvider
                v-slot="{ errors }"
                slim
                name="New Password"
                rules="required|min:8|max:16"
                vid="confirm"
                tag="div"
                class="mb-4"
              >
                <v-text-field
                  v-model="form.newPassword"
                  :error-messages="errors"
                  :append-icon="
                    formSettings.isShowNewPassword ? 'mdi-eye-off' : 'mdi-eye'
                  "
                  :type="formSettings.isShowNewPassword ? 'text' : 'password'"
                  label="New Password"
                  placeholder="Enter your new password..."
                  required
                  outlined
                  @click:append="
                    formSettings.isShowNewPassword =
                      !formSettings.isShowNewPassword
                  "
                />
              </ValidationProvider>

              <!-- Confirmation password field -->
              <ValidationProvider
                v-slot="{ errors }"
                slim
                name="Confirmation Password"
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
  Ref,
  useStore,
  computed,
  ComputedRef,
  reactive,
} from '@nuxtjs/composition-api'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
// Interface and types
import { Alert, VForm, VuexModuleApplications } from '~/types/applications'
import { ResetPasswordParams, VuexModuleProfiles } from '~/types/profiles'

export default defineComponent({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  setup() {
    // Using applications store
    const storeOfApplications = useStore<VuexModuleApplications>()
    const storeOfProfile = useStore<VuexModuleProfiles>()
    const stateOfApplicationsModule = storeOfApplications.state.applications
    const alert = computed(
      () => stateOfApplicationsModule.alert
    ) as ComputedRef<Alert>
    const setAlert = (value: Alert) => {
      storeOfApplications.commit('applications/SET_ALERT', value)
    }
    const resetAlert = () => {
      storeOfApplications.commit('applications/RESET_ALERT')
    }
    const doResetPassword = async (body: ResetPasswordParams) => {
      return await storeOfProfile.dispatch('profiles/resetPassword', {
        body,
      })
    }

    // Manage form
    const formSettings = reactive({
      loading: false,
      isShowOldPassword: false,
      isShowNewPassword: false,
      isShowConfirmationPassword: false,
    })
    const form = ref({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    const updatePasswordFormObserver = ref(null) as unknown as Ref<VForm>
    const doSubmit = async () => {
      try {
        formSettings.loading = true
        resetAlert()

        // Check form validity
        const isValid = await updatePasswordFormObserver?.value?.validate()

        if (!isValid) return

        const data = {
          newPassword: form.value.newPassword,
          oldPassword: form.value.oldPassword,
        }
        const response = await doResetPassword(data)

        if (!response?.ID) throw response

        form.value = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        }
        await updatePasswordFormObserver?.value?.reset()
        setAlert({
          isShow: true,
          type: 'success',
          message: `Password successfully updated!`,
        })
        await storeOfApplications.dispatch('applications/logout')
      } catch (error) {
        const message =
          (error as any)?.response?.data?.message ??
          (error as any)?.response?.data?.error ??
          (error as Error)?.message

        setAlert({
          isShow: true,
          type: 'error',
          message: `Password ${message}`,
        })
      } finally {
        formSettings.loading = false
      }
    }
    const doReset = async () => {
      form.value = {
        oldPassword: '',
        newPassword: '',
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
