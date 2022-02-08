<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseHeadlinePage
      title="Manage Profile"
      subtitle="Here are your profile details and you can do other management related to your profile."
    />

    <!-- Profile information -->
    <client-only>
      <v-expand-x-transition>
        <ProfilesInformations :user="user" @show="doShowChangePasswordForm" />
      </v-expand-x-transition>

      <BaseLoading slot="placeholder" />
    </client-only>

    <!-- manage credential fetures -->
    <ProfilesManageCredentials @toggleConfirmRevoke="toggleConfirmRevoke" />

    <v-divider v-if="false" class="my-6" />

    <!-- Manage password fetures **the next features** -->
    <ProfilesManagePassword v-if="false" :data="user" />

    <!-- Modal confirm -->
    <BaseModalConfirm
      v-model="dialog"
      :dialog-settings="dialogSettings"
      @doSubmit="doRevoke"
    />
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  Ref,
  ref,
  useMeta,
  useStore,
} from '@nuxtjs/composition-api'
// Interfaces and types
import { ModalConfirm, VuexModuleApplications } from '~/types/applications'
import { VuexModuleCredentials } from '~/types/credentials'

export default defineComponent({
  name: 'ProfilePages',
  layout: 'default',
  setup() {
    useMeta({ titleTemplate: '%s | Profiles' })
    const storeApplications = useStore<VuexModuleApplications>()
    const storeCredentials = useStore<VuexModuleCredentials>()
    const user = ref({})

    // dialog options
    const selected = ref('')
    const dialog = ref(false)
    const dialogSettings = ref({}) as Ref<ModalConfirm>
    const toggleConfirmRevoke = (id: string) => {
      selected.value = id
      dialogSettings.value = {
        title: 'Are you sure ?',
        content:
          'You are going to revoke the credential key, revoked credential keys will not be able to use our API',
        cancelText: 'Cancel',
        submitText: 'Revoke',
        submitColor: 'error',
      }
      dialog.value = true
    }
    const doRevoke = async () => {
      try {
        // call rest endpoint to revoke key
        const response = await storeApplications.dispatch(
          'credentials/revokeKey',
          { id: selected.value }
        )

        if (!response?.revokedAt) throw response

        await storeCredentials.dispatch('credentials/getCredentials', {
          params: { page: 1, perPage: 5 },
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
        dialog.value = false
        setTimeout(() => {
          storeApplications.commit('applications/RESET_ALERT')
        }, 3000)
      }
    }

    // change password options
    const showChangePasswordForm = ref(false)
    const doShowChangePasswordForm = () =>
      (showChangePasswordForm.value = !showChangePasswordForm.value)

    onMounted(() => {
      user.value = JSON.parse(localStorage.getItem('user') ?? '')
    })

    return {
      user,
      selected,
      dialog,
      dialogSettings,
      toggleConfirmRevoke,
      doRevoke,
      showChangePasswordForm,
      doShowChangePasswordForm,
    }
  },
  head: {},
})
</script>
