import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// --- Sub-components for Each View ---

const DashboardHomeView = ({ rankingHistory, examHistory }) => {
  const lastExam = examHistory[0];
  const pieData = [
    { name: 'Correct', value: lastExam.correct },
    { name: 'Incorrect', value: lastExam.incorrect },
    { name: 'Not Attempted', value: lastExam.totalQuestions - lastExam.correct - lastExam.incorrect },
  ];
  const COLORS = ['#00C49F', '#FF8042', '#8884d8'];

  return (
    <div className="contentGrid">
      <div className="card largeCard">
        <h3>Ranking Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={rankingHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <XAxis dataKey="month" />
            <YAxis reversed domain={['dataMin - 50', 1]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="rank" stroke="#3b82f6" strokeWidth={2} name="Your Rank" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card mediumCard">
        <h3>Last Exam Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={(entry) => `${entry.name}: ${entry.value}`}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="card fullWidthCard">
        <h3>Exam History</h3>
        <table className="historyTable">
          <thead>
            <tr><th>Date</th><th>Contest Name</th><th>Score</th><th>Rank</th></tr>
          </thead>
          <tbody>
            {examHistory.map(exam => (
              <tr key={exam.id}><td>{exam.date}</td><td>{exam.name}</td><td>{exam.score}%</td><td>{exam.rank}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TierInfoView = ({ tier }) => (
  <div className="card">
    <h2>You are in the <span style={{ color: tier.color }}>{tier.name}</span> Tier</h2>
    <div className="tierDetails">
      <div><strong>Rank Range:</strong> {tier.rankRange}</div>
      <div><strong>Specialty:</strong> {tier.specialty}</div>
      <p><strong>Internal Contests:</strong> {tier.contestInfo}</p>
    </div>
  </div>
);

const RankingView = ({ leaderboard, currentUser }) => (
  <div className="card">
    <h2>Domain Leaderboard</h2>
    <ul className="leaderboard">
      {leaderboard.map(user => (
        <li key={user.rank} className={user.id === currentUser.id ? 'currentUser' : ''}>
          <span className="rank">{user.rank}</span>
          <span className="name">{user.name}</span>
          <span className="score">{user.score} points</span>
        </li>
      ))}
    </ul>
  </div>
);

const JobsAppliedView = ({ jobs }) => (
  <div className="jobList">
    {jobs.map(job => (
      <div key={job.id} className="jobCard">
        <div className="jobCardHeader">
          <h3>{job.title}</h3>
          <span className={`statusBadge ${job.status.toLowerCase()}`}>{job.status}</span>
        </div>
        <p className="companyInfo">{job.company} - {job.location}</p>
        <p className="appliedDate">Applied on: {job.appliedDate}</p>
      </div>
    ))}
  </div>
);

const JobsAvailableView = ({ jobs }) => (
  <div className="jobList">
    {jobs.map(job => (
      <div key={job.id} className="jobCard">
        <div className="jobCardHeader">
          <h3>{job.title}</h3>
          <button className="applyButton">Apply Now</button>
        </div>
        <p className="companyInfo">{job.company} - {job.location}</p>
        <div className="tags">
          {job.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      </div>
    ))}
  </div>
);

const ProjectAnalysisView = () => (
  <div className="card">
    <h2>Project Analysis</h2>
    <p>This section will contain analysis of your projects.</p>
  </div>
);


// --- The Main Dashboard Component ---
const CandidateDomainDashboard = ({ domainData, userData }) => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    // Basic check to prevent errors if data is not yet loaded
    if (!userData || !domainData) {
        return <div className="loading">Loading...</div>;
    }

    switch (activeView) {
      case 'tier':
        return <TierInfoView tier={userData.tier} />;
      case 'ranking':
        return <RankingView leaderboard={domainData.leaderboard} currentUser={userData} />;
      case 'jobsApplied':
        return <JobsAppliedView jobs={userData.appliedJobs} />;
      case 'jobsAvailable':
        return <JobsAvailableView jobs={domainData.availableJobs} />;
      case 'projectAnalysis':
        return <ProjectAnalysisView />;
      case 'dashboard':
      default:
        return <DashboardHomeView rankingHistory={userData.rankingHistory} examHistory={userData.examHistory} />;
    }
  };

  return (
    <div className="dashboardContainer">
      <style>{css}</style>
      <nav className="sidebar">
        <div className="sidebarTabs">
          <button onClick={() => setActiveView('dashboard')} className={`tab ${activeView === 'dashboard' ? 'active' : ''}`}>
            <span className="tabIcon">📊</span> <span className="tabText">Dashboard</span>
          </button>
          <button onClick={() => setActiveView('tier')} className={`tab ${activeView === 'tier' ? 'active' : ''}`}>
            <span className="tabIcon">💎</span> <span className="tabText">My Tier</span>
          </button>
          <button onClick={() => setActiveView('ranking')} className={`tab ${activeView === 'ranking' ? 'active' : ''}`}>
            <span className="tabIcon">📈</span> <span className="tabText">Ranking</span>
          </button>
          <button onClick={() => setActiveView('jobsAvailable')} className={`tab ${activeView === 'jobsAvailable' ? 'active' : ''}`}>
            <span className="tabIcon">💼</span> <span className="tabText">Jobs Available</span>
          </button>
          <button onClick={() => setActiveView('jobsApplied')} className={`tab ${activeView === 'jobsApplied' ? 'active' : ''}`}>
            <span className="tabIcon">✉️</span> <span className="tabText">Jobs Applied</span>
          </button>
          <button onClick={() => setActiveView('projectAnalysis')} className={`tab ${activeView === 'projectAnalysis' ? 'active' : ''}`}>
            <span className="tabIcon">💻</span> <span className="tabText">Project Analysis</span>
          </button>
        </div>
      </nav>

      <main className="mainContent">
        <h1>{domainData?.name || 'Domain'} Overview</h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default CandidateDomainDashboard;


// --- Embedded CSS ---
const css = `
.dashboardContainer {
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f0f2f5;
  min-height: 100vh;
  width: 100%;
}

.sidebar {
  width: 60px;
  background-color: #ffffff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  transition: width 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
  border-radius: 0 20px 20px 0;
  flex-shrink: 0;
}

.sidebar:hover {
  width: 220px;
}

.sidebarTabs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.tab {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #5f6368;
  transition: background-color 0.2s, color 0.2s;
  border-left: 4px solid transparent;
}

.tabIcon {
  font-size: 1.5rem;
  margin: 0 18px;
  flex-shrink: 0;
}

.tabText {
  white-space: nowrap;
  font-size: 1rem;
  font-weight: 500;
}

.tab:hover {
  background-color: #f1f3f4;
  color: #0056b3;
}

.tab.active {
  color: #3b82f6;
  border-left: 4px solid #3b82f6;
  background-color: #e8f0fe;
}

.mainContent {
  flex-grow: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
}

.mainContent h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2rem;
}

.card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.contentGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.largeCard { grid-column: span 2; }
.mediumCard { grid-column: span 1; }
.fullWidthCard { grid-column: span 3; }

.historyTable {
  width: 100%;
  border-collapse: collapse;
}
.historyTable th, .historyTable td {
  padding: 0.8rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}
.historyTable th { font-weight: 600; color: #555; }

.tierDetails { margin-top: 1.5rem; line-height: 1.8; }

.leaderboard { list-style: none; padding: 0; }
.leaderboard li { display: flex; align-items: center; padding: 0.8rem; border-radius: 8px; margin-bottom: 0.5rem; }
.leaderboard .rank { font-weight: 700; width: 50px; }
.leaderboard .name { flex-grow: 1; }
.leaderboard .score { font-weight: 500; }
.currentUser { background-color: #e8f0fe; font-weight: bold; }

.jobList { display: flex; flex-direction: column; gap: 1.5rem; }
.jobCard {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  border-left: 5px solid #3b82f6;
}
.jobCardHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.jobCardHeader h3 { margin: 0; font-size: 1.2rem; }
.companyInfo { color: #555; margin: 0.5rem 0; }
.appliedDate { color: #777; font-size: 0.9rem; }
.statusBadge { padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem; font-weight: 500; color: #fff; }
.viewed { background-color: #3b82f6; }
.shortlisted { background-color: #22c55e; }
.rejected { background-color: #ef4444; }
.applyButton {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
}
.tags { display: flex; gap: 0.5rem; margin-top: 1rem; }
.tag { background-color: #eef2ff; color: #4338ca; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; }
`;