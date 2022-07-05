import { defineStore } from "pinia";
import { ref } from "vue";
import { Tovar } from "../api/getItemsList";

export type SearchResults = Map<string, Tovar[]>;

export const useSearchState = defineStore("search", () => {
  const search = ref<string>("");
  const searchResults = ref<SearchResults>(new Map());

  const hasResult = (key: string) => searchResults.value.has(key);
  const getResult = (key: string) => searchResults.value.get(key);
  const setResult = (key: string, value: Tovar[]) =>
    searchResults.value.set(key, value);

  return { search, searchResults, hasResult, getResult, setResult };
});
