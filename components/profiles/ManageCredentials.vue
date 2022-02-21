<template>
  <article>
    <v-row class="mt-8">
      <v-col cols="12" md="4">
        <BaseFeatureTitle
          title="Key Credentials"
          subtitle="Generate a new credentials or revoke the existing credentials."
        />
      </v-col>

      <v-col cols="12" md="8">
        <v-card tile color="white" elevation="0">
          <v-card-text>
            <v-alert tile type="warning">
              Your secret key grants you access to our API. Treat your API key
              like a passwords, don't expose them in your application code and
              don't share it on Github or anywhere else online.
            </v-alert>

            <!-- client id -->
            <div>
              <v-subheader class="subtitle-1"> Client ID </v-subheader>

              <v-expand-transition>
                <v-alert
                  v-if="alert.isShow && alert.message.includes('ID')"
                  tile
                  dismissible
                  :type="alert.type"
                >
                  {{ alert.message }}
                </v-alert>
              </v-expand-transition>

              <v-text-field
                v-model="user.clientId"
                single-line
                outlined
                readonly
                :success="alert.message.includes('ID')"
                append-icon="mdi-content-copy"
                type="text"
                label="Client ID"
                class="my-4"
                @click:append="doCopy(user.clientId, 'id')"
              />
            </div>

            <v-divider class="my-6" />

            <!-- key list -->
            <div>
              <v-subheader class="subtitle-1">
                Key Credentials List
              </v-subheader>

              <!-- alert user actions (clipboard, revoke, generate key) -->
              <v-expand-transition>
                <v-alert
                  v-if="alert.isShow && alert.message.includes('Key')"
                  tile
                  dismissible
                  :type="alert.type"
                >
                  {{ alert.message }}
                </v-alert>
              </v-expand-transition>

              <BaseLoading v-if="$fetchState.pending" color="primary" />

              <!-- if credentials key is empty -->
              <template v-if="credentials.length === 0">
                <h2 class="text-center mt-6 subtitle-1">No keys available</h2>
              </template>

              <template v-else>
                <v-scroll-x-transition>
                  <ProfilesCredentialList
                    v-if="!$fetchState.pending"
                    :credentials="credentials"
                    :status="status"
                    @doCopy="doCopy"
                    @toggleConfirmRevoke="toggleConfirmRevoke"
                  />
                </v-scroll-x-transition>

                <v-pagination
                  :value="pagination.page"
                  :disabled="status.copied"
                  :length="metaCredentials.totalPage"
                  :total-visible="7"
                  class="my-6"
                  @input="changePagination"
                />
              </template>
            </div>
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-spacer />

            <v-btn
              tile
              depressed
              outlined
              color="primary"
              :disabled="$fetchState.pending || status.copied"
              :loading="$fetchState.pending"
              @click="toggleGenerateKey"
            >
              Generate new key
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal confirm -->
    <BaseModalConfirm
      v-model="dialog.confirm"
      :dialog-settings="dialogSettings"
      @doSubmit="doRevoke"
    />

    <!-- Modal form -->
    <BaseModalForm
      v-model="dialog.form"
      :dialog-settings="dialogSettings"
      @doSubmit="doGenerateKey"
    >
      <template #modalFields>
        <ProfilesGenerateKeyFields v-model="form" />
      </template>
    </BaseModalForm>
  </article>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  useStore,
  useFetch,
  computed,
  ref,
  Ref,
  watch,
  useContext,
} from '@nuxtjs/composition-api'
import { useClipboard } from '@vueuse/core'
// Interfaces and types
import { ModalConfirm, VuexModuleApplications } from '~/types/applications'
import { VuexModuleProfiles } from '~/types/profiles'

