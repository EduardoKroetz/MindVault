import axios from "axios";

const baseUrl = "https://localhost:7100/api"

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token)
      config.headers.Authorization = `Bearer ${token}`

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

export default axiosInstance;
