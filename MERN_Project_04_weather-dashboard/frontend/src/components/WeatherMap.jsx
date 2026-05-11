import React from "react";
import { useWeather } from "../context/WeatherContext";

const WeatherMap = () => {
  const { currentWeather } = useWeather();
  if (!currentWeather?.coord) return null;

  const { lat, lon } = currentWeather.coord;
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY || "";
  const zoom = 8;

  // OpenWeather tile layers
  const layers = [
    { id: "temp_new", label: "Temp" },
    { id: "precipitation_new", label: "Rain" },
    { id: "wind_new", label: "Wind" },
    { id: "clouds_new", label: "Cloud" },
  ];

  const [activeLayer, setActiveLayer] = React.useState("temp_new");

  // Use openstreetmap as base + OWM overlay
  const mapUrl = `https://tile.openstreetmap.org/${zoom}/${lonToTile(lon, zoom)}/${latToTile(lat, zoom)}.png`;

  return ( 
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/70 text-xs font-display font-semibold uppercase tracking-widest">
          Weather Map
        </h3>
        <div className="flex gap-1">
          {layers.map((l) => (
            <button key={l.id} onClick={() => setActiveLayer(l.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                activeLayer === l.id
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
              }`}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative rounded-2xl overflow-hidden bg-slate-800/50 border border-white/10" style={{ height: 200 }}>
        <iframe
          title="Weather Map"
          className="w-full h-full border-0 opacity-80"
          src={`https://openweathermap.org/weathermap?basemap=map&cities=true&layer=${activeLayer}&lat=${lat}&lon=${lon}&zoom=${zoom}`}
          loading="lazy"
        />
        {/* Location pin overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full shadow-lg ring-4 ring-white/30 animate-pulse-soft" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-white/50 text-xs font-mono">{lat.toFixed(2)}, {lon.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// Helper tile calculators (not used in iframe mode but kept for reference)
function lonToTile(lon, zoom) {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}
function latToTile(lat, zoom) {
  const r = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * Math.pow(2, zoom));
}

export default WeatherMap;
