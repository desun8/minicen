import { defineStore } from "pinia";
import { ref } from "vue";
import { Tovar } from "../api/getItemsList";

export type SearchResults = Map<string, Tovar[]>;

export const useSearchState = defineStore("search", () => {
  const search = ref<string>("");
  const searchResults = ref<SearchResults>(new Map());
  const currResult = ref<Tovar[]>();
  const isLoading = ref(false);

  const hasResult = (key: string) => searchResults.value.has(key);
  const getResult = (key: string) => {
    currResult.value = searchResults.value.get(key);
    return currResult;
  };
  const setResult = (key: string, value: Tovar[]) =>
    searchResults.value.set(key, value);

  return {
    search,
    searchResults,
    currResult,
    isLoading,
    hasResult,
    getResult,
    setResult,
  };
});
