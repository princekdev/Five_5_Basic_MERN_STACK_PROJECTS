import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const setAuth = useCallback((data) => {
    if (data) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handleLogout = () => setAuth(null);
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [setAuth]);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await authAPI.getMe();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch {
        setAuth(null);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token, setAuth]);

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    setAuth(data);
    toast.success(`Welcome back, ${data.user.username}!`);
    return data;
  };

  const register = async (userData) => {
    const { data } = await authAPI.register(userData);
    setAuth(data);
    toast.success(`Welcome, ${data.user.username}!`);
    return data;
  };

  const logout = () => {
    setAuth(null);
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
 