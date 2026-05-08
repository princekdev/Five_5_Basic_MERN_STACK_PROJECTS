import React from "react";
import { Wind, Droplets, Eye, Thermometer, Gauge, Sunrise, Sunset, ArrowUp, ArrowDown } from "lucide-react";
import { useWeather } from "../context/WeatherContext";
import { formatTime, getWindDirection, isDay, tempDisplay, getWeatherGradient } from "../utils/weatherUtils";

const StatCard = ({ icon: Icon, label, value, unit }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 hover:bg-white/15 transition-colors">
    <div className="p-2 bg-white/10 rounded-xl">
      <Icon size={16} className="text-white/80" />
    </div>
    <div>
      <p className="text-white/50 text-xs font-body">{label}</p>
      <p className="text-white font-display font-semibold text-sm">
        {value}<span className="text-white/60 font-normal text-xs ml-1">{unit}</span>
      </p>
    </div>
  </div> 
);

const CurrentWeather = () => {
  const { currentWeather, units, loading } = useWeather();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-48 bg-white/10 rounded-3xl" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-white/10 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!currentWeather) return null;

  const {
    city, country, temperature, feelsLike, tempMin, tempMax,
    humidity, windSpeed, windDeg, visibility, pressure,
    condition, description, icon, sunrise, sunset, dt, timezone,
  } = currentWeather;

  const dayTime = isDay(dt, sunrise, sunset);
  const gradient = getWeatherGradient(condition, dayTime);

  return (
    <div className="animate-fade-in space-y-4">
      {/* Main Card */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-6 shadow-2xl`}>
        {/* Background decoration */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-5 -left-5 w-28 h-28 bg-white/5 rounded-full" />

        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-white font-display font-bold text-2xl">{city}</h2>
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-mono">{country}</span>
            </div>
            <p className="text-white/70 text-sm font-body capitalize">{description}</p>
            <div className="mt-4 flex items-end gap-3">
              <span className="text-white font-display font-bold text-6xl leading-none">
                {temperature}°
              </span>
              <div className="mb-2 text-white/70">
                <span className="text-sm font-body">{units === "metric" ? "C" : "F"}</span>
              </div>
            </div>
            <p className="text-white/60 text-sm font-body mt-1">
              Feels like {tempDisplay(feelsLike, units)}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-white/70 text-xs font-body">
                <ArrowUp size={12} />{tempDisplay(tempMax, units)}
              </span>
              <span className="flex items-center gap-1 text-white/70 text-xs font-body">
                <ArrowDown size={12} />{tempDisplay(tempMin, units)}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img
              src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
              alt={condition}
              className="w-24 h-24 object-contain drop-shadow-lg animate-float"
            />
            <span className="text-white/60 text-xs font-display uppercase tracking-widest">{condition}</span>
          </div>
        </div>

        {/* Sun times */}
        <div className="relative mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/70">
            <Sunrise size={14} className="text-amber-300" />
            <span className="text-xs font-mono">{formatTime(sunrise, timezone)}</span>
          </div>
          <div className="flex-1 mx-4 h-px bg-gradient-to-r from-amber-300/30 via-white/20 to-blue-300/30" />
          <div className="flex items-center gap-2 text-white/70">
            <span className="text-xs font-mono">{formatTime(sunset, timezone)}</span>
            <Sunset size={14} className="text-orange-300" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard icon={Droplets} label="Humidity" value={humidity} unit="%" />
        <StatCard icon={Wind} label="Wind" value={`${windSpeed} ${getWindDirection(windDeg)}`} unit={units === "metric" ? "km/h" : "mph"} />
        <StatCard icon={Eye} label="Visibility" value={visibility} unit="km" />
        <StatCard icon={Gauge} label="Pressure" value={pressure} unit="hPa" />
        <StatCard icon={Thermometer} label="Feels Like" value={feelsLike} unit={`°${units === "metric" ? "C" : "F"}`} />
        <StatCard icon={ArrowUp} label="High / Low" value={`${tempMax}° / ${tempMin}°`} unit="" />
      </div>
    </div>
  );
};

export default CurrentWeather;
