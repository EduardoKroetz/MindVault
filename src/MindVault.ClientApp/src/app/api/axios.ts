import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 20000,
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
