<template>
  <v-row align="center" class="mb-6">
    <v-col>
      <h1 class="headline font-weight-bold">
        {{ $attrs.title }}
        <slot name="addition" />
      </h1>
    </v-col>
  </v-row>
</template>
