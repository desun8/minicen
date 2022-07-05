import { defineStore } from "pinia";
import { ref } from "vue";
import { City } from "../api/getCities";

export const useLocationState = defineStore("location", () => {
  const city = ref<City>();
  const tradePoint = ref<number>();

  return { city, tradePoint };
});
