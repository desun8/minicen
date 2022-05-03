<script setup lang="ts">
import ItemList from "./components/ItemList.vue";
import ModalCitySelect from "./components/ModalCitySelect.vue";
</script>

<template>
  <modal-city-select></modal-city-select>
  <item-list></item-list>
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
