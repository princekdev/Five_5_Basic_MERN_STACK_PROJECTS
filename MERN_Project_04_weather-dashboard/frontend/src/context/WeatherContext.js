import React, { createContext, useContext, useState, useCallback } from "react";
import { weatherAPI } from "../services/api";
import toast from "react-hot-toast";

const WeatherContext = createContext(null);

export const WeatherProvider = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState("metric");
  const [lastSearched, setLastSearched] = useState(null);

  const fetchWeather = useCallback(async (query) => { 
    setLoading(true);
    setForecastLoading(true);
    setError(null);
    try {
      const params = { ...query, units };
      const [weatherRes, forecastRes] = await Promise.all([
        weatherAPI.getCurrent(params),
        weatherAPI.getForecast(params),
      ]);
      setCurrentWeather(weatherRes.data.data);
      setForecast(forecastRes.data.data);
      setLastSearched(query.city || `${query.lat},${query.lon}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch weather data";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
      setForecastLoading(false);
    }
  }, [units]);

  const fetchHistory = useCallback(async () => {
    try {
      const { data } = await weatherAPI.getHistory();
      setHistory(data.data);
    } catch {
      // Silent fail
    }
  }, []);

  const removeHistoryItem = useCallback(async (id) => {
    try {
      await weatherAPI.deleteHistory(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch {
      toast.error("Failed to delete history item");
    }
  }, []);

  const clearAllHistory = useCallback(async () => {
    try {
      await weatherAPI.clearHistory();
      setHistory([]);
      toast.success("Search history cleared");
    } catch {
      toast.error("Failed to clear history");
    }
  }, []);

  const toggleUnits = useCallback(() => {
    setUnits((u) => (u === "metric" ? "imperial" : "metric"));
  }, []);

  return (
    <WeatherContext.Provider value={{
      currentWeather, forecast, history, loading, forecastLoading,
      error, units, lastSearched, fetchWeather, fetchHistory,
      removeHistoryItem, clearAllHistory, toggleUnits,
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather must be used within WeatherProvider");
  return ctx;
};
