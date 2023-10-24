import axios from "axios";

type clientData = {
  [key: string]: string | number | boolean;
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
      const response = await axios.get(this.baseUrl + endpoint, { params });
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async post(endpoint: string, clientData: clientData) {
    try {
      const response = await axios.post(this.baseUrl + endpoint, clientData);
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
      const response = await axios.post(this.baseUrl + endpoint, clientData);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default Base;
