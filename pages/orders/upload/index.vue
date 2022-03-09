<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseBackButton @doBackTo="doBackTo" />

    <BaseHeadlinePage title="Upload Orders" />
  </section>
</template>

<script lang="ts">
import { defineComponent, useMeta, useRouter } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'UploadOrdersPages',
  setup() {
    useMeta({ titleTemplate: '%s | Upload Orders' })

    const router = useRouter()

    const doBackTo = () => {
      router.go(-1)
    }

    return {
      doBackTo,
    }
  },
  head: {},
})
</script>
