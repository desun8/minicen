<script setup lang="ts">
import TheHeader from "./components/TheHeader.vue";
import TheMain from "./components/TheMain.vue";
import ModalCitySelect from "./components/ModalCitySelect.vue";
</script>

<template>
  <div class="max-w-screen-sm mx-auto px-6">
    <the-header></the-header>
    <the-main></the-main>
    <modal-city-select></modal-city-select>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

a:hover {
  text-decoration: none !important;
}
</style>
