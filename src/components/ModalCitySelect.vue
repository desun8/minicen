<script setup lang="ts">
import { onMounted, ref } from "vue";
import { CityWithTradePoint, getCities } from "../api/getCities";
import { useLocationState } from "../stores/location";

const locationState = useLocationState();

const cities = ref<CityWithTradePoint[] | null>(null);
const selectedCity = ref<CityWithTradePoint | null>(null);
const isDialogShow = ref(true);

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
  cities.value = await getCities();
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
        v-for="item in cities"
        :key="item.id"
        :label="item.name"
        :value="item"
      >
      </el-option>
    </el-select>

    <template #footer>
      <span>
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
