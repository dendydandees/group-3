<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseHeadlinePage
      title="Manage Profile"
      subtitle="Here are your profile details and you can do other management related to your profile."
    />

    <!-- Profile information -->
    <ProfilesInformations :user="user" />

    <!-- manage credential fetures -->
    <ProfilesManageCredentials />

    <v-divider class="my-6" />

    <!-- Manage password fetures **the next features** -->
    <ProfilesManagePassword />
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  useMeta,
  useContext,
} from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ProfilePages',
  layout: 'default',
  setup() {
    useMeta({ titleTemplate: '%s | Profiles' })
    const { $auth } = useContext()
    const user = computed(() => $auth.$storage.getUniversal('user'))

    return {
      user,
    }
  },
  head: {},
})
</script>
