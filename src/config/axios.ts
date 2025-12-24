import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // keep this if using cookie sessions
});

export default axiosInstance;