export default defineComponent({
  setup() {
    const { $auth } = useContext()
    const user = computed(() => $auth.$storage.getUniversal('user'))
    // manage store
    const storeProfiles = useStore<VuexModuleProfiles>()
    const storeApplications = useStore<VuexModuleApplications>()
    const alert = computed(() => storeApplications.state.applications.alert)
    const credentials = computed(() => storeProfiles.state.profiles.credentials)
    const metaCredentials = computed(() => storeProfiles.state.profiles.meta)
    const pagination = computed({
      get() {
        return { ...storeApplications.state.applications.pagination }
      },
      set(value) {
        storeApplications.commit('applications/SET_PAGINATION', value)
      },
    })

    // manage pagination
    pagination.value = {
      page: 1,
      perPage: 5,
    }
    const changePagination = (value: number) => {
      storeApplications.commit('applications/SET_PAGINATION', {
        ...storeApplications.state.applications.pagination,
        page: value,
      })
      fetch()
    }

    // manage clipboard
    const { text, copy, copied, isSupported } = useClipboard()
    const status = reactive({
      text,
      copied,
      isSupported,
    })
    const doCopy = (data: string, section: string) => {
      const defaultMessage = 'successfully copied!'
      const message =
        section === 'id'
          ? `Client ID ${defaultMessage}`
          : `Key ${defaultMessage}`

      storeApplications.commit('applications/SET_ALERT', {
        isShow: true,
        type: 'success',
        message,
      })
      copy(data)

      setTimeout(() => {
        storeApplications.commit('applications/RESET_ALERT')
      }, 3000)
    }

    // manage modal
    const selected = ref('')
    const form = ref({
      keyName: '',
    })
    const dialog = ref({
      confirm: false,
      form: false,
    })
    const dialogSettings = ref({
      loading: false,
      title: '',
      content: '',
      cancelText: '',
      submitText: '',
      submitColor: '',
    }) as Ref<ModalConfirm>

    watch(
      () => dialog,
      (newValue) => {
        if (newValue.value.confirm !== false || newValue.value.form !== false)
          return

        selected.value = ''
        form.value = {
          keyName: '',
        }
        dialogSettings.value = {
          loading: false,
          title: '',
          content: '',
          cancelText: '',
          submitText: '',
          submitColor: '',
        }
      },
      { deep: true }
    )

    // manage revoke key credentials
    const toggleConfirmRevoke = (id: string) => {
      selected.value = id
      dialogSettings.value = {
        loading: false,
        title: 'Are you sure ?',
        content:
          'You are going to revoke the credential key, revoked credential keys will not be able to use our API',
        cancelText: 'Cancel',
        submitText: 'Revoke',
        submitColor: 'error',
      }
      dialog.value.confirm = true
    }
    const doRevoke = async () => {
      try {
        dialogSettings.value.loading = true
        // call rest endpoint to revoke key
        const response = await storeProfiles.dispatch('profiles/revokeKey', {
          id: selected.value,
        })

        if (!response?.revokedAt) throw response

        await storeProfiles.dispatch('profiles/getCredentials', {
          params: pagination.value,
        })
        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'success',
          message: 'Key successfully revoked!',
        })
      } catch (error) {
        const message =
          (error as any)?.response?.data?.message ??
          (error as any)?.response?.data?.error ??
          (error as Error)?.message

        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'error',
          message: `Key ${message}`,
        })
      } finally {
        dialogSettings.value.loading = false
        dialog.value.confirm = false
        setTimeout(() => {
          storeApplications.commit('applications/RESET_ALERT')
        }, 3000)
      }
    }

    // manage generate a new key
    const toggleGenerateKey = () => {
      dialogSettings.value = {
        loading: false,
        title: 'Generate new key credentials',
        content: '',
        cancelText: 'Cancel',
        submitText: 'Submit',
        submitColor: 'primary',
      }
      dialog.value.form = true
    }
    const doGenerateKey = async () => {
      try {
        dialogSettings.value.loading = true
        // call endpoint to generate a new key
        const response = await storeProfiles.dispatch('profiles/generateKey', {
          body: form.value,
        })
        const { token } = response

        if (!token) throw response

        await storeProfiles.dispatch('profiles/getCredentials', {
          params: pagination.value,
        })
        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'success',
          message: 'Successfully generating a new Key Credential!',
        })
        dialog.value.form = false
      } catch (error) {
        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'error',
          message:
            'Generating a new credential key failed because the generated credential key already exists!',
        })
      } finally {
        dialogSettings.value.loading = false
        setTimeout(() => {
          storeApplications.commit('applications/RESET_ALERT')
        }, 3000)
      }
    }

    const { fetch } = useFetch(async () => {
      await storeProfiles.dispatch('profiles/getCredentials', {
        params: pagination.value,
      })
    })

    return {
      user,
      alert,
      credentials,
      metaCredentials,
      pagination,
      changePagination,
      doCopy,
      status,
      selected,
      dialog,
      dialogSettings,
      toggleConfirmRevoke,
      doRevoke,
      form,
      toggleGenerateKey,
      doGenerateKey,
    }
  },
})
</script>
