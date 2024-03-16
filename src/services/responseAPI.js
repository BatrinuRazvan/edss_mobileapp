export const axiosInstance = axios.create({
  baseUrl: "http://localhost:8080",
});

class APIclient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  postResponse = (question, response, email) => {
    return axiosInstance
      .post(this.endpoint, { question, response, email })
      .then((res) => console.log(res.data));
  };

  getMessages = () => {
    return axiosInstance.get(this.endpoint).then((res) => res.json());
  };

  getLocalMessages = (location) => {
    return axiosInstance
      .get(this.endpoint, { location })
      .then((response) => response.json());
  };
}
export default APIclient;
