import https from "../helpers/https";

export interface TradePointBase {
  AddressDostShort: string;
  OrientirSait: string;
  Latitude: number;
  Longitude: number;
}

interface TradePointCurrent extends TradePointBase {
  idRecord: number;
}

interface Data {
  Data: TradePointCurrent[];
}

export const getTradePoint = async (tradePointId: number) => {
  const data = await https.get<Data>("/Proc/TradePointGet", {
    params: {
      idCity: 1,
      ApiVersion: 3,
    },
  });

  const tradePoint = data!.Data.find(
    (point) => point.idRecord === tradePointId
  );

  return tradePoint;
};
