import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { weatherAPI } from "../services/api";
import { useWeather } from "../context/WeatherContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useDebounce } from "../hooks/useDebounce";
import toast from "react-hot-toast";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { fetchWeather, loading } = useWeather();
  const { getLocation, loading: geoLoading } = useGeolocation();
  const debouncedQuery = useDebounce(query, 350); 
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      setSuggestionsLoading(true);
      try {
        const { data } = await weatherAPI.searchCities(debouncedQuery);
        setSuggestions(data.data);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback(async (cityName) => {
    const city = cityName || query.trim();
    if (!city) return;
    setShowSuggestions(false);
    setQuery(city);
    await fetchWeather({ city });
  }, [query, fetchWeather]);

  const handleGeoLocation = async () => {
    try {
      const coords = await getLocation();
      setQuery("");
      await fetchWeather(coords);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") setShowSuggestions(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-white/60">
          {suggestionsLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Search size={18} />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search for a city..."
          className="w-full pl-11 pr-24 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/40 font-body text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all"
        />
        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              onClick={() => { setQuery(""); setSuggestions([]); }}
              className="p-1.5 text-white/40 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
          <button
            onClick={handleGeoLocation}
            disabled={geoLoading}
            title="Use my location"
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white/70 hover:text-white transition-all disabled:opacity-50"
          >
            {geoLoading ? <Loader2 size={15} className="animate-spin" /> : <MapPin size={15} />}
          </button>
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-40 rounded-xl text-white text-xs font-display font-semibold transition-all"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Search"}
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 animate-fade-in">
          {suggestions.map((city, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(city.name)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left group"
            >
              <MapPin size={14} className="text-white/40 group-hover:text-white/70 flex-shrink-0" />
              <div>
                <span className="text-white text-sm font-body">{city.name}</span>
                {city.state && (
                  <span className="text-white/50 text-xs ml-1">{city.state},</span>
                )}
                <span className="text-white/50 text-xs ml-1">{city.country}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
