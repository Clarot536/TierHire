import React, { useState, useEffect } from 'react';
import './Dashboard.css';

// --- Helper Components for Organization ---

const ProfileHeader = ({ candidate }) => (
  <header className="dashboard-header">
    <img src={candidate.profilePicUrl || '/default-avatar.png'} alt="Profile" className="profile-pic" />
    <div className="header-info">
      <h1>Welcome back, {candidate.fullName}!</h1>
      <p>Status: <span className={`status ${candidate.status?.toLowerCase()}`}>{candidate.status}</span></p>
    </div>
    <div className="header-actions">
      <button>Edit Full Profile</button>
      <button>View Public Profile</button>
    </div>
  </header>
);

const TierStatusCard = ({ domain }) => (
    <div className="card tier-card">
      <h3>{domain.name}</h3>
      <p className="tier-level">Tier {domain.tier}</p>
      <p className="tier-rank">Rank: {domain.rank}/{domain.totalInTier}</p>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${domain.progress}%` }}></div>
      </div>
      <small>{domain.progress}% to next tier threshold</small>
    </div>
);

const UpcomingEventsCard = () => (
    <div className="card">
        <h3>Upcoming Events</h3>
        <div className="event">
            <p><strong>Next Shifting Test</strong></p>
            <p className="countdown">18 days, 9 hours</p>
            <button className="participate-btn">Register Now</button>
        </div>
        <div className="event">
            <p><strong>Next Internal Contest</strong></p>
            <p className="countdown">2 days, 4 hours</p>
            <button className="participate-btn">Join</button>
        </div>
    </div>
);

const MockInterviewCard = () => (
    <div className="card cta-card">
        <h3>Mock Interview Hub</h3>
        <p>Your Interview Readiness Score: <strong>8/10</strong></p>
        <p>You're showing strong problem-solving skills. Test them in a live environment.</p>
        <button className="cta-button">Go to Mock Interview Page</button>
    </div>
);

const DomainNewsCard = ({ news }) => (
    <div className="card">
        <h3>Domain & Tier News</h3>
        <ul className="news-feed">
            {news.map(item => (
                <li key={item.id}>
                    <strong>{item.title}:</strong> {item.body}
                    <small>{new Date(item.timestamp).toLocaleDateString()}</small>
                </li>
            ))}
        </ul>
    </div>
);

const ProfileDetails = ({ candidate }) => {
    const [activeTab, setActiveTab] = useState('skills');

    return (
        <div className="card">
            <div className="tabs">
                <button onClick={() => setActiveTab('bio')} className={activeTab === 'bio' ? 'active' : ''}>Bio</button>
                <button onClick={() => setActiveTab('skills')} className={activeTab === 'skills' ? 'active' : ''}>Skills</button>
                <button onClick={() => setActiveTab('experience')} className={activeTab === 'experience' ? 'active' : ''}>Experience</button>
                <button onClick={() => setActiveTab('projects')} className={activeTab === 'projects' ? 'active' : ''}>Projects</button>
                <button onClick={() => setActiveTab('education')} className={activeTab === 'education' ? 'active' : ''}>Education</button>
            </div>
            <div className="tab-content">
                {activeTab === 'bio' && <p>{candidate.bio}</p>}
                {activeTab === 'skills' && <ul className="profile-list skills-list">{candidate.skills.map(s => <li key={s}>{s}</li>)}</ul>}
                {activeTab === 'experience' && <ul className="profile-list">{candidate.experience.map(e => <li key={e}>{e}</li>)}</ul>}
                {activeTab === 'projects' && <ul className="profile-list">{candidate.projects.map(p => <li key={p}>{p}</li>)}</ul>}
                {activeTab === 'education' && <ul className="profile-list">{candidate.education.map(edu => <li key={edu}>{edu}</li>)}</ul>}
            </div>
        </div>
    );
};

const JourneyTimeline = ({ events }) => (
    <div className="card">
        <h3>Your Journey</h3>
        <div className="timeline">
            {events.map(event => (
                <div className="timeline-item" key={event.id}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                        <div className="timeline-date">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <p>{event.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// --- Main Dashboard Component ---

function Dashboard() {
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from your backend API
    const fetchCandidateData = () => {
      const mockData = {
        fullName: 'Priya Sharma',
        status: 'ACTIVE',
        profilePicUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        domains: [
          { id: 1, name: 'Frontend Development', tier: 1, rank: 22, totalInTier: 120, progress: 85 },
          { id: 2, name: 'UI/UX Design', tier: 2, rank: 45, totalInTier: 200, progress: 70 },
        ],
        domainNews: [
            {id: 1, title: "Recruiter Alert", body: "TechCorp is now actively scouting Tier 1 Frontend developers.", timestamp: "2025-10-10T10:00:00Z"},
            {id: 2, title: "Skill Demand", body: "Demand for Figma skills in Tier 2 has increased by 15% this month.", timestamp: "2025-10-08T14:30:00Z"},
        ],
        bio: "Creative frontend developer with a passion for building intuitive and beautiful user interfaces. Proficient in modern JavaScript frameworks and design principles.",
        skills: ["React", "TypeScript", "Next.js", "GraphQL", "Figma", "CSS-in-JS"],
        experience: ["Frontend Developer at Digital Wave (2023-Present)", "Junior Web Developer at Creative Solutions (2021-2023)"],
        projects: ["Portfolio Website with Next.js", "E-commerce UI Kit"],
        education: ["B.Sc. in Information Technology - Osmania University"],
        timelineEvents: [
            {id: 1, date: "2025-08-15T00:00:00Z", description: "Promoted to Tier 1 in Frontend Development! 🚀"},
            {id: 2, date: "2025-06-01T00:00:00Z", description: "Achieved top 10% score in the Q2 Shifting Test."},
            {id: 3, date: "2025-02-20T00:00:00Z", description: "Joined the platform and placed in Tier 2."},
        ]
      };

      setTimeout(() => {
        setCandidateData(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchCandidateData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading Your Dashboard...</div>;
  }

  return (
    <main className="dashboard-container">
      <ProfileHeader candidate={candidateData} />
      <div className="dashboard-grid">
        <section className="main-content">
          <h2>Tier Status</h2>
          <div className="tier-grid">
            {candidateData.domains.map(domain => (
              <TierStatusCard key={domain.id} domain={domain} />
            ))}
          </div>
          <h2>Profile Summary</h2>
          <ProfileDetails candidate={candidateData} />
          <JourneyTimeline events={candidateData.timelineEvents} />
        </section>
        <aside className="sidebar">
          <UpcomingEventsCard />
          <MockInterviewCard />
          <DomainNewsCard news={candidateData.domainNews} />
        </aside>
      </div>
    </main>
  );
}

export default Dashboard;