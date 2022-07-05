import CyrillicToTranslit from "cyrillic-to-translit-js";
import https from "../helpers/https";

interface Data {
  [key: string]: [{ idCity: number; idRecord: number }];
}

interface Response {
  Data: Data;
}

export type City = {
  id: number;
  name: string;
  transliteration: string;
};

type TradePointId = {
  tradePointId: number;
};

export type CityWithTradePoint = City & TradePointId;

export const getCities = async () => {
  const cities: CityWithTradePoint[] = [];

  const data = await https.get<Response>("/geo/getalltradepoints?ApiVersion=3");
  const allTradePoints = data?.Data;

  if (allTradePoints) {
    const cyrillicToTranslit = new CyrillicToTranslit();

    for (const city in allTradePoints) {
      const cityName = city;
      const cityTradePoint = allTradePoints[city][0];
      const cityId = cityTradePoint.idCity;
      const cityTradePointId = cityTradePoint.idRecord;
      let cityTransliteration = cyrillicToTranslit.transform(cityName);

      // У Хабаровска первые две буквы заглавные, так что исправляем
      if (cityName === "Хабаровск") {
        cityTransliteration = cityTransliteration.replace("h", "H");
      }

      cities.push({
        id: cityId,
        name: cityName,
        transliteration: cityTransliteration,
        tradePointId: cityTradePointId,
      });
    }
  }

  return cities;
};
