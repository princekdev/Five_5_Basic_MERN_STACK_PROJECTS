import React, { useState } from "react";
import { CloudSun, LogOut, User, Thermometer } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWeather } from "../context/WeatherContext";
import AuthModal from "./AuthModal";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { units, toggleUnits } = useWeather();
  const [showAuth, setShowAuth] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
  };

  return ( 
    <>
      <nav className="relative z-10 flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
            <CloudSun size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-display font-bold text-lg leading-none">Nimbus</h1>
            <p className="text-white/40 text-xs font-body leading-none mt-0.5">Weather Dashboard</p>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Unit Toggle */}
          <button onClick={toggleUnits}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white/70 hover:text-white text-xs font-mono font-semibold transition-all">
            <Thermometer size={13} />
            {units === "metric" ? "°C" : "°F"}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl border border-white/10">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <User size={11} className="text-white" />
                </div>
                <span className="text-white text-xs font-body font-medium">{user.username}</span>
              </div>
              <button onClick={handleLogout}
                className="p-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-xl text-white/50 hover:text-red-400 transition-all">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button onClick={() => setShowAuth(true)}
              className="px-4 py-1.5 bg-white/15 hover:bg-white/25 border border-white/15 hover:border-white/25 rounded-xl text-white text-xs font-display font-semibold transition-all">
              Sign in
            </button>
          )}
        </div>
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default Navbar;
