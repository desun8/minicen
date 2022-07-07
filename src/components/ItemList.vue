<script setup lang="ts">
import { computed } from "vue";
import { getItemPrices } from "../api/getItemPrices";
import { useSearchState } from "../stores/search";
import { useItemsDetailState } from "../stores/itemsDetail";

const searchState = useSearchState();
const detailsState = useItemsDetailState();

const items = computed(() => searchState.currResult);

const handleShowDetail = async (id: number, name: string) => {
  detailsState.isLoading = true;
  detailsState.currResultName = name;

  if (!detailsState.hasResult(id)) {
    const items = await getItemPrices(id);
    detailsState.setResult(id, items);
  }

  detailsState.getResult(id);
  detailsState.isLoading = false;
  detailsState.dialogVisible = true;
};
</script>

<template>
  <el-skeleton :loading="searchState.isLoading" :throttle="500" animated>
    <template #template>
      <ul class="w-max mx-auto">
        <li
          v-for="n in 10"
          :key="n"
          class="flex gap-5 items-center not-last:mb-4"
        >
          <el-skeleton-item variant="text" class="w-80"></el-skeleton-item>
          <el-skeleton-item
            variant="button"
            class="w-21.5 h-6"
          ></el-skeleton-item>
        </li>
      </ul>
    </template>

    <template #default>
      <template v-if="items">
        <ul v-if="items.length" class="w-max mx-auto">
          <li
            v-for="item in items"
            :key="item.idTovar"
            class="flex gap-5 items-center not-last:mb-4"
          >
            <p class="w-80 text-left">
              {{ item.TovarName }}
            </p>
            <el-button
              v-loading.fullscreen.lock="detailsState.isLoading"
              element-loading-text="Получаем цены..."
              type="info"
              size="small"
              @click="handleShowDetail(item.idRecord, item.TovarName)"
            >
              Подробнее
            </el-button>
          </li>
        </ul>

        <el-result
          v-else
          icon="warning"
          title="Ничего не удалось найти"
          sub-title="Возможно данного товара нет"
        ></el-result>
      </template>
    </template>
  </el-skeleton>
</template>
