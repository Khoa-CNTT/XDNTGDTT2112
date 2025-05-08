import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return error;
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const data = error?.response?.data;
    return data
      ? { data }
      : {
          data: {
            statusCode: error.code,
            statusText: "error",
            message: error.message || "Đã xảy ra lỗi",
          },
        };
  }
);

export default axiosInstance;
