import React from "react";
import SearchBar from "./SearchBar";
import CurrentWeather from "./CurrentWeather";
import ForecastCard from "./ForecastCard";
import SearchHistory from "./SearchHistory";
import HourlyChart from "./HourlyChart";
import WeatherMap from "./WeatherMap";
import EmptyState from "./EmptyState";
import { useWeather } from "../context/WeatherContext";

const Dashboard = () => {
  const { currentWeather, loading, error } = useWeather();
  const hasData = !!currentWeather;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Search section */}
      <div className="px-4 sm:px-6 pb-6"> 
        <SearchBar />
      </div>

      {/* Error state */}
      {error && !loading && !hasData && (
        <div className="mx-4 sm:mx-6 mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl animate-fade-in">
          <p className="text-red-300 text-sm font-body text-center">{error}</p>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 px-4 sm:px-6 pb-8">
        {!hasData && !loading ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {/* Left column - main weather + forecast */}
            <div className="lg:col-span-2 space-y-4">
              <CurrentWeather />
              <ForecastCard />
              <HourlyChart />
              <WeatherMap />
            </div>

            {/* Right column - history + extras */}
            <div className="space-y-4">
              <SearchHistory />
              <WindCompass />
              <SunProgress />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Wind Compass mini widget
const WindCompass = () => {
  const { currentWeather } = useWeather();
  if (!currentWeather) return null;
  const { windDeg, windSpeed, units } = currentWeather;
  const speedUnit = units === "metric" ? "km/h" : "mph";

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <h3 className="text-white/70 text-xs font-display font-semibold uppercase tracking-widest mb-3">Wind</h3>
      <div className="flex items-center justify-between">
        <div className="relative w-20 h-20">
          {/* Compass ring */}
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
            {["N","E","S","W"].map((d, i) => {
              const angle = i * 90 * (Math.PI / 180);
              const x = 40 + 28 * Math.sin(angle);
              const y = 40 - 28 * Math.cos(angle);
              return <text key={d} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                fontSize="7" fill="rgba(255,255,255,0.4)" fontFamily="DM Mono">{d}</text>;
            })}
            {/* Wind arrow */}
            <g transform={`rotate(${windDeg}, 40, 40)`}>
              <polygon points="40,12 43,40 40,36 37,40" fill="#60a5fa" opacity="0.9" />
              <polygon points="40,68 43,40 40,44 37,40" fill="rgba(255,255,255,0.2)" />
            </g>
            <circle cx="40" cy="40" r="3" fill="#60a5fa" />
          </svg>
        </div>
        <div className="text-right">
          <div className="text-white font-display font-bold text-2xl">{windSpeed}</div>
          <div className="text-white/40 text-xs font-body">{speedUnit}</div>
          <div className="text-white/50 text-xs font-mono mt-1">{windDeg}°</div>
        </div>
      </div>
    </div>
  );
};

// Sun progress widget
const SunProgress = () => {
  const { currentWeather } = useWeather();
  if (!currentWeather?.sunrise) return null;
  const { sunrise, sunset, dt, timezone } = currentWeather;

  const now = dt;
  const total = sunset - sunrise;
  const elapsed = Math.max(0, Math.min(now - sunrise, total));
  const pct = total > 0 ? (elapsed / total) * 100 : 0;

  const fmt = (ts) => {
    const d = new Date((ts + timezone) * 1000);
    return d.toUTCString().slice(17, 22);
  };

  const sunX = 10 + (pct / 100) * 80;
  const sunY = 40 - Math.sin((pct / 100) * Math.PI) * 30;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <h3 className="text-white/70 text-xs font-display font-semibold uppercase tracking-widest mb-3">Sun Position</h3>
      <svg viewBox="0 0 100 60" className="w-full">
        {/* Arc path */}
        <path d="M 10 45 Q 50 5 90 45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="2,2" />
        {/* Elapsed arc */}
        <path d={`M 10 45 Q 50 5 ${sunX} ${sunY}`} fill="none" stroke="rgba(251,191,36,0.4)" strokeWidth="1.5" />
        {/* Horizon */}
        <line x1="5" y1="45" x2="95" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {/* Sun */}
        <circle cx={sunX} cy={sunY} r="4" fill="#fbbf24" opacity="0.9">
          <animate attributeName="r" values="3.5;4.5;3.5" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Glow */}
        <circle cx={sunX} cy={sunY} r="7" fill="#fbbf24" opacity="0.15" />
        {/* Labels */}
        <text x="10" y="55" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.4)" fontFamily="DM Mono">{fmt(sunrise)}</text>
        <text x="90" y="55" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.4)" fontFamily="DM Mono">{fmt(sunset)}</text>
      </svg>
      <div className="text-center mt-1">
        <span className="text-white/40 text-xs font-body">{Math.round(pct)}% of daylight passed</span>
      </div>
    </div>
  );
};

export default Dashboard;
