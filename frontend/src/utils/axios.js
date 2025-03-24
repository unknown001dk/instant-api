import axios from 'axios';

// Set up the base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081',
});

// Attach token to every request if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
