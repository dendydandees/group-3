<template>
  <section>Index Page</section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'IndexPage',
  layout: 'default',
  middleware({ redirect }) {
    return redirect('/group-3/idea-1')
  },
})
</script>
