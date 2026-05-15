const axios = require("axios");
const SearchHistory = require("../models/SearchHistory");
const { AppError } = require("../middleware/errorHandler");

const OPENWEATHER_BASE = "https://api.openweathermap.org/data/2.5";
const OPENWEATHER_GEO = "https://api.openweathermap.org/geo/1.0"; // ✅ FIX: https

// Format current weather
const formatCurrentWeather = (data) => ({
  city: data.name,
  country: data.sys.country,
  temperature: Math.round(data.main.temp),
  feelsLike: Math.round(data.main.feels_like),
  tempMin: Math.round(data.main.temp_min),
  tempMax: Math.round(data.main.temp_max),
  humidity: data.main.humidity,
  pressure: data.main.pressure,
  visibility: Math.round(data.visibility / 1000),
  windSpeed: Math.round(data.wind.speed * 3.6),
  windDeg: data.wind.deg,
  condition: data.weather[0].main,
  description: data.weather[0].description, 
  icon: data.weather[0].icon,
  sunrise: data.sys.sunrise,
  sunset: data.sys.sunset,
  timezone: data.timezone,
  dt: data.dt,
  coord: data.coord,
});

// Format forecast
const formatForecast = (data) => {
  const dailyMap = {};

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split("T")[0];
    const hour = date.getHours();

    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = item;
    } else {
      const existingHour = new Date(dailyMap[dateKey].dt * 1000).getHours();
      if (Math.abs(hour - 12) < Math.abs(existingHour - 12)) {
        dailyMap[dateKey] = item;
      }
    }
  });

  return Object.entries(dailyMap)
    .slice(0, 5)
    .map(([date, item]) => ({
      date,
      dt: item.dt,
      tempMax: Math.round(item.main.temp_max),
      tempMin: Math.round(item.main.temp_min),
      temperature: Math.round(item.main.temp),
      humidity: item.main.humidity,
      condition: item.weather[0].main,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      windSpeed: Math.round(item.wind.speed * 3.6),
      pop: Math.round((item.pop || 0) * 100),
    }));
};

// ✅ CURRENT WEATHER
const getCurrentWeather = async (req, res, next) => {
  try {
    const { city, lat, lon, units = "metric" } = req.query;

    if (!city && (!lat || !lon)) {
      return next(new AppError("Provide city name or coordinates", 400));
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return next(new AppError("Weather API key not configured", 500));
    }

    let params = { appid: apiKey, units };

    if (city) params.q = city;
    else {
      params.lat = lat;
      params.lon = lon;
    }

    const response = await axios.get(`${OPENWEATHER_BASE}/weather`, {
      params,
      timeout: 8000,
    });

    const weatherData = formatCurrentWeather(response.data);

    if (req.user) {
      await SearchHistory.addSearch(req.user._id, {
        city: weatherData.city,
        country: weatherData.country,
        temperature: weatherData.temperature,
        condition: weatherData.condition,
        icon: weatherData.icon,
      });
    }

    res.json({ success: true, data: weatherData });
  } catch (error) {
    if (error.response?.status === 404) {
      return next(new AppError("City not found", 404));
    }
    if (error.response?.status === 401) {
      return next(new AppError("Invalid API key", 401));
    }
    next(error);
  }
};

// ✅ FORECAST
const getForecast = async (req, res, next) => {
  try {
    const { city, lat, lon, units = "metric" } = req.query;

    if (!city && (!lat || !lon)) {
      return next(new AppError("Provide city name or coordinates", 400));
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    let params = { appid: apiKey, units, cnt: 40 };

    if (city) params.q = city;
    else {
      params.lat = lat;
      params.lon = lon;
    }

    const response = await axios.get(`${OPENWEATHER_BASE}/forecast`, {
      params,
      timeout: 8000,
    });

    res.json({
      success: true,
      data: formatForecast(response.data),
      city: response.data.city,
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return next(new AppError("City not found", 404));
    }
    if (error.response?.status === 401) {
      return next(new AppError("Invalid API key", 401));
    }
    next(error);
  }
};

// ✅ SEARCH CITY
const searchCities = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    const response = await axios.get(`${OPENWEATHER_GEO}/direct`, {
      params: { q, limit: 5, appid: apiKey },
      timeout: 5000,
    });

    const cities = response.data.map((c) => ({
      name: c.name,
      country: c.country,
      state: c.state,
      lat: c.lat,
      lon: c.lon,
      displayName: [c.name, c.state, c.country].filter(Boolean).join(", "),
    }));

    res.json({ success: true, data: cities });
  } catch (error) {
    if (error.response?.status === 401) {
      return next(new AppError("Invalid API key", 401));
    }
    next(error);
  }
};

// बाकी same
const getSearchHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.find({ user: req.user._id })
      .sort({ searchedAt: -1 })
      .limit(20)
      .lean();

    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

const deleteHistoryItem = async (req, res, next) => {
  try {
    const item = await SearchHistory.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!item) {
      return next(new AppError("History item not found", 404));
    }

    res.json({ success: true, message: "Search history item deleted" });
  } catch (error) {
    next(error);
  }
};

const clearHistory = async (req, res, next) => {
  try {
    await SearchHistory.deleteMany({ user: req.user._id });
    res.json({ success: true, message: "Search history cleared" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentWeather,
  getForecast,
  searchCities,
  getSearchHistory,
  deleteHistoryItem,
  clearHistory,
};