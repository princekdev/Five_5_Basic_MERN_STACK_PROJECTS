import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }); 
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }
      try {
        const me = await authService.getMe();
        setUser(me);
        localStorage.setItem("user", JSON.stringify(me));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  }, []);

  const register = useCallback(async (credentials) => {
    const data = await authService.register(credentials);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
