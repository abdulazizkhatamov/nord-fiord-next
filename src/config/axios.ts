import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_URL
  }/api`,
  withCredentials: true, // keep this if using cookie sessions
  proxy: false,
});

export default axiosInstance;
