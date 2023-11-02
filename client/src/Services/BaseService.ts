import axios from "axios";

type clientData = {
  [key: string]: string | number | boolean | string[];
};

type params = {
  [key: string]: string | number | boolean;
};

class Base {
  baseUrl: String;
  constructor(url: string) {
    this.baseUrl = url;
  }

  async get(endpoint: string, params: params) {
    try {
      const response = await axios.get(this.baseUrl + endpoint, {
        params,
        withCredentials: true,
      });
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async post(endpoint: string, clientData: clientData) {
    try {
      const response = await axios.post(this.baseUrl + endpoint, clientData, {
        withCredentials: true,
      });
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async put(endpoint: string, clientData: clientData) {
    try {
      const response = await axios.put(this.baseUrl + endpoint, clientData);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async delete(endpoint: string, clientData: clientData) {
    try {
      const response = await axios.delete(this.baseUrl + endpoint, {
        data: clientData,
      });
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default Base;
