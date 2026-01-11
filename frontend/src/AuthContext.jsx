import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getCurrentUser()
        .then(res => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(err => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (name, email, password) => {
    try {
      const res = await authAPI.signup({ name, email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Signup failed';
      setError(errorMsg);
      throw errorMsg;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      throw errorMsg;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
