import https from "../helpers/https";

interface Data {
  Data: string[];
}

export const getSearchSuggestions = async (text: string) => {
  const data = await https.get<Data>("/search/autocomplete", {
    params: {
      Request: text,
      limit: 10,
      ApiVersion: 3,
    },
  });

  return data!.Data;
};
