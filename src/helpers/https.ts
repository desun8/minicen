import axios from "axios";

axios.defaults.baseURL = "https://api.minicen.ru";

export default class https {
  static async get<T>(url: string, config = {}): Promise<T | undefined> {
    try {
      const response = await axios.get(url, config);

      return await response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
