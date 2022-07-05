import { defineStore } from "pinia";
import { ref } from "vue";
import { ItemPrice } from "../api/getItemPrices";

export type ItemsDetail = Map<number, ItemPrice[]>;

export const useItemsDetailState = defineStore("details", () => {
  const itemsDetail = ref<ItemsDetail>(new Map());

  const hasResult = (key: number) => itemsDetail.value.has(key);
  const getResult = (key: number) => itemsDetail.value.get(key);
  const setResult = (key: number, value: ItemPrice[]) =>
    itemsDetail.value.set(key, value);

  return { itemsDetail, hasResult, getResult, setResult };
});
