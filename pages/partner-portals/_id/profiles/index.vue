<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseBackButton @doBackTo="doBackTo" />

    <BaseHeadlinePage
      title="Manage Partner Profiles"
      subtitle="Here are the
    details of your profile as a partner and you can perform other management
    related to your partner profile."
    />

    <v-row>
      <v-col cols="12" md="4">
        <BaseFeatureTitle
          title="Edit Profile"
          subtitle="Customize your profile as a partner."
        />
      </v-col>

      <v-col cols="12" md="8">
        <v-card color="white" elevation="2">
          <ValidationObserver
            ref="editProfileFormObserver"
            v-slot="{ invalid }"
            tag="form"
            eager
            @submit.stop.prevent="doSubmitEdit"
          >
            <v-card-text class="pt-6 d-flex flex-column flex-md-row">
              <!-- Logo field -->
              <div
                class="mr-0 mr-md-10 mb-8 mb-md-0 d-flex flex-column align-center"
              >
                <v-fade-transition hide-on-leave>
                  <v-avatar
                    v-if="profiles.logo && form.logo"
                    size="140"
                    class="mb-4"
                  >
                    <img
                      :src="`data:image/png;base64,${profiles.logo}`"
                      :alt="form.name"
                      style="object-fit: cover"
                    />
                  </v-avatar>
                </v-fade-transition>

                <v-fade-transition hide-on-leave>
                  <BaseFilePondImage
                    v-show="!profiles.logo"
                    ref="filePond"
                    v-model="form.logo"
                    :style="{
                      width: $vuetify.breakpoint.mobile ? '50%' : '100%',
                    }"
                    @changeLoading="$fetchState.pending = !$fetchState.pending"
                    @changeError="errorStateUpload = $event"
                  />
                </v-fade-transition>

                <span
                  v-if="errorStateUpload"
                  style="width: 140px"
                  class="text-caption error--text text-center"
                >
                  {{ `${errorStateUpload.main} ${errorStateUpload.sub}` }}
                </span>

                <v-expand-transition>
                  <v-btn
                    v-show="!profiles.logo"
                    :loading="$fetchState.pending"
                    color="primary"
                    class="my-2"
                    @click="handlerDoBrowse"
                  >
                    Upload Logo
                  </v-btn>
                </v-expand-transition>

                <v-expand-transition>
                  <v-btn
                    v-show="form.logo"
                    outlined
                    :loading="$fetchState.pending"
                    color="error"
                    class="my-2"
                    @click="handlerDoDelete"
                  >
                    Delete Logo
                  </v-btn>
                </v-expand-transition>
              </div>

              <div style="width: 100%">
                <!-- Name partner field -->
                <ValidationProvider
                  v-slot="{ errors }"
                  slim
                  name="Partner Name"
                  rules="required"
                  tag="div"
                  class="mb-4"
                >
                  <v-text-field
                    v-model="form.name"
                    :error-messages="errors"
                    required
                    outlined
                    rounded
                    autocomplete
                    label="Partner Name"
                    placeholder="Enter your partner name..."
                    type="text"
                  />
                </ValidationProvider>

                <!-- Company brief field -->
                <ValidationProvider
                  v-slot="{ errors }"
                  slim
                  name="Company Brief"
                  tag="div"
                  class="mb-4"
                >
                  <v-textarea
                    v-model="form.description"
                    :error-messages="errors"
                    clearable
                    outlined
                    rounded
                    auto-grow
                    rows="5"
                    clear-icon="mdi-close-circle"
                    label="Company Brief"
                  />
                </ValidationProvider>
              </div>
            </v-card-text>

            <!-- Submit and reset form -->
            <v-card-actions class="pa-4">
              <v-spacer />

              <v-btn
                color="primary"
                type="submit"
                :disabled="invalid"
                :loading="$fetchState.pending"
              >
                Save Changes
              </v-btn>
            </v-card-actions>
          </ValidationObserver>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      :value="alert.isShow && alert.message.includes('Partner profile')"
      :timeout="2000"
      rounded="pill"
      right
      bottom
      :color="alert.type"
    >
      {{ alert.message }}
    </v-snackbar>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  useRouter,
  useRoute,
  useMeta,
  useStore,
  computed,
  ref,
  useFetch,
  Ref,
  PropType,
} from '@nuxtjs/composition-api'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
// Interfaces and types
import { ErrorFilePond } from '~/components/base/FilePond/Image.vue'
import { VuexModuleApplications } from '~/types/applications'
import { Profile, VuexModuleProfiles } from '~/types/partnerPortals/profiles'

export default defineComponent({
  name: 'PartnerProfilePage',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  middleware: 'partner',
  setup() {
    const route = useRoute()
    const router = useRouter()

    // store manage
    const storeApplications = useStore<VuexModuleApplications>()
    const storeProfiles = useStore<VuexModuleProfiles>()
    const alert = computed(() => storeApplications.state.applications.alert)
    const profiles = computed({
      get: () => ({
        ...storeProfiles.state.partnerPortals.profiles.profile,
      }),
      set: (value) => value,
    })

    // handler for browse and delete filePond component
    const errorStateUpload = ref({
      main: '',
      sub: '',
    }) as unknown as PropType<ErrorFilePond>
    const handlerDoBrowse = () => {
      filePond.value.$refs.pond.browse()
    }
    const handlerDoDelete = () => {
      filePond.value.$refs.pond.removeFiles()

      form.value.logo = ''
      profiles.value.logo = ''
    }

    const form = ref({}) as Ref<Profile>
    const filePond = ref(null) as Ref<any>

    const doBackTo = () => {
      router.go(-1)
    }
    const doSubmitEdit = async () => {
      const id = route.value.params.id
      form.value.slug = form.value.name.toLowerCase().replaceAll(' ', '-')

      try {
        fetchState.pending = true

        const data = {
          ...form.value,
          logo: profiles.value.logo ? null : form.value.logo,
        }
        const response = await storeProfiles.dispatch(
          'partnerPortals/profiles/editProfile',
          {
            id,
            data,
          }
        )

        if (response.name === 'Error') throw response

        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'success',
          message: `Partner profile successfully updated!`,
        })
        fetch()
      } catch (error) {
        const message = (error as any)?.response?.data?.error

        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'error',
          message: `Partner profile ${message}!`,
        })
      } finally {
        fetchState.pending = false
        setTimeout(() => {
          storeApplications.commit('applications/RESET_ALERT')
        }, 3000)
      }
    }

    const { fetchState, fetch } = useFetch(async () => {
      const id = route.value.params.id

      await storeProfiles.dispatch('partnerPortals/profiles/getProfile', id)
      form.value = { ...profiles.value }
    })

    useMeta(() => ({ title: 'Partner Portal | Partner Profiles' }))

    return {
      alert,
      filePond,
      profiles,
      form,
      errorStateUpload,
      doBackTo,
      handlerDoBrowse,
      handlerDoDelete,
      doSubmitEdit,
    }
  },
  head: {},
})
</script>
