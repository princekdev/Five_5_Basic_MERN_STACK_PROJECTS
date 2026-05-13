export const getWeatherGradient = (condition, isDay = true) => {
  const gradients = {
    Clear: isDay
      ? "from-amber-400 via-sky-400 to-blue-500"
      : "from-indigo-900 via-blue-900 to-slate-900",
    Clouds: isDay
      ? "from-slate-400 via-blue-300 to-slate-500"
      : "from-slate-700 via-blue-800 to-slate-900",
    Rain: "from-slate-600 via-blue-700 to-slate-800",
    Drizzle: "from-slate-500 via-blue-600 to-slate-700",
    Thunderstorm: "from-slate-800 via-purple-900 to-slate-900",
    Snow: "from-blue-100 via-slate-200 to-blue-200",
    Mist: "from-slate-400 via-gray-400 to-slate-500",
    Fog: "from-gray-400 via-slate-400 to-gray-500",
    Haze: "from-amber-300 via-orange-300 to-amber-400",
    Dust: "from-amber-500 via-orange-400 to-yellow-500",
    Sand: "from-yellow-500 via-amber-400 to-orange-500",
    Smoke: "from-gray-500 via-slate-500 to-gray-600",
    Tornado: "from-gray-700 via-slate-600 to-gray-800",
  };
  return gradients[condition] || (isDay
    ? "from-blue-400 via-sky-400 to-indigo-500"
    : "from-indigo-900 via-blue-900 to-slate-900"); 
};

export const getWindDirection = (degrees) => {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(degrees / 22.5) % 16];
};

export const formatTime = (timestamp, timezone = 0) => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toUTCString().slice(17, 22);
};

export const formatDate = (dt) => {
  return new Date(dt * 1000).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
};

export const formatDay = (dt) => {
  const today = new Date().toDateString();
  const date = new Date(dt * 1000);
  if (date.toDateString() === today) return "Today";
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

export const isDay = (dt, sunrise, sunset) => {
  return dt >= sunrise && dt <= sunset;
};

export const tempDisplay = (temp, units) => {
  return `${temp}°${units === "metric" ? "C" : "F"}`;
};

export const uvIndexLabel = (uvi) => {
  if (uvi <= 2) return { label: "Low", color: "text-green-400" };
  if (uvi <= 5) return { label: "Moderate", color: "text-yellow-400" };
  if (uvi <= 7) return { label: "High", color: "text-orange-400" };
  if (uvi <= 10) return { label: "Very High", color: "text-red-400" };
  return { label: "Extreme", color: "text-purple-400" };
};

export const getWeatherEmoji = (condition) => {
  const map = {
    Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Drizzle: "🌦️",
    Thunderstorm: "⛈️", Snow: "❄️", Mist: "🌫️", Fog: "🌁",
    Haze: "🌤️", Dust: "🌪️", Sand: "🏜️",
  };
  return map[condition] || "🌡️";
};
