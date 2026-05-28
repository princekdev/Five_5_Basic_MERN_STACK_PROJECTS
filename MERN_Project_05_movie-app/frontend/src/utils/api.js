import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:logout')); 
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const moviesAPI = {
  getPopular: (page = 1) => api.get('/movies/popular', { params: { page } }),
  getTrending: () => api.get('/movies/trending'),
  search: (query, page = 1, year) =>
    api.get('/movies/search', { params: { query, page, ...(year && { year }) } }),
  getDetails: (id) => api.get(`/movies/${id}`),
  getGenres: () => api.get('/movies/genres'),
  discover: (params) => api.get('/movies/discover', { params }),
};

export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (movie) => api.post('/favorites', movie),
  remove: (movieId) => api.delete(`/favorites/${movieId}`),
  check: (movieId) => api.get(`/favorites/check/${movieId}`),
};

export default api;
