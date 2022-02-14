<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseHeadlinePage
      title="Manage Profile"
      subtitle="Here are your profile details and you can do other management related to your profile."
    />

    <!-- Profile information -->
    <client-only>
      <v-expand-x-transition>
        <ProfilesInformations :user="user" />
      </v-expand-x-transition>

      <BaseLoading slot="placeholder" />
    </client-only>

    <!-- manage credential fetures -->
    <ProfilesManageCredentials />

    <v-divider class="my-6" />

    <!-- Manage password fetures **the next features** -->
    <ProfilesManagePassword :data="user" />
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  useMeta,
} from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ProfilePages',
  layout: 'default',
  setup() {
    useMeta({ titleTemplate: '%s | Profiles' })
    const user = ref({})

    onMounted(() => {
      user.value = JSON.parse(localStorage.getItem('user') ?? '')
    })

    return {
      user,
    }
  },
  head: {},
})
</script>
