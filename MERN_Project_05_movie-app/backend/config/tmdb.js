const axios = require('axios');

const tmdbClient = axios.create({
  baseURL: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.TMDB_API_KEY,
    language: 'en-US',
  },
  timeout: 10000,
});

tmdbClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.status_message || error.message;
    console.error(`TMDB API Error: ${message}`);
    return Promise.reject(new Error(message));
  }
);

module.exports = tmdbClient;
 