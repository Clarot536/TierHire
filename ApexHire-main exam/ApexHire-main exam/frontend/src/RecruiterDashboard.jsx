import React from "react";
import { motion } from "framer-motion";

export default function RecruiterDashboard() {
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

    .dashboard-container {
      font-family: 'Inter', sans-serif;
      background-color: #f9fafb;
      min-height: 100vh;
      padding: 2rem;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      font-size: 1.5rem;
      color: #111827;
    }

    .logout-btn {
      background-color: #ef4444;
      color: white;
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s ease;
    }

    .logout-btn:hover {
      background-color: #dc2626;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background-color: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 18px rgba(0,0,0,0.1);
    }

    .card h3 {
      color: #374151;
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    .card p {
      font-size: 0.9rem;
      color: #6b7280;
    }

    .activity-section {
      margin-top: 2rem;
      background-color: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }

    .activity-section h2 {
      margin-bottom: 1rem;
      color: #111827;
      font-size: 1.1rem;
    }

    .activity-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .activity-section li {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.9rem;
      color: #374151;
    }

    .activity-section li:last-child {
      border-bottom: none;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Recruiter Dashboard</h1>
          <button className="logout-btn">Logout</button>
        </div>

        <section className="cards">
          <motion.div className="card" whileHover={{ scale: 1.03 }}>
            <h3>Active Job Posts</h3>
            <p>5 Open Positions</p>
          </motion.div>

          <motion.div className="card" whileHover={{ scale: 1.03 }}>
            <h3>Applicants</h3>
            <p>42 New Applications</p>
          </motion.div>

          <motion.div className="card" whileHover={{ scale: 1.03 }}>
            <h3>Interviews Scheduled</h3>
            <p>7 This Week</p>
          </motion.div>
        </section>

        <section className="activity-section">
          <h2>Recent Activity</h2>
          <ul>
            <li>
              <span>📄 New candidate applied for “UI Designer”</span>
              <span>2 hours ago</span>
            </li>
            <li>
              <span>👥 Shortlisted “John Doe” for Backend Developer</span>
              <span>Yesterday</span>
            </li>
            <li>
              <span>🗓️ Scheduled interview with “Sarah Lee”</span>
              <span>3 days ago</span>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
