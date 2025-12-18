import axios from "axios";

if (!process.env.REACT_APP_API_URL) {
  throw new Error("REACT_APP_API_URL is not defined");
}

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 30000,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
});

export default api;
