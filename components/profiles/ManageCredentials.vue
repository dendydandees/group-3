<template>
  <v-expand-transition>
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

            <!-- list of keys -->
            <v-list>
              <template v-for="(credential, index) in credentials">
                <v-list-item :key="credential.id">
                  <v-list-item-content>
                    <v-list-item-title class="d-flex align-center">
                      <span class="font-weight-medium">
                        {{ credential.keyName }}
                      </span>

                      <span
                        :title="credential.token"
                        class="d-inline-block text-truncate"
                        :style="{
                          'max-width': $vuetify.breakpoint.smAndDown
                            ? '7rem'
                            : '15rem',
                        }"
                      >
                        --- {{ credential.token }} ---
                      </span>

                      <v-chip
                        :color="credential.revokedAt ? 'error' : 'success'"
                        small
                      >
                        {{ credential.revokedAt ? 'revoked' : 'active' }}
                      </v-chip>

                      <v-btn
                        v-if="!credential.revokedAt"
                        icon
                        depressed
                        :disabled="status.copied"
                        @click="doCopy(credential.token)"
                      >
                        <v-icon>mdi-content-copy</v-icon>
                      </v-btn>
                    </v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn
                      v-if="!credential.revokedAt"
                      tile
                      depressed
                      text
                      color="error"
                      :disabled="status.copied"
                      class="mx-2"
                      @click="$emit('toggleConfirmRevoke', credential.id)"
                    >
                      Revoke key
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>

                <v-divider v-if="index < credentials.length - 1" :key="index" />
              </template>
            </v-list>

            <v-pagination
              :value="pagination.page"
              :length="metaCredentials.totalPage"
              :total-visible="7"
              class="my-6"
              @input="changePagination"
            />
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-spacer />

            <v-btn
              tile
              depressed
              outlined
              color="primary"
              :disabled="status.copied"
            >
              Generate new key
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-expand-transition>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  useStore,
  useFetch,
  computed,
} from '@nuxtjs/composition-api'
import { useClipboard } from '@vueuse/core'
// Interfaces and types
import { VuexModuleApplications } from '~/types/applications'
import { VuexModuleCredentials } from '~/types/credentials'

export default defineComponent({
  setup() {
    // store
    const storeCredentials = useStore<VuexModuleCredentials>()
    const storeApplications = useStore<VuexModuleApplications>()
    const alert = computed(() => storeApplications.state.applications.alert)
    const credentials = computed(
      () => storeCredentials.state.credentials.credentials
    )
    const metaCredentials = computed(
      () => storeCredentials.state.credentials.meta
    )
    // manage pagination
    const pagination = computed({
      get() {
        return { ...storeApplications.state.applications.pagination }
      },
      set(value) {
        storeApplications.commit('applications/SET_PAGINATION', value)
      },
    })
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
    const doCopy = (data: string) => {
      storeApplications.commit('applications/SET_ALERT', {
        isShow: true,
        type: 'success',
        message: 'Key successfully copied!',
      })
      copy(data)

      setTimeout(() => {
        storeApplications.commit('applications/RESET_ALERT')
      }, 3000)
    }

    const { fetch } = useFetch(async () => {
      await storeCredentials.dispatch('credentials/getCredentials', {
        params: pagination.value,
      })
    })

    return {
      alert,
      credentials,
      metaCredentials,
      pagination,
      changePagination,
      doCopy,
      status,
    }
  },
})
</script>
