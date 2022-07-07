import { defineStore } from "pinia";
import { ref } from "vue";
import { ItemPrice } from "../api/getItemPrices";

export type ItemsDetail = Map<number, ItemPrice[]>;

export const useItemsDetailState = defineStore("details", () => {
  const itemsDetail = ref<ItemsDetail>(new Map());
  const currResult = ref<ItemPrice[]>();
  const currResultName = ref<string>();
  const isLoading = ref(false);
  const dialogVisible = ref(false);

  const hasResult = (key: number) => itemsDetail.value.has(key);
  const getResult = (key: number) => {
    currResult.value = itemsDetail.value.get(key);
    return currResult;
  };
  const setResult = (key: number, value: ItemPrice[]) =>
    itemsDetail.value.set(key, value);

  return {
    itemsDetail,
    currResult,
    currResultName,
    isLoading,
    dialogVisible,
    hasResult,
    getResult,
    setResult,
  };
});
