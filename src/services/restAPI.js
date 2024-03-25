import axios from "axios";

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

  getMessages = async () => {
    const response = await axiosInstance.get(this.endpoint);
    return response.data;
  };

  getLocalMessages = (location) => {
    const queryParams = new URLSearchParams(location).toString();
    return axiosInstance.get(`/messages/getLocalMessages?${queryParams}`)
        .then(response => response.data);
  };

  updateLocation = ({ userId, latitude, longitude }) => {
    const params = new URLSearchParams();
    params.append('userId', userId);
    params.append('latitude', latitude);
    params.append('longitude', longitude);
    return axiosInstance.post(`${this.endpoint}`, params)
      .then(res => console.log("Location saved:", res.data))
      .catch(err => console.error("Saving location failed:", err));
  };

  saveUser = ({ userId, email, latitude, longitude }) => {
    // Construct a query string
    const params = new URLSearchParams({
        userId, email, latitude, longitude
    }).toString();

    return axiosInstance.post(`${this.endpoint}?${params}`);
  };


  saveSubscription = (userId, subscription) => {
  // Extract the keys from the subscription object
    const key = subscription.getKey ? subscription.getKey('p256dh') : '';
    const auth = subscription.getKey ? subscription.getKey('auth') : '';

    // Convert keys to base64 strings for easier handling on the backend
    const p256dh = key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '';
    const authStr = auth ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth))) : '';

    // Log the keys for debugging purposes
    console.log(p256dh);
    console.log(authStr);

    // Prepare the subscription object in the format expected by the backend
    const subscriptionData = {
      userId: userId,
      endpoint: subscription.endpoint,
      p256dh: p256dh,
      auth: authStr
    };
      
    // Send the prepared subscription object to the backend
    return axiosInstance.post(this.endpoint,  subscriptionData)
      .then(response => console.log("Subscription saved:", response.data))
      .catch(err => console.error("Saving subscription failed:", err));
  };



}

export default APIclient;
