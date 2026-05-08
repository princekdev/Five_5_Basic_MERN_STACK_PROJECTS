import React from "react";
import { Wind } from "lucide-react";
import { useWeather } from "../context/WeatherContext";

const AQI_LEVELS = [
  { max: 50,  label: "Good",        color: "text-green-400",  bar: "bg-green-400",  desc: "Air quality is satisfactory." },
  { max: 100, label: "Fair",        color: "text-yellow-400", bar: "bg-yellow-400", desc: "Acceptable air quality." },
  { max: 150, label: "Moderate",    color: "text-orange-400", bar: "bg-orange-400", desc: "Sensitive groups may be affected." },
  { max: 200, label: "Poor",        color: "text-red-400",    bar: "bg-red-400",    desc: "Health effects for everyone." },
  { max: 300, label: "Very Poor",   color: "text-purple-400", bar: "bg-purple-400", desc: "Health warnings of emergency." },
  { max: Infinity, label: "Hazardous", color: "text-rose-500", bar: "bg-rose-500",  desc: "Health alert: serious effects." },
];

const getAQIInfo = (aqi) => AQI_LEVELS.find((l) => aqi <= l.max) || AQI_LEVELS[5];

const PollutantBar = ({ label, value, max, unit }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs"> 
        <span className="text-white/50 font-mono">{label}</span>
        <span className="text-white/70 font-mono">{value} <span className="text-white/30">{unit}</span></span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-blue-400/60 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const AirQualityWidget = ({ aqiData }) => {
  const { currentWeather } = useWeather();
  if (!currentWeather || !aqiData) return null;

  const { aqi, components } = aqiData;
  const info = getAQIInfo(aqi * 50);
  const pct = Math.min((aqi / 5) * 100, 100);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-white/10 rounded-lg">
          <Wind size={13} className="text-white/60" />
        </div>
        <h3 className="text-white/70 text-xs font-display font-semibold uppercase tracking-widest">Air Quality</h3>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <span className={`text-2xl font-display font-bold ${info.color}`}>{info.label}</span>
          <p className="text-white/40 text-xs font-body mt-0.5">{info.desc}</p>
        </div>
        <div className="w-12 h-12 relative">
          <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
            <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
            <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor"
              strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${pct} 100`}
              className={info.color}
              style={{ strokeDasharray: `${(pct / 100) * 100.5} 100.5` }} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-white font-mono text-xs font-bold">
            {aqi}
          </span>
        </div>
      </div>

      {components && (
        <div className="space-y-2 mt-3 pt-3 border-t border-white/10">
          <PollutantBar label="PM2.5" value={components.pm2_5?.toFixed(1)} max={250} unit="μg/m³" />
          <PollutantBar label="PM10"  value={components.pm10?.toFixed(1)}  max={430} unit="μg/m³" />
          <PollutantBar label="NO₂"   value={components.no2?.toFixed(1)}   max={400} unit="μg/m³" />
          <PollutantBar label="O₃"    value={components.o3?.toFixed(1)}    max={240} unit="μg/m³" />
        </div>
      )}
    </div>
  );
};

export default AirQualityWidget;
