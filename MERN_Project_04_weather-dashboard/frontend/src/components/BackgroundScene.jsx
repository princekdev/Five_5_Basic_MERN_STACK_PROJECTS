import React, { useMemo } from "react";
import { useWeather } from "../context/WeatherContext";
import { isDay } from "../utils/weatherUtils";

const CONDITION_THEMES = {
  Clear: {
    day: { bg: "from-sky-400 via-blue-400 to-indigo-500", particles: "☀️" },
    night: { bg: "from-indigo-950 via-blue-950 to-slate-950", particles: "⭐" },
  },
  Clouds: {
    day: { bg: "from-slate-400 via-blue-300 to-slate-400", particles: "☁️" },
    night: { bg: "from-slate-800 via-blue-900 to-slate-900", particles: "☁️" },
  },
  Rain: {
    day: { bg: "from-slate-600 via-blue-700 to-slate-700", particles: "🌧️" },
    night: { bg: "from-slate-800 via-blue-900 to-slate-800", particles: "🌧️" },
  },
  Drizzle: {
    day: { bg: "from-slate-500 via-blue-600 to-slate-600", particles: null },
    night: { bg: "from-slate-700 via-blue-800 to-slate-800", particles: null },
  },
  Thunderstorm: { 
    day: { bg: "from-slate-700 via-purple-900 to-slate-800", particles: "⚡" },
    night: { bg: "from-slate-900 via-purple-950 to-slate-900", particles: "⚡" },
  },
  Snow: {
    day: { bg: "from-blue-100 via-slate-200 to-blue-100", particles: "❄️" },
    night: { bg: "from-blue-950 via-slate-900 to-blue-950", particles: "❄️" },
  },
  Mist: {
    day: { bg: "from-gray-400 via-slate-300 to-gray-400", particles: null },
    night: { bg: "from-gray-800 via-slate-800 to-gray-900", particles: null },
  },
  Haze: {
    day: { bg: "from-amber-300 via-yellow-200 to-orange-300", particles: null },
    night: { bg: "from-amber-900 via-orange-950 to-slate-900", particles: null },
  },
};

const DEFAULT_THEME = {
  day: { bg: "from-blue-400 via-sky-500 to-indigo-500", particles: null },
  night: { bg: "from-indigo-950 via-blue-950 to-slate-950", particles: null },
};

const FloatingOrb = ({ style }) => (
  <div className="absolute rounded-full opacity-20 animate-float pointer-events-none" style={style} />
);

const BackgroundScene = () => {
  const { currentWeather } = useWeather();

  const theme = useMemo(() => {
    if (!currentWeather) return DEFAULT_THEME.day;
    const { condition, dt, sunrise, sunset } = currentWeather;
    const dayTime = isDay(dt, sunrise, sunset);
    const themeSet = CONDITION_THEMES[condition] || DEFAULT_THEME;
    return dayTime ? themeSet.day : themeSet.night;
  }, [currentWeather]);

  const orbs = useMemo(() => [
    { width: 400, height: 400, background: "rgba(255,255,255,0.06)", top: "-10%", right: "-5%", animationDelay: "0s", animationDuration: "8s" },
    { width: 250, height: 250, background: "rgba(255,255,255,0.04)", bottom: "10%", left: "-5%", animationDelay: "2s", animationDuration: "10s" },
    { width: 180, height: 180, background: "rgba(255,255,255,0.05)", top: "40%", right: "15%", animationDelay: "4s", animationDuration: "7s" },
    { width: 120, height: 120, background: "rgba(255,255,255,0.03)", top: "20%", left: "20%", animationDelay: "1s", animationDuration: "9s" },
  ], []);

  return (
    <div className={`fixed inset-0 -z-10 bg-gradient-to-br ${theme.bg} transition-all duration-1000`}>
      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
      {/* Floating orbs */}
      {orbs.map((style, i) => <FloatingOrb key={i} style={style} />)}
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
};

export default BackgroundScene;
