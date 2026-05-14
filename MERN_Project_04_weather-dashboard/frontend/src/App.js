import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { WeatherProvider } from "./context/WeatherContext";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import BackgroundScene from "./components/BackgroundScene";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <WeatherProvider>
        <div className="relative min-h-screen font-body">
          <BackgroundScene />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1"> 
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <footer className="py-3 text-center">
              <p className="text-white/20 text-xs font-body">
                Powered by OpenWeatherMap · Built with MERN Stack
              </p>
            </footer>
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
                color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                borderRadius: "12px",
              },
              success: { iconTheme: { primary: "#4ade80", secondary: "#0f172a" } },
              error: { iconTheme: { primary: "#f87171", secondary: "#0f172a" } },
            }}
          />
        </div>
      </WeatherProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
