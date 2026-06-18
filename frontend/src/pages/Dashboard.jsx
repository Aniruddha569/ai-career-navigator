import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ScoreCard from '../components/ScoreCard';
import Loader from '../components/Loader';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/summary')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;
  const a = data?.latestAnalysis;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Hello, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Here's your placement preparation overview.</p>
      </div>

      {/* Scores */}
      {a ? (
        <div className="grid-3" style={{ marginBottom: '28px' }}>
          <ScoreCard label="Resume score" score={a.resume_score} color="#5b4fff" bg="#ede9ff" />
          <ScoreCard label="ATS score" score={a.ats_score} color="#16a34a" bg="#dcfce7" />
          <ScoreCard label="SAP readiness" score={a.sap_readiness_score || 0} color="#d97706" bg="#fef3c7" />
        </div>
      ) : (
        <div className="card" style={{ marginBottom: '28px', padding: '36px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📄</div>
          <h3 style={{ marginBottom: '8px', fontSize: '1rem' }}>No resume analyzed yet</h3>
          <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', marginBottom: '18px' }}>
            Upload your resume to get AI-powered scores
          </p>
          <Link to="/resume" className="btn btn-primary">Upload resume</Link>
        </div>
      )}

      {/* Actions */}
      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '14px', color: 'var(--text)' }}>
        Quick actions
      </h2>
      <div className="grid-3" style={{ marginBottom: '32px' }}>
        {[
          { to: '/resume', icon: '📄', label: 'Analyze resume', sub: 'Upload and get AI feedback' },
          { to: '/skill-gap', icon: '🎯', label: 'Skill gap', sub: 'Check fit for top companies' },
          { to: '/interview', icon: '🤖', label: 'Interview prep', sub: 'Practice with AI questions' },
        ].map(({ to, icon, label, sub }) => (
          <Link key={to} to={to}>
            <div className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.15s, border-color 0.15s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{icon}</div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '3px' }}>{label}</p>
              <p style={{ color: 'var(--text-2)', fontSize: '0.8rem' }}>{sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Activity */}
      {data?.recentActivity?.length > 0 && (
        <>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '14px' }}>Recent activity</h2>
          <div className="card" style={{ padding: '0 24px' }}>
            {data.recentActivity.map((act, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0', borderBottom: i < data.recentActivity.length - 1 ? '1px solid var(--border)' : 'none'
              }}>
                <span style={{ fontSize: '0.875rem' }}>{act.description}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
                  {new Date(act.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}