import React from "react";
import { useWeather } from "../context/WeatherContext";

const UnitToggle = () => {
  const { units, toggleUnits, currentWeather, fetchWeather, lastSearched } = useWeather();

  const handleToggle = () => {
    toggleUnits();
    if (lastSearched) {
      // Re-fetch with toggled unit (units state updates async, so pass new value directly)
      const newUnits = units === "metric" ? "imperial" : "metric";
      const query = lastSearched.includes(",")
        ? { lat: lastSearched.split(",")[0], lon: lastSearched.split(",")[1] }
        : { city: lastSearched };
      setTimeout(() => fetchWeather({ ...query, units: newUnits }), 0);
    }
  };

  return (
    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
      {["metric", "imperial"].map((u) => (
        <button
          key={u}
          onClick={() => units !== u && handleToggle()}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            units === u
              ? "bg-white/20 text-white shadow-sm"
              : "text-white/40 hover:text-white/70"
          }`}
        > 
          {u === "metric" ? "°C" : "°F"}
        </button>
      ))}
    </div>
  );
};

export default UnitToggle;
