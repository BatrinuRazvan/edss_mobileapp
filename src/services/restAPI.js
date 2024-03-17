import axios from "axios";

// Ensure the property is named `baseURL` not `baseUrl`
export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

class APIclient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  saveResponse = (question, response, email) => {
    return axiosInstance
      .post(this.endpoint, { question, response, email })
      .then((res) => console.log(res.data));
  };

  // Corrected to use axios's automatic JSON parsing
  getMessages = async () => {
    const response = await axiosInstance.get(this.endpoint);
    return response.data; // axios parses the JSON automatically
  };

  // Corrected for location as query params and automatic JSON parsing
  getLocalMessages = async (location) => {
    const params = new URLSearchParams(location).toString();
    const response = await axiosInstance.get(`${this.endpoint}?${params}`);
    return response.data;
  };
}

export default APIclient;
