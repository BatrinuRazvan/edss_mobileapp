import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

class APIclient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  saveResponses = (userId, responses) => {
    console.log(responses);
    return axiosInstance
      .post(this.endpoint, { userId, responses }) // Assuming the backend expects an object with responses and email
      .then((res) => console.log(res.data));
  };

  getMessages = async () => {
    const response = await axiosInstance.get(this.endpoint);
    return response.data;
  };

  getLocalMessages = (location) => {
    const queryParams = new URLSearchParams(location).toString();
    return axiosInstance
      .get(`/messages/getLocalMessages?${queryParams}`)
      .then((response) => response.data);
  };

  updateLocation = (userId, latitude, longitude) => {
    const params = new URLSearchParams({
      userId: userId,
      latitude: latitude,
      longitude: longitude,
    }).toString();
    console.log(params);
    console.log(userId);
    return axiosInstance
      .post(`${this.endpoint}?${params}`)
      .then((res) => console.log("Location saved:", res.data))
      .catch((err) => console.error("Saving location failed:", err));
  };

  saveUser = ({ userId, email, latitude, longitude, userType }) => {
    // Construct a query string
    const params = new URLSearchParams({
      userId,
      email,
      latitude,
      longitude,
      userType,
    }).toString();

    return axiosInstance.post(`${this.endpoint}?${params}`);
  };

  saveSubscription = (userId, subscription) => {
    // Extract the keys from the subscription object
    const key = subscription.getKey ? subscription.getKey("p256dh") : "";
    const auth = subscription.getKey ? subscription.getKey("auth") : "";

    // Convert keys to base64 strings for easier handling on the backend
    const p256dh = key
      ? btoa(String.fromCharCode.apply(null, new Uint8Array(key)))
      : "";
    const authStr = auth
      ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth)))
      : "";

    // Log the keys for debugging purposes
    console.log(p256dh);
    console.log(authStr);

    // Prepare the subscription object in the format expected by the backend
    const subscriptionData = {
      userId: userId,
      endpoint: subscription.endpoint,
      p256dh: p256dh,
      auth: authStr,
    };

    // Send the prepared subscription object to the backend
    return axiosInstance
      .post(this.endpoint, subscriptionData)
      .then((response) => console.log("Subscription saved:", response.data))
      .catch((err) => console.error("Saving subscription failed:", err));
  };

  getNearestExit = (location) => {
    const queryParams = new URLSearchParams({
      latitude: location.lat,
      longitude: location.lng,
    }).toString();
    console.log(queryParams);
    return axiosInstance
      .get(`/user/getNearestExit?${queryParams}`)
      .then((response) => response.data);
  };

  getUserType = (userId) => {
    const queryParams = new URLSearchParams({
      userId: userId,
    }).toString();
    return axiosInstance
      .get(`/user/getUserType?${queryParams}`)
      .then((response) => response.data);
  };

  getAllStoredDiagnostics = () => {
    return axiosInstance.get(this.endpoint).then((res) => res.data);
  };

  getAllStoredSymptoms = (diagnostic) => {
    const queryParams = new URLSearchParams({
      diagnostic: diagnostic,
    }).toString();
    return axiosInstance
      .get(`/questions/getAllStoredSymptoms?${queryParams}`)
      .then((response) => response.data);
  };

  incermentDiagnosticNumberMedic = (diagnostic, nrOfPacients) => {
    const queryParams = new URLSearchParams({
      diagnostic: diagnostic,
      numberOfDiagnostics: nrOfPacients,
    }).toString();
    return axiosInstance
      .post(`${this.endpoint}?${queryParams}`)
      .then((res) => console.log(res.data));
  };

  incermentDiagnosticNumberUser = (diagnostic) => {
    return axiosInstance
      .post(this.endpoint, diagnostic)
      .then((res) => console.log(res.data));
  };

  saveDiagnostic = (diagnostic) => {
    return axiosInstance
      .post(this.endpoint, diagnostic)
      .then((res) => console.log(res.data));
  };

  saveSymptoms = (diagnostic, symptoms) => {
    console.log(symptoms);
    const queryParams = new URLSearchParams({
      diagnostic: diagnostic,
      symptoms: symptoms,
    }).toString();
    return axiosInstance
      .post(`${this.endpoint}?${queryParams}`)
      .then((res) => console.log(res.data));
  };
}

export default APIclient;
