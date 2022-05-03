import axios from "axios";

axios.defaults.baseURL = "https://api.minicen.ru";

export default class https {
  static async get<T>(url: string, config = {}): Promise<T | undefined> {
    try {
      const response = await axios.get(url, config);

      console.log(
        "🚀 ~ file: https.ts ~ line 7 ~ Https ~ get ~ response",
        response
      );

      return await response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
