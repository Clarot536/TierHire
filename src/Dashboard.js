import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [theme, setTheme] = useState("light");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .dashboard {
      display: flex;
      min-height: 100vh;
      transition: background-color 0.3s ease;
    }

    /* --- THEME VARIABLES --- */
    .dashboard[data-theme='light'] {
      --bg: #f9fafb;
      --text: #111827;
      --sidebar-bg: #ffffff;
      --card-bg: #ffffff;
      --border: #e5e7eb;
      --hover: #f3f4f6;
      --accent: #7c3aed;
      --accent-hover: #6d28d9;
    }

    .dashboard[data-theme='dark'] {
      --bg: #111827;
      --text: #f9fafb;
      --sidebar-bg: #1f2937;
      --card-bg: #1f2937;
      --border: #374151;
      --hover: #374151;
      --accent: #a78bfa;
      --accent-hover: #8b5cf6;
    }

    /* SIDEBAR */
    .sidebar {
      background-color: var(--sidebar-bg);
      width: 240px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-right: 1px solid var(--border);
      transition: width 0.3s ease;
    }

    .sidebar.closed {
      width: 80px;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.2rem;
      border-bottom: 1px solid var(--border);
    }

    .sidebar h2 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text);
      transition: opacity 0.2s;
    }

    .sidebar.closed h2 {
      opacity: 0;
      pointer-events: none;
    }

    .nav {
      flex: 1;
      padding: 1rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 0.8rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
      color: var(--text);
    }

    .nav-item:hover {
      background-color: var(--hover);
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid var(--border);
    }

    .theme-btn, .logout-btn {
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s ease;
    }

    .theme-btn {
      background-color: var(--accent);
      color: white;
      margin-bottom: 0.5rem;
    }

    .theme-btn:hover {
      background-color: var(--accent-hover);
    }

    .logout-btn {
      background-color: transparent;
      color: #ef4444;
    }

    .logout-btn:hover {
      background-color: var(--hover);
    }

    /* MAIN AREA */
    .main {
      flex: 1;
      background-color: var(--bg);
      color: var(--text);
      padding: 2rem;
      transition: background-color 0.3s ease;
    }

    .main-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .main-header h1 {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .profile {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .profile img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    /* CARDS */
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background-color: var(--card-bg);
      padding: 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    }

    .card h3 {
      font-size: 0.9rem;
      color: var(--text);
      margin-bottom: 0.3rem;
    }

    .card p.value {
      font-size: 1.8rem;
      font-weight: 600;
    }

    .card p.desc {
      font-size: 0.9rem;
      color: #6b7280;
    }

    /* ACTIVITY */
    .activity {
      margin-top: 2rem;
      background-color: var(--card-bg);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
    }

    .activity h2 {
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }

    .activity ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .activity li {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0.5rem;
      border-radius: 0.5rem;
      transition: background-color 0.2s ease;
    }

    .activity li:hover {
      background-color: var(--hover);
    }

    .activity time {
      font-size: 0.8rem;
      color: #9ca3af;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard" data-theme={theme}>
        {/* SIDEBAR */}
        <motion.aside
          className={`sidebar ${sidebarOpen ? "" : "closed"}`}
          animate={{ width: sidebarOpen ? 240 : 80 }}
          transition={{ duration: 0.3 }}
        >
          <div className="sidebar-header">
            <h2>Dashboard</h2>
            <button onClick={toggleSidebar}>☰</button>
          </div>

          <nav className="nav">
            <div className="nav-item">📂 My Files</div>
            <div className="nav-item">👥 Shared</div>
            <div className="nav-item">📊 Analytics</div>
            <div className="nav-item">⚙️ Settings</div>
          </nav>

          <div className="sidebar-footer">
            <button className="theme-btn" onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
            <button className="logout-btn">🚪 Logout</button>
          </div>
        </motion.aside>

        {/* MAIN CONTENT */}
        <main className="main">
          <header className="main-header">
            <h1>Welcome back, User 👋</h1>
            <div className="profile">
              <img src="https://i.pravatar.cc/40" alt="User Avatar" />
            </div>
          </header>

          <section className="cards">
            <motion.div className="card" whileHover={{ scale: 1.03 }}>
              <h3>Storage Usage</h3>
              <p className="value">62%</p>
              <p className="desc">Used 62 GB of 100 GB</p>
            </motion.div>

            <motion.div className="card" whileHover={{ scale: 1.03 }}>
              <h3>Recent Uploads</h3>
              <p className="value">8 Files</p>
              <p className="desc">Last synced 10 mins ago</p>
            </motion.div>

            <motion.div className="card" whileHover={{ scale: 1.03 }}>
              <h3>Shared With You</h3>
              <p className="value">14</p>
              <p className="desc">Shared folders and files</p>
            </motion.div>
          </section>

          <section className="activity">
            <h2>Recent Activity</h2>
            <ul>
              <li>
                <span>📄 Project Report.pdf — Uploaded</span>
                <time>2 hours ago</time>
              </li>
              <li>
                <span>🖼️ Design Mockup.png — Shared</span>
                <time>Yesterday</time>
              </li>
              <li>
                <span>📊 Budget.xlsx — Edited</span>
                <time>3 days ago</time>
              </li>
            </ul>
          </section>
        </main>
      </div>
    </>
  );
}
