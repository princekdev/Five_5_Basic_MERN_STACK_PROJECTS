const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    movieId: {
      type: Number,
      required: [true, 'Movie ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    poster_path: {
      type: String,
      default: null,
    },
    backdrop_path: {
      type: String,
      default: null,
    }, 
    overview: {
      type: String,
      default: '',
    },
    release_date: {
      type: String,
      default: '',
    },
    vote_average: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    vote_count: {
      type: Number,
      default: 0,
    },
    genre_ids: {
      type: [Number],
      default: [],
    },
    popularity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index: one favorite entry per user per movie
favoriteSchema.index({ user: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
