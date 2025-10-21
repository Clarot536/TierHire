import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  Bell,
  Search
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <span className="logo-text">TierHire</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu desktop-menu">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <Link to="/problems" className="navbar-link">Problems</Link>
              {user?.role === 'RECRUITER' ? (
                <Link to="/recruiter/dashboard" className="navbar-link">Recruiter Dashboard</Link>
              ) : (
                <Link to="/domain/selection" className="navbar-link">Domains</Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
              <Link to="/recruiter/login" className="navbar-link">Recruiter Login</Link>
            </>
          )}
        </div>

        {/* Right side actions */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="navbar-action-btn"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isAuthenticated && (
            <>
              {/* Notifications */}
              <button className="navbar-action-btn" title="Notifications">
                <Bell size={20} />
                <span className="notification-badge">3</span>
              </button>

              {/* Profile Dropdown */}
              <div className="profile-dropdown">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="profile-btn"
                >
                  <div className="profile-avatar">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="profile-name">{user?.fullName || user?.username}</span>
                </button>

                {isProfileOpen && (
                  <div className="profile-menu">
                    <Link 
                      to="/profile" 
                      className="profile-menu-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className="profile-menu-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <hr className="profile-menu-divider" />
                    <button 
                      onClick={handleLogout}
                      className="profile-menu-item logout-btn"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="navbar-action-btn mobile-menu-toggle"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/problems" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
                  Problems
                </Link>
                {user?.role === 'RECRUITER' ? (
                  <Link to="/recruiter/dashboard" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
                    Recruiter Dashboard
                  </Link>
                ) : (
                  <Link to="/domain/selection" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
                    Domains
                  </Link>
                )}
                <Link to="/profile" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
                <Link to="/recruiter/login" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
                  Recruiter Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
