import https from "../helpers/https";
import { Tovar } from "./getItemsList";
import { getTradePoint, TradePointBase } from "./getTradePoint";

export interface TradePoint extends TradePointBase {
  idTradePoint: number;
}

interface Data {
  Data: {
    Tovar: Tovar;
    OtherTradePoints: TradePoint[] | null;
  };
}

type numOrNull = number | null;

export type ItemWaitPrice = {
  price: numOrNull;
  dayMin: numOrNull;
  dayMax: numOrNull;
};

export type ItemPrice = {
  id: number;
  price: numOrNull;
  waitPrice: ItemWaitPrice;
  waitOrderPrice: ItemWaitPrice;
  tradePoint: string;
  tradePointDetail: TradePoint | undefined;
};

export const getItemPrices = async (itemId: number) => {
  const itemPrices: ItemPrice[] = [];

  const data = await https.get<Data>("/tovar/InfoWv2", {
    params: {
      idTradePoint: 15651,
      idCity: 1,
      idTovarProp: itemId,
      ApiVersion: 3,
    },
  });

  const itemDetail = data!.Data.Tovar;
  const otherTradePoints = data!.Data.OtherTradePoints;

  const currTradePoint = await getTradePoint(15651);

  if (currTradePoint) {
    const tradePoint: TradePoint = {
      ...currTradePoint,
      idTradePoint: currTradePoint.idRecord,
    };

    itemPrices.push({
      id: itemDetail.idRecord,
      price: itemDetail.Price,
      waitPrice: {
        price: itemDetail.Button2Price,
        dayMin: itemDetail.Button2TimeMin,
        dayMax: itemDetail.Button2TimeMax,
      },
      waitOrderPrice: {
        price: itemDetail.IndzPrice || itemDetail.Button3Price,
        dayMin: itemDetail.IndzTimeMin || itemDetail.Button3TimeMin,
        dayMax: itemDetail.IndzTimeMax || itemDetail.Button3TimeMax,
      },
      tradePoint: `${tradePoint.AddressDostShort} (${tradePoint.OrientirSait})`,
      tradePointDetail: tradePoint,
    });
  }

  // 1. iterate otherTradePoints
  // 2. getItemPrice idTradePoint
  // 3. push to itemPrices
  if (otherTradePoints) {
    for await (const tradePoint of otherTradePoints) {
      const tradePointItem = await https.get<Data>("/tovar/InfoWv2", {
        params: {
          idTradePoint: tradePoint.idTradePoint,
          idCity: 1,
          idTovarProp: itemId,
          ApiVersion: 3,
        },
      });

      const tradePointItemDetail = tradePointItem!.Data.Tovar;

      itemPrices.push({
        id: tradePointItemDetail.idRecord,
        price: tradePointItemDetail.Price,
        waitPrice: {
          price: tradePointItemDetail.Button2Price,
          dayMin: tradePointItemDetail.Button2TimeMin,
          dayMax: tradePointItemDetail.Button2TimeMax,
        },
        waitOrderPrice: {
          price:
            tradePointItemDetail.IndzPrice || tradePointItemDetail.Button3Price,
          dayMin:
            tradePointItemDetail.IndzTimeMin ||
            tradePointItemDetail.Button3TimeMin,
          dayMax:
            tradePointItemDetail.IndzTimeMax ||
            tradePointItemDetail.Button3TimeMax,
        },
        tradePointDetail: tradePoint,
        tradePoint: `${tradePoint.AddressDostShort} (${tradePoint.OrientirSait})`,
      });
    }
  }

  return itemPrices;
};
