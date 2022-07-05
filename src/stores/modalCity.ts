import { defineStore } from "pinia";
import { ref } from "vue";

export const useModalCityState = defineStore("modalCity", () => {
  const isShow = ref(true);

  return { isShow };
});
