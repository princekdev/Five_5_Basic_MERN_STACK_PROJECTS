const express = require("express");
const {
  getCurrentWeather,
  getForecast,
  searchCities,
  getSearchHistory,
  deleteHistoryItem,
  clearHistory,
} = require("../controllers/weatherController");
const { protect, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// Public routes (optional auth for saving history)
router.get("/current", optionalAuth, getCurrentWeather);
router.get("/forecast", optionalAuth, getForecast);
router.get("/search", searchCities);

// Protected routes
router.get("/history", protect, getSearchHistory);
router.delete("/history/:id", protect, deleteHistoryItem);
router.delete("/history", protect, clearHistory);

module.exports = router;
 