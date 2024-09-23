// "use server";
import axios from "axios";

const axiosInstance = (accessToken: string) => {
  const baseURL = process.env.BASE_API;

  const axiosInstance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {},
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      config.headers.set("Content-Type", "application/json");

      if (accessToken)
        config.headers.set("Authorization", `Bearer ${accessToken}`);

      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosInstance;
};

export default axiosInstance;
