const express = require('express');
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes protected
router.use(protect);

router.route('/').get(getFavorites).post(addFavorite);
router.get('/check/:movieId', checkFavorite);
router.delete('/:movieId', removeFavorite);

module.exports = router;
 