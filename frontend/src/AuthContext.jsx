import { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { getProfile, loginUser as loginService, logoutUser as logoutService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // e.g., { id, name, email }
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Fetch profile on initial load
  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const userData = await getProfile(token);
          setUser(userData);
        } catch (err) {
          console.error("Invalid token, logging out", err);
          logout();
        }
      }
      setLoading(false);
    };
    init();
  }, [token]);

  const login = useCallback(async (email, password) => {
    const { token: newToken, user: userData } = await loginService(email, password);
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    logoutService(); // Optional: API call to revoke token
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
