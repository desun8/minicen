import https from "../helpers/https";
import { useLocationState } from "../stores/location";

export type TovarPagination = {
  PageCount: number;
};

type numOrNull = number | null;

export type Tovar = {
  Archived: number;
  IndzPrice?: numOrNull; // под заказ
  IndzTimeMax?: numOrNull; // под заказ
  IndzTimeMin?: numOrNull; // под заказ
  Button2Price: 738.5; // цена с ожиданием (есть не везде)
  Button2TimeMin: 1; // цена с ожиданием
  Button2TimeMax: 2; // цена с ожиданием
  Button3Price: numOrNull; // под заказ (вероятно когда нет в наличие)
  Button3TimeMax: numOrNull; // под заказ (вероятно когда нет в наличие)
  Button3TimeMin: numOrNull; // под заказ (вероятно когда нет в наличие)
  NotifyEnabled: boolean;
  Price: number;
  TovarName: string;
  idRecord: number;
  idTovar: number;
};

interface Data {
  Data: {
    tovarPagination: TovarPagination;
    tovar: Tovar[];
  };
}

const filterItems = (items: Tovar[]) =>
  items.filter((item) => item.Archived === 0 && !item.NotifyEnabled);

export const getItemsList = async (name: string) => {
  let page = 1;
  const tradePoint = useLocationState().tradePoint;
  const items = [];

  let data = await https.get<Data>("/search/main", {
    params: {
      idTradePoint: tradePoint,
      Request: name,
      Page: page,
      PerPage: 1,
      SearchType: 1,
      ApiVersion: 3,
      // dontUseMix: 0,
      // Sorting: 5,
    },
  });

  if (data) {
    const totalPage = data.Data.tovarPagination.PageCount;

    items.push(...data.Data.tovar);

    while (page < totalPage) {
      page++;

      data = await https.get<Data>("/search/main", {
        params: {
          idTradePoint: tradePoint,
          Request: name,
          Page: page,
          PerPage: 1,
          SearchType: 1,
          ApiVersion: 3,
        },
      });

      data && items.push(...data.Data.tovar);
    }
  }

  const res = filterItems(items);
  console.log("getItemsList", res);
  return res;
};
