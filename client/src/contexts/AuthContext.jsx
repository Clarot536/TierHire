import React, { createContext, useContext, useState } from 'react';
import api from '../utils/api'; // Your Axios instance

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
  const [domains, setDomains] = useState(null);

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
      let response = await api.post('/api/users/login', credentials);
      response = await response.data;
      if (response.success) {
        setUser(response.data.user);
        return { success: true, user: response.data };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.response?.data?.message || 'Login failed - fatal' };
    }
  };

 const logout = async () => {
  try {
    console.log("LOGGG OUTTTT")
    await api.post('/api/users/logout',  {}, {
      withCredentials: true
    });
  } catch (error) {
    console.log('Logout error:', error);
  } finally {
    setUser(null);
    setDomains(null);
  }
};

  const value = {
    user,
    domains,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
