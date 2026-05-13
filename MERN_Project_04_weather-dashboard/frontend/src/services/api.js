import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);
 
// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// Weather
export const weatherAPI = {
  getCurrent: (params) => api.get("/weather/current", { params }),
  getForecast: (params) => api.get("/weather/forecast", { params }),
  searchCities: (q) => api.get("/weather/search", { params: { q } }),
  getHistory: () => api.get("/weather/history"),
  deleteHistory: (id) => api.delete(`/weather/history/${id}`),
  clearHistory: () => api.delete("/weather/history"),
};

export default api;
