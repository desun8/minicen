<script setup lang="ts">
import { computed } from "vue";
import { useLocationState } from "../stores/location";
import { useModalCityState } from "../stores/modalCity";

const locationState = useLocationState();
const displayText = computed(
  () => locationState.city?.name || "Выберите город"
);

const modalState = useModalCityState();
</script>

<template>
  <el-button
    class="justify-self-end hover:underline"
    :style="!locationState.city && 'opacity: 0;'"
    link
    type="primary"
    size="large"
    @click="modalState.isShow = true"
    >{{ displayText }}</el-button
  >
</template>
