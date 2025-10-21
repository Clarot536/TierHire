import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import {
    BarChart2,
    Trophy,
    Target,
    Users,
    Briefcase,
    ArrowRight,
    PlayCircle,
    BookOpen
} from 'lucide-react';
import './DomainDash.css'; // We will create this CSS file next

const DomainDash = () => {
    const { domainId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authLoading) return; // Wait for authentication check to complete

        if (!user) {
            setError("Authentication required. Please log in.");
            setLoading(false);
            return;
        }

        const fetchDomainData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/domains/${domainId}`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch domain data");
                }
                const result = await response.json();
                setDashboardData(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDomainData();
    }, [domainId, user, authLoading]);

    if (authLoading || loading) {
        return <div className="loading-state">Loading Domain Dashboard...</div>;
    }

    if (error) {
        return <div className="error-state">Error: {error}</div>;
    }

    if (!dashboardData) {
        return <div className="loading-state">No data found for this domain.</div>;
    }

    const { domainDetails, candidatePerformance, availableJobs } = dashboardData;

    return (
        <div className="domain-dash">
            <div className="dash-header">
                <div>
                    <h1>{domainDetails.domain_name} Dashboard</h1>
                    <p>{domainDetails.description || 'Your central hub for this domain.'}</p>
                </div>
                <Link to="/contests" className="btn btn-primary">
                    <PlayCircle size={18} /> Join a Contest
                </Link>
            </div>

            {/* --- Stats Grid --- */}
            <div className="stats-grid">
                <div className="stat-card">
                    <Trophy size={24} className="stat-icon gold" />
                    <div className="stat-content">
                        <span className="stat-title">Your Rank</span>
                        <span className="stat-value">#{candidatePerformance?.current_rank || 'N/A'}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <BarChart2 size={24} className="stat-icon blue" />
                    <div className="stat-content">
                        <span className="stat-title">Your Score</span>
                        <span className="stat-value">{candidatePerformance?.total_score || 0}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <Target size={24} className="stat-icon green" />
                    <div className="stat-content">
                        <span className="stat-title">Your Tier</span>
                        <span className="stat-value">{candidatePerformance?.tier_name || 'Unranked'}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <Users size={24} className="stat-icon purple" />
                    <div className="stat-content">
                        <span className="stat-title">Active Candidates</span>
                        <span className="stat-value">{domainDetails.active_candidates}</span>
                    </div>
                </div>
            </div>

            <div className="dash-main-content">
                {/* --- Available Jobs Section --- */}
                <div className="dash-section">
                    <div className="section-header">
                        <h2>Jobs for Your Tier ({candidatePerformance?.tier_name || 'N/A'})</h2>
                        <Link to="/jobs" className="section-link">View All Jobs</Link>
                    </div>
                    <div className="jobs-list">
                        {availableJobs && availableJobs.length > 0 ? (
                            availableJobs.map(job => (
                                <div key={job.job_id} className="job-card">
                                    <div>
                                        <h3 className="job-title">{job.title}</h3>
                                        <p className="job-company">{job.company_name} - {job.location || 'Remote'}</p>
                                    </div>
                                    <Link to={`/jobs/${job.job_id}`} className="btn btn-secondary">
                                        View <ArrowRight size={16} />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="empty-state">No jobs currently available for your tier in this domain. Keep improving your rank!</p>
                        )}
                    </div>
                </div>

                {/* --- Quick Actions Section --- */}
                <div className="dash-section">
                    <div className="section-header">
                        <h2>Quick Actions</h2>
                    </div>
                    <div className="actions-grid">
                        <Link to="/problems" className="action-card">
                            <BookOpen size={24} />
                            <h3>Practice Problems</h3>
                            <p>Sharpen your skills</p>
                        </Link>
                        <Link to="/contests" className="action-card">
                            <Trophy size={24} />
                            <h3>Join a Contest</h3>
                            <p>Compete and climb</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DomainDash;