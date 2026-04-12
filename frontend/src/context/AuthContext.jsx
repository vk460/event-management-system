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

  const login = async (identifier, password) => {
    try {
      console.log('Attempting login for:', identifier);
      const res = await api.post('auth/login/', { identifier, password });
      const data = res.data;

      if (data.otp_sent) {
        return { success: true, otpSent: true, identifier: data.identifier };
      }

      // Fallback (if bypass ever returned)
      if (data.access) {
         setSession(data.user, data.access, data.refresh);
         return { success: true, bypass: true, user: data.user };
      }

      return { success: true, bypass: false, identifier: data.identifier };
    } catch (err) {
      console.error('Login Error:', err);
      const errorMessage = err.response?.data?.error || 'LOGIN FAILED';
      return { success: false, error: errorMessage };
    }
  };

  const verifyOTP = async (identifier, code) => {
    try {
      const res = await api.post('auth/verify-otp/', { identifier, code });
      const { access, refresh, user: userData } = res.data;
      setSession(userData, access, refresh);
      return userData;
    } catch (err) {
      console.error('OTP Error:', err.response?.data);
      throw new Error(err.response?.data?.error || 'INVALID CODE');
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
