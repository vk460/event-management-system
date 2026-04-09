import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [loading, setLoading] = useState(true);

  const setSession = (userData, access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (username, password) => {
    try {
      console.log('Attempting login for:', username);
      const res = await api.post('auth/login/', { username, password });
      const data = res.data;

      if (data.bypass_otp) {
        setSession(data.user, data.access, data.refresh);
        return { success: true, bypass: true, user: data.user };
      }

      return { success: true, bypass: false, username: data.username };
    } catch (err) {
      console.error('Login Error Object:', err);
      // Extra check for backend specific error messages
      const backendError = err.response?.data?.error || err.response?.data?.detail || 'Login Failed';
      const errorMessage = typeof backendError === 'string' ? backendError : JSON.stringify(backendError);
      
      return { 
        success: false, 
        error: errorMessage.toUpperCase() // Forcing uppercase to match user screenshot style if needed, but keeping message
      };
    }
  };

  const verifyOTP = async (username, otp) => {
    try {
      const res = await api.post('auth/verify-otp/', { username, otp });
      const { access, refresh, user: userData } = res.data;
      setSession(userData, access, refresh);
      return userData;
    } catch (err) {
      console.error('OTP Error:', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, verifyOTP, setSession, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
