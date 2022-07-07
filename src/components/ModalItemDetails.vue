<script setup lang="ts">
import { computed } from "vue";
import { ItemWaitPrice, ItemPrice } from "../api/getItemPrices";
import { useItemsDetailState } from "../stores/itemsDetail";
import { useLocationState } from "../stores/location";

const locationState = useLocationState();
const cityName = computed(() => locationState.city?.transliteration);

const state = useItemsDetailState();
const title = computed(() => state.currResultName);
const details = computed(() => state.currResult);
const dialogVisible = computed({
  get: () => state.dialogVisible,
  set: (newVal) => {
    state.dialogVisible = newVal;
  },
});

const formatPriceCell = (
  price: number | null | ItemWaitPrice,
  type: "base" | "wait"
) => {
  const value: {
    price: number | null;
  } = { price: null };

  if (typeof price === "number") {
    value.price = price;
  } else if (price !== null) {
    value.price = price.price;
  }

  if (value.price === null) {
    return type === "base" ? "нет в наличии" : "недоступно";
  }

  return `${value.price} ₽`;
};

const formatWaitCell = (itemWaitPrice: ItemWaitPrice) => {
  if (itemWaitPrice.price === null) {
    return "";
  }

  if (itemWaitPrice.dayMin === itemWaitPrice.dayMax) {
    return `Ожидание ${itemWaitPrice.dayMin} дней`;
  }

  return `Ожидание ${itemWaitPrice.dayMin} - ${itemWaitPrice.dayMax} дней`;
};

const sortByPrice = (a: ItemPrice, b: ItemPrice) => {
  if (a.price === null) return -1;
  if (b.price === null) return 1;

  return a.price - b.price;
};
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="title" center width="85%">
    <el-table
      :data="details"
      :default-sort="{ prop: 'price', order: 'descending' }"
      stripe
      table-layout="fixed"
    >
      <el-table-column prop="tradePoint" label="Аптека" />
      <el-table-column
        label="Цена"
        header-align="center"
        align="center"
        sortable
        :sort-method="sortByPrice"
      >
        <template #default="scope">
          <span>{{ formatPriceCell(scope.row.price, "base") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="С ожиданием"
        header-align="center"
        align="center"
        sortable
        :sort-method="sortByPrice"
      >
        <template #default="scope">
          <span class="block">{{
            formatPriceCell(scope.row.waitPrice, "wait")
          }}</span>
          <span>{{ formatWaitCell(scope.row.waitPrice) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Под заказ"
        header-align="center"
        align="center"
        sortable
        :sort-method="sortByPrice"
      >
        <template #default="scope">
          <span class="block">{{
            formatPriceCell(scope.row.waitOrderPrice, "wait")
          }}</span>
          <span>{{ formatWaitCell(scope.row.waitOrderPrice) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Ссылка" align="center">
        <template #default="scope">
          <el-link
            :href="`https://minicen.ru/#City/${cityName}/#!Tovar/${scope.row.id}/`"
            type="default"
            target="_blank"
          >
            Посмотреть на сайте
          </el-link>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
