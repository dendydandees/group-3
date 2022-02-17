<template>
  <section class="pa-4 pa-md-10 py-8">
    <BaseHeadlinePage
      title="Manage Incoming Orders"
      subtitle="View the details of each order or make changes to a incoming order."
    >
    </BaseHeadlinePage>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'OrdersIncomingPages',
  middleware: 'partner',
  setup() {},
})
</script>
