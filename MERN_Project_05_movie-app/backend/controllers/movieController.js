const tmdbClient = require('../config/tmdb');

// @desc    Get popular/trending movies
// @route   GET /api/movies/popular
// @access  Public
const getPopularMovies = async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const response = await tmdbClient.get('/movie/popular', { params: { page } });
    res.json({ success: true, data: response.data });
  } catch (error) {
    next(error);
  }
};
 
// @desc    Get trending movies (week)
// @route   GET /api/movies/trending
// @access  Public
const getTrendingMovies = async (req, res, next) => {
  try {
    const response = await tmdbClient.get('/trending/movie/week');
    res.json({ success: true, data: response.data });
  } catch (error) {
    next(error);
  }
};

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
const searchMovies = async (req, res, next) => {
  try {
    const { query, page = 1, year } = req.query;
    if (!query || query.trim() === '') {
      return res.status(400).json({ success: false, message: 'Search query is required.' });
    }
    const params = { query: query.trim(), page, include_adult: false };
    if (year) params.primary_release_year = year;
    const response = await tmdbClient.get('/search/movie', { params });
    res.json({ success: true, data: response.data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get movie details
// @route   GET /api/movies/:id
// @access  Public
const getMovieDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [details, credits, videos, similar] = await Promise.all([
      tmdbClient.get(`/movie/${id}`, { params: { append_to_response: 'videos,credits' } }),
      tmdbClient.get(`/movie/${id}/credits`),
      tmdbClient.get(`/movie/${id}/videos`),
      tmdbClient.get(`/movie/${id}/similar`),
    ]);
    res.json({
      success: true,
      data: {
        ...details.data,
        credits: credits.data,
        videos: videos.data,
        similar: similar.data,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get genres list
// @route   GET /api/movies/genres
// @access  Public
const getGenres = async (req, res, next) => {
  try {
    const response = await tmdbClient.get('/genre/movie/list');
    res.json({ success: true, data: response.data });
  } catch (error) {
    next(error);
  }
};

// @desc    Discover movies with filters
// @route   GET /api/movies/discover
// @access  Public
const discoverMovies = async (req, res, next) => {
  try {
    const { genre, year, sort_by = 'popularity.desc', page = 1 } = req.query;
    const params = { sort_by, page, include_adult: false };
    if (genre) params.with_genres = genre;
    if (year) params.primary_release_year = year;
    const response = await tmdbClient.get('/discover/movie', { params });
    res.json({ success: true, data: response.data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPopularMovies,
  getTrendingMovies,
  searchMovies,
  getMovieDetails,
  getGenres,
  discoverMovies,
};
