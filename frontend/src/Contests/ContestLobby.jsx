import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ContestLobby.css';

const ContestLobby = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/contests', {credentials : 'include'});
                if (!response.ok) throw new Error('Failed to fetch events.');
                const result = await response.json();
                setEvents(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleStartExam = async (examId) => {
        try {
            const response = await fetch(`/api/exams/start/${examId}`, {
                method: 'POST',
                credentials: 'include'
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            // On success, redirect the user to the contest view page
            navigate(`/contest/${examId}`);
        } catch (err) {
            alert(`Error starting exam: ${err.message}`);
        }
    };

    const getStatus = (startTime, endTime, type) => {
        // Handle on-demand exams, which have no start time
        if (type === 'SHIFTING_TEST' && !startTime) {
            return { text: 'Practice Exam', class: 'practice' };
        }
        
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (now < start) return { text: 'Upcoming', class: 'upcoming' };
        if (now >= start && now <= end) return { text: 'Live', class: 'live' };
        return { text: 'Finished', class: 'finished' };
    };

    if (loading) return <div className="lobby-loading">Loading Events...</div>;
    if (error) return <div className="lobby-error">Error: {error}</div>;

    return (
        <div className="contest-lobby-container">
            <h1>Exams & Contests</h1>
            <div className="event-grid">
                {events.map(event => {
                    const status = getStatus(event.start_time, event.end_time, event.type);
                    return (
                        <div key={event.contest_id} className="event-card">
                            <div className={`status-badge ${status.class}`}>{status.text}</div>
                            <h3>{event.title}</h3>
                            <p className="event-description">{event.description}</p>
                            <div className="event-details">
                                <span><strong>Type:</strong> {event.type.replace('_', ' ')}</span>
                                <span><strong>Duration:</strong> {event.duration_minutes} minutes</span>
                            </div>

                            {/* Conditionally render a "Start Exam" button or a "View Contest" link */}
                            {event.type === 'SHIFTING_TEST' ? (
                                <button onClick={() => handleStartExam(event.contest_id)} className="participate-btn start-exam">
                                    Start Exam
                                </button>
                            ) : (
                                <Link to={`/contest/${event.contest_id}`} className="participate-btn">
                                    View Contest
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ContestLobby;