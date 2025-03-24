import axios from "axios";

// Replace this with your backend's URL
const BASE_URL = "http://localhost:8081/api/v1/schema";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
