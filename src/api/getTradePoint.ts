import https from "../helpers/https";
import { useLocationState } from "../stores/location";

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
  const location = useLocationState();
  const city = location.city?.id;

  const data = await https.get<Data>("/Proc/TradePointGet", {
    params: {
      idCity: city,
      ApiVersion: 3,
    },
  });

  const tradePoint = data?.Data.find(
    (point) => point.idRecord === tradePointId
  );

  return tradePoint;
};
