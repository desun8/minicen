<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { CityWithTradePoint } from "../api/getCities";
import { useLocationState } from "../stores/location";
import { useModalCityState } from "../stores/modalCity";

const locationState = useLocationState();
const citiesList = computed(() => locationState.citiesList);

const modalState = useModalCityState();
const isDialogShow = computed({
  get() {
    return modalState.isShow;
  },

  set(newVal) {
    modalState.isShow = newVal;
  },
});

const selectedCity = ref<CityWithTradePoint | null>(null);

const handleSelectCity = () => {
  locationState.$patch((state) => {
    if (selectedCity.value) {
      state.city = {
        id: selectedCity.value.id,
        name: selectedCity.value.name,
        transliteration: selectedCity.value.transliteration,
      };

      state.tradePoint = selectedCity.value.tradePointId;
    }
  });

  isDialogShow.value = false;
};

onMounted(async () => {
  if (!citiesList.value) {
    await locationState.getCitiesList();
  }
});
</script>

<template>
  <el-dialog
    v-model="isDialogShow"
    title="Выберите город"
    width="50%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-select
      v-model="selectedCity"
      value-key="id"
      placeholder="Выберите город"
      filterable
    >
      <el-option
        v-for="city in citiesList"
        :key="city.id"
        :label="city.name"
        :value="city"
      >
      </el-option>
    </el-select>

    <template #footer>
      <span>
        <el-button
          v-show="locationState.city"
          type="danger"
          @click="isDialogShow = false"
          >Отменить</el-button
        >
        <el-button
          :disabled="!selectedCity"
          type="primary"
          @click="handleSelectCity"
          >Сохранить</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
