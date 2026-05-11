import React from "react";
import { useWeather } from "../context/WeatherContext";

const HourlyChart = () => {
  const { forecast, units, forecastLoading } = useWeather();

  if (forecastLoading || !forecast.length) return null;

  const temps = forecast.map((d) => d.temperature);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const range = max - min || 1;

  const W = 500;
  const H = 100;
  const pad = { top: 16, bottom: 24, left: 10, right: 10 };
  const chartW = W - pad.left - pad.right; 
  const chartH = H - pad.top - pad.bottom;

  const getX = (i) => pad.left + (i / (forecast.length - 1)) * chartW;
  const getY = (temp) => pad.top + chartH - ((temp - min) / range) * chartH;

  const linePath = forecast
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.temperature)}`)
    .join(" ");

  const areaPath = `${linePath} L ${getX(forecast.length - 1)} ${H - pad.bottom} L ${getX(0)} ${H - pad.bottom} Z`;

  const unit = units === "metric" ? "°C" : "°F";

  return (
    <div className="animate-fade-in">
      <h3 className="text-white/70 text-xs font-display font-semibold uppercase tracking-widest mb-3">
        Temperature Trend
      </h3>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 280 }}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Area */}
          <path d={areaPath} fill="url(#tempGrad)" />
          {/* Line */}
          <path d={linePath} fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Points + labels */}
          {forecast.map((d, i) => (
            <g key={i}>
              <circle cx={getX(i)} cy={getY(d.temperature)} r="3.5" fill="#60a5fa" stroke="#1e293b" strokeWidth="1.5" />
              <text x={getX(i)} y={getY(d.temperature) - 6} textAnchor="middle"
                className="fill-white" fontSize="9" fontFamily="DM Mono, monospace">
                {d.temperature}{unit}
              </text>
              <text x={getX(i)} y={H - 6} textAnchor="middle"
                className="fill-white/40" fontSize="8" fontFamily="DM Sans, sans-serif">
                {new Date(d.dt * 1000).toLocaleDateString("en", { weekday: "short" })}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default HourlyChart;
