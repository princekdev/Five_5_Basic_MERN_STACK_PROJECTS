import React, { useEffect } from "react";
import { Clock, Trash2, X, ChevronRight } from "lucide-react";
import { useWeather } from "../context/WeatherContext";
import { useAuth } from "../context/AuthContext";
import { getWeatherEmoji } from "../utils/weatherUtils";
import { formatDistanceToNow } from "date-fns";

const SearchHistory = () => {
  const { history, fetchHistory, fetchWeather, removeHistoryItem, clearAllHistory, loading } = useWeather();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) fetchHistory();
  }, [isAuthenticated, fetchHistory]);

  if (!isAuthenticated) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
        <Clock size={24} className="text-white/30 mx-auto mb-2" />
        <p className="text-white/40 text-sm font-body">Sign in to save your search history</p>
      </div>
    );
  }
 
  if (!history.length) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
        <Clock size={24} className="text-white/30 mx-auto mb-2" />
        <p className="text-white/40 text-sm font-body">No recent searches</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/70 text-xs font-display font-semibold uppercase tracking-widest flex items-center gap-2">
          <Clock size={12} /> Recent Searches
        </h3>
        <button
          onClick={clearAllHistory}
          className="text-white/30 hover:text-red-400 text-xs font-body transition-colors flex items-center gap-1"
        >
          <Trash2 size={11} /> Clear all
        </button>
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item._id}
            className="group flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl px-4 py-3 transition-all cursor-pointer"
            onClick={() => !loading && fetchWeather({ city: item.city })}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-lg flex-shrink-0">{getWeatherEmoji(item.condition)}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-body font-medium truncate">{item.city}</span>
                  <span className="text-white/40 text-xs font-mono flex-shrink-0">{item.country}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-white/50 text-xs font-mono">{item.temperature}°</span>
                  <span className="text-white/30 text-xs font-body">{item.condition}</span>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-white/30 text-xs font-body">
                    {formatDistanceToNow(new Date(item.searchedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
              <button
                onClick={(e) => { e.stopPropagation(); removeHistoryItem(item._id); }}
                className="opacity-0 group-hover:opacity-100 p-1 text-white/30 hover:text-red-400 transition-all"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
