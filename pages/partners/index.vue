<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseHeadlinePage
      title="Partners Details"
      subtitle="View the details of each partners."
    >
    </BaseHeadlinePage>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'PartnersPages',
  middleware: 'partner',
  setup() {},
})
</script>
