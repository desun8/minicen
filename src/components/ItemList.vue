<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { getItemPrices, ItemPrice, ItemWaitPrice } from "../api/getItemPrices";
import { getItemsList, Tovar } from "../api/getItemsList";
import { Search } from "@element-plus/icons-vue";
import { getSearchSuggestions } from "../api/getSearchSuggestions";
import { useLocationState } from "../stores/location";
import { useSearchState } from "../stores/search";
import { useItemsDetailState } from "../stores/itemsDetail";

const locationState = useLocationState();
const cityName = computed(() => locationState.city?.transliteration);

const searchState = useSearchState();
const detailsState = useItemsDetailState();

const items = ref<Tovar[]>();
let itemDetail = ref<ItemPrice[]>();
let itemName = ref<string>("");

let isLoadingItems = ref(false);
let isLoadingDetail = ref(false);
let dialogVisible = ref(false);

const form = reactive({
  input: "",
});

const handleSearch = async () => {
  isLoadingItems.value = true;

  if (!searchState.hasResult(form.input)) {
    const items = await getItemsList(form.input);
    searchState.setResult(form.input, items);
  }

  items.value = searchState.getResult(form.input);
  isLoadingItems.value = false;
};

const querySearch = async (queryString: string, cb: any) => {
  const suggestions = await getSearchSuggestions(queryString);
  const results = suggestions.map((suggestion) => ({ value: suggestion }));
  // call callback function to return suggestions
  cb(results);
};

const handleShowDetail = async (id: number, name: string) => {
  isLoadingDetail.value = true;
  itemName.value = name;

  if (!detailsState.hasResult(id)) {
    const items = await getItemPrices(id);
    detailsState.setResult(id, items);
  }

  itemDetail.value = detailsState.getResult(id);

  isLoadingDetail.value = false;
  dialogVisible.value = true;
};

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
  <div>
    <el-header height="">
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
    </el-header>

    <el-main>
      <el-skeleton :loading="isLoadingItems" :throttle="500" animated>
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
                  v-loading.fullscreen.lock="isLoadingDetail"
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
    </el-main>
  </div>

  <el-dialog v-model="dialogVisible" :title="itemName" center width="85%">
    <el-table
      :data="itemDetail"
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
            >Посмотреть на сайте</el-link
          >
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
