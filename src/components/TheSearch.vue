<script setup lang="ts">
import { reactive } from "vue";
import { Search } from "@element-plus/icons-vue";
import { getItemsList } from "../api/getItemsList";
import { getSearchSuggestions } from "../api/getSearchSuggestions";
import { useSearchState } from "../stores/search";

const searchState = useSearchState();
const form = reactive({
  input: "",
});

const handleSearch = async () => {
  searchState.isLoading = true;

  if (!searchState.hasResult(form.input)) {
    const items = await getItemsList(form.input);
    searchState.setResult(form.input, items);
  }

  searchState.getResult(form.input);
  searchState.isLoading = false;
};

const querySearch = async (queryString: string, cb: any) => {
  const suggestions = await getSearchSuggestions(queryString);
  const results = suggestions.map((suggestion) => ({ value: suggestion }));
  // call callback function to return suggestions
  cb(results);
};
</script>

<template>
  <el-form
    :model="form"
    label-width="80px"
    :inline="false"
    size="normal"
    @submit.prevent="handleSearch"
  >
    <div class="flex">
      <label for="search" class="sr-only">Поиск</label>
      <el-autocomplete
        id="search"
        v-model="form.input"
        class="w-full"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        @select="handleSearch"
      ></el-autocomplete>
      <el-button
        type="primary"
        native-type="submit"
        :icon="Search"
        :disabled="!form.input"
        >Найти
      </el-button>
    </div>
  </el-form>
</template>
