import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://localhost:18080/api",
  withCredentials: true,
});

export default apiRequest;
