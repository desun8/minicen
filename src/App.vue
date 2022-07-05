<script setup lang="ts">
import ItemList from "./components/ItemList.vue";
import ModalCitySelect from "./components/ModalCitySelect.vue";
import TheHeader from "./components/TheHeader.vue";
</script>

<template>
  <div class="max-w-screen-sm mx-auto px-6">
    <the-header></the-header>
    <modal-city-select></modal-city-select>
    <item-list></item-list>
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
