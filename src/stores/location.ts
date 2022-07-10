import { defineStore } from "pinia";
import { ref } from "vue";
import { City, CityWithTradePoint, getCities } from "../api/getCities";

export const useLocationState = defineStore("location", () => {
  const initCity = localStorage.getItem("city");
  const initTradePoint = localStorage.getItem("tradePoint");

  const city = ref<City>();
  const citiesList = ref<CityWithTradePoint[]>();
  const tradePoint = ref<number>();

  if (initCity) {
    city.value = JSON.parse(initCity);
  }

  if (initTradePoint) {
    tradePoint.value = +initTradePoint;
  }

  const getCitiesList = async () => {
    citiesList.value = await getCities();
  };

  const setCity = (value: City) => {
    city.value = value;
    localStorage.setItem("city", JSON.stringify(value));
  };
  const setTradePoint = (value: number) => {
    tradePoint.value = value;
    localStorage.setItem("tradePoint", `${value}`);
  };

  return {
    city,
    citiesList,
    tradePoint,
    getCitiesList,
    setCity,
    setTradePoint,
  };
});
