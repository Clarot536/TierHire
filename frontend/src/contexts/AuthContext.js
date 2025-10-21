import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api'; // Or your axios instance

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    try {
      // ✅ FIX: This now calls your new, unified endpoint
      const response = await api.get('/api/users/me');

      if (response.data.success) {
        // The user object (candidate or recruiter) is in the 'data' property
        setUser(response.data.data);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.data.message || 'Authentication check failed');
      }
    } catch (error) {
      console.log('User is not authenticated:', error.message);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false); // We are done checking, so stop loading
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

const register = async (userData) => {
    try {
      const response = await api.post('/api/users/register', userData);
      if (response.data.success) {
        return { success: true, message: 'Registration successful' };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const login = async (credentials) => {
    try {
      var response = await api.post('/api/users/login', credentials);
      response = response.data;
      console.log("Response", response);
      if (response.success) {
        // After a successful login, call checkAuthStatus to fetch the full user data
        await checkAuthStatus();
        return { success: true, user : response };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/users/logout');
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render the rest of the app until the auth check is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};