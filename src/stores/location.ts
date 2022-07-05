import { defineStore } from "pinia";
import { ref } from "vue";
import { City, CityWithTradePoint, getCities } from "../api/getCities";

export const useLocationState = defineStore("location", () => {
  const city = ref<City>();
  const citiesList = ref<CityWithTradePoint[]>();
  const tradePoint = ref<number>();

  const getCitiesList = async () => {
    citiesList.value = await getCities();
  };

  return { city, citiesList, tradePoint, getCitiesList };
});
