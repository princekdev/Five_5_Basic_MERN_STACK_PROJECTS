const express = require('express');
const {
  getPopularMovies,
  getTrendingMovies,
  searchMovies,
  getMovieDetails,
  getGenres,
  discoverMovies,
} = require('../controllers/movieController');

const router = express.Router();

router.get('/popular', getPopularMovies);
router.get('/trending', getTrendingMovies); 
router.get('/search', searchMovies);
router.get('/genres', getGenres);
router.get('/discover', discoverMovies);
router.get('/:id', getMovieDetails);

module.exports = router;
