import React from "react";
import { Cloud, MapPin, Search, Zap } from "lucide-react";

const hints = [
  { icon: Search, text: "Type a city name in the search bar above" },
  { icon: MapPin, text: "Click the pin icon to use your current location" },
  { icon: Zap, text: "Sign in to save and revisit your searches" },
];

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
    <div className="relative mb-6">
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
        <Cloud size={48} className="text-white/20 animate-float" />
      </div>
      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
        <Search size={14} className="text-white/40" />
      </div>
    </div>

    <h2 className="text-white font-display font-bold text-2xl mb-2">
      Check the weather
    </h2>
    <p className="text-white/40 font-body text-sm max-w-xs mb-8 leading-relaxed">
      Search any city worldwide to get real-time weather conditions and a 5-day forecast
    </p>
 
    <div className="space-y-3 w-full max-w-xs">
      {hints.map(({ icon: Icon, text }, i) => (
        <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 text-left"
          style={{ animationDelay: `${i * 100}ms` }}>
          <div className="p-1.5 bg-white/10 rounded-lg flex-shrink-0">
            <Icon size={13} className="text-white/60" />
          </div>
          <span className="text-white/50 text-xs font-body">{text}</span>
        </div>
      ))}
    </div>

    {/* Popular cities quick-search */}
    <div className="mt-8">
      <p className="text-white/30 text-xs font-body mb-3 uppercase tracking-wider">Popular cities</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {["New York", "London", "Tokyo", "Sydney", "Paris", "Dubai"].map((city) => (
          <button
            key={city}
            onClick={() => {
              const input = document.querySelector("input[type='text']");
              if (input) {
                const nativeInput = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
                nativeInput.set.call(input, city);
                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.focus();
              }
            }}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-white/50 hover:text-white/80 text-xs font-body transition-all"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default EmptyState;
