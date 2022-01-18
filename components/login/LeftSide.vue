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
          @submit.stop.prevent="userLogin"
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
              class="rounded-0"
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
              class="rounded-0"
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
            v-if="stateOfAlert.isShow && invalid"
            type="error"
            class="text-capitalize"
          >
            {{ stateOfAlert.message }}
          </v-alert>
        </ValidationObserver>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mapState, mapMutations } from 'vuex'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default defineComponent({
  name: 'LeftSide',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      loading: false,
      isShowPassword: false,
      form: {
        email: '',
        password: '',
      },
    }
  },
  computed: {
    ...mapState('applications', { stateOfAlert: 'alert' }),
  },
  methods: {
    ...mapMutations('applications', {
      setAlert: 'SET_ALERT',
      resetAlert: 'RESET_ALERT',
    }),
    async userLogin() {
      try {
        this.loading = true
        this.resetAlert()

        // Check form validity before hit API endpoint
        const isValid = await (
          this.$refs.loginFormObserver as Vue & {
            validate: () => boolean
          }
        ).validate()

        if (!isValid) return

        const data = { ...this.form }
        const response = await this.$auth.loginWith('local', {
          data,
        })
        const status = response?.status

        // Throw error if user not exist
        if (status !== 200) throw response

        const { clientId, role, email } = response?.data
        const user = { clientId, role, email }

        // Set user data to local storage
        this.$auth.setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
      } catch (error) {
        this.form.password = ''
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const reset = (
          this.$refs.loginFormObserver as Vue & {
            reset: () => boolean
          }
        ).reset()
        const message =
          (error as any)?.response?.data?.message ??
          (error as any)?.response?.data?.error ??
          (error as Error)?.message

        // Show alert if login failed
        this.setAlert({
          isShow: true,
          message,
        })
      } finally {
        this.loading = false
      }
    },
  },
})
</script>
