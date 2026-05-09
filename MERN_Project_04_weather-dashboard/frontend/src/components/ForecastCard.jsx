import React from "react";
import { Droplets, Wind } from "lucide-react";
import { useWeather } from "../context/WeatherContext";
import { formatDay, tempDisplay } from "../utils/weatherUtils";

const ForecastItem = ({ day, units }) => (
  <div className="flex-1 flex flex-col items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-2xl p-3 transition-colors min-w-0">
    <span className="text-white/60 text-xs font-display font-semibold uppercase tracking-wider">
      {formatDay(day.dt)}
    </span>
    <img
      src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
      alt={day.condition}
      className="w-10 h-10 object-contain"
    />
    <span className="text-white/50 text-xs font-body capitalize text-center leading-tight">
      {day.description}
    </span>
    <div className="text-center">
      <div className="text-white font-display font-bold text-sm">
        {tempDisplay(day.tempMax, units)} 
      </div>
      <div className="text-white/40 font-body text-xs">
        {tempDisplay(day.tempMin, units)}
      </div>
    </div>
    <div className="flex flex-col gap-1 w-full">
      {day.pop > 0 && (
        <div className="flex items-center justify-center gap-1 text-blue-300/70">
          <Droplets size={10} />
          <span className="text-xs font-mono">{day.pop}%</span>
        </div>
      )}
      <div className="flex items-center justify-center gap-1 text-white/40">
        <Wind size={10} />
        <span className="text-xs font-mono">{day.windSpeed}</span>
      </div>
    </div>
  </div>
);

const ForecastCard = () => {
  const { forecast, forecastLoading, units } = useWeather();

  if (forecastLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-32 bg-white/10 rounded mb-4" />
        <div className="flex gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-1 h-40 bg-white/10 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!forecast.length) return null;

  return (
    <div className="animate-slide-up">
      <h3 className="text-white/70 text-xs font-display font-semibold uppercase tracking-widest mb-3">
        5-Day Forecast
      </h3>
      <div className="flex gap-2 sm:gap-3">
        {forecast.map((day, idx) => (
          <ForecastItem key={idx} day={day} units={units} />
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;
