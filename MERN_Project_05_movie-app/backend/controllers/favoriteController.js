const Favorite = require('../models/Favorite');

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, count: favorites.length, data: favorites });
  } catch (error) {
    next(error);
  }
}; 

// @desc    Add movie to favorites
// @route   POST /api/favorites
// @access  Private
const addFavorite = async (req, res, next) => {
  try {
    const {
      movieId, title, poster_path, backdrop_path,
      overview, release_date, vote_average, vote_count, genre_ids, popularity,
    } = req.body;

    if (!movieId || !title) {
      return res.status(400).json({ success: false, message: 'movieId and title are required.' });
    }

    const existing = await Favorite.findOne({ user: req.user._id, movieId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Movie already in favorites.' });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      movieId, title, poster_path, backdrop_path,
      overview, release_date, vote_average, vote_count,
      genre_ids: genre_ids || [], popularity,
    });

    res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove movie from favorites
// @route   DELETE /api/favorites/:movieId
// @access  Private
const removeFavorite = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      movieId: Number(movieId),
    });

    if (!favorite) {
      return res.status(404).json({ success: false, message: 'Favorite not found.' });
    }

    res.json({ success: true, message: 'Removed from favorites.', data: favorite });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if movie is favorited
// @route   GET /api/favorites/check/:movieId
// @access  Private
const checkFavorite = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const favorite = await Favorite.findOne({ user: req.user._id, movieId: Number(movieId) });
    res.json({ success: true, isFavorited: !!favorite });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite, checkFavorite };
