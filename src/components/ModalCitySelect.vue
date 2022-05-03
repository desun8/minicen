<script setup lang="ts">
import { onMounted, ref } from "vue";
import { City, getCities } from "../api/getCities";

const cities = ref<City[]>();
const selectedCity = ref<string>("");
const isDialogShow = ref(true);

const handleSelectCity = () => {
  localStorage.setItem("city", selectedCity.value);
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
    <el-select v-model="selectedCity" placeholder="Выберите город" filterable>
      <el-option
        v-for="item in cities"
        :key="item.id"
        :label="item.name"
        :value="JSON.stringify(item)"
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
