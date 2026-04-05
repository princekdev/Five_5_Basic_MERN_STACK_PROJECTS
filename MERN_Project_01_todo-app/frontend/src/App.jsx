import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e1812',
                color: '#faf8f4',
                borderRadius: '12px',
                fontSize: '13px',
                fontFamily: 'Syne, sans-serif',
                padding: '10px 14px',
                boxShadow: '0 4px 20px rgba(30, 24, 18, 0.2)',
              },
              success: {
                iconTheme: { primary: '#5a7a5a', secondary: '#faf8f4' },
              },
              error: {
                iconTheme: { primary: '#e85d26', secondary: '#faf8f4' },
              },
            }}
          />
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
