<template>
  <v-row align="center">
    <v-col cols="12">
      <v-btn text small @click="$emit('doBackTo')">
        <v-icon left dark tite elevation="0"> mdi-arrow-left-thin </v-icon>
        Back
      </v-btn>
    </v-col>
  </v-row>
</template>
