<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseHeadlinePage title="Manage Profile" />

    <!-- Profile information -->
    <client-only>
      <v-expand-x-transition>
        <ProfilesInformations :user="user" @show="doShowChangePasswordForm" />
      </v-expand-x-transition>

      <BaseLoading slot="placeholder" />
    </client-only>

    <!-- The next features -->
    <!-- Update password form -->
    <v-expand-transition>
      <ProfilesManagePassword v-if="false" :data="user" />
    </v-expand-transition>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ProfilePages',
  layout: 'default',
  setup() {
    const user = ref({})
    const showChangePasswordForm = ref(false)
    const doShowChangePasswordForm = () =>
      (showChangePasswordForm.value = !showChangePasswordForm.value)

    onMounted(() => {
      user.value = JSON.parse(localStorage.getItem('user') ?? '')
    })

    return {
      user,
      showChangePasswordForm,
      doShowChangePasswordForm,
    }
  },
})
</script>
