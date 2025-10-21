import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Code, 
  Trophy, 
  Users, 
  Briefcase, 
  BarChart3, 
  Settings,
  FileText,
  Target,
  Calendar,
  Star
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const candidateMenuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/domain/selection', icon: Target, label: 'Domains' },
    { path: '/exams', icon: Code, label: 'Problems' },
    { path: '/contests', icon: Trophy, label: 'Exams and Contests' },
    { path: '/profile', icon: Settings, label: 'Profile' }
  ];

  const recruiterMenuItems = [
    { path: '/recruiter/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/recruiter/candidates', icon: Users, label: 'Candidates' },
    { path: '/recruiter/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/recruiter/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/recruiter/contests', icon: Calendar, label: 'Contests' },
    { path: '/profile', icon: Settings, label: 'Profile' }
  ];

  const menuItems = user?.role === 'RECRUITER' ? recruiterMenuItems : candidateMenuItems;

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-header">
          <h3 className="sidebar-title">
            {user?.role === 'RECRUITER' ? 'Recruiter Panel' : 'Candidate Panel'}
          </h3>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path} className="sidebar-item">
                  <Link
                    to={item.path}
                    className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <Icon size={20} className="sidebar-icon" />
                    <span className="sidebar-label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.fullName || user?.username}</p>
              <p className="user-role">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
