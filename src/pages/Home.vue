<script setup>
import ShowGoals from '@/components/ShowGoals.vue';

</script>

<template>
  <v-row
    class="justify-md-space-around justify-sm-center align-center"
    style="height: 100vh; width: 100vw"
  >
    <v-col class="d-md-flex" cols="12" md="6" lg="3">
      <CigCounter />
    </v-col>
    <v-col class="d-md-flex" cols="12" md="6" lg="3">
      <ShowGoals />   
    </v-col>
    <v-col class="d-md-flex" cols="12" md="6" lg="3"> </v-col>
  </v-row>
</template>

<style scoped></style>
