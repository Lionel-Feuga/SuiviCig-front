<script setup>
  import Header from '@/layouts/Header.vue'
</script>

<template>
  <v-app>
  <Header />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

