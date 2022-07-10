import { defineStore } from "pinia";
import { ref } from "vue";
import { useLocationState } from "./location";

export const useModalCityState = defineStore("modalCity", () => {
  const locationState = useLocationState();
  const isInitTrue = !(
    locationState.city && locationState.tradePoint !== undefined
  );

  const isShow = ref(isInitTrue);

  return { isShow };
});
