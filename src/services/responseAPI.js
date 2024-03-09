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
}
export default APIclient;
// const responsePayload = { question, response };

// try {
//   await fetch(`${baseUrl}/saveResponse`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(responsePayload),
//   });
// } catch (error) {
//   console.error("Failed to save response:", error);
//   return false;
// }
// return true;
