import { useState } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';

const COMPANIES = ['SAP Labs', 'Amazon', 'Microsoft', 'Google'];
const parse = (v) => { if (!v) return []; if (Array.isArray(v)) return v; try { return JSON.parse(v); } catch { return []; } };

export default function SkillGap() {
  const [company, setCompany] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!company) return;
    setError(''); setLoading(true); setResult(null);
    try {
      const res = await api.post('/skill-gap/analyze', { targetCompany: company });
      setResult(res.data.result);
    } catch (err) {
      setError(err.response?.data?.message || 'Make sure you have an uploaded resume.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Skill gap analyzer</h1>
        <p>See how your resume compares to top company requirements.</p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <p style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '12px' }}>Target company</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {COMPANIES.map(c => (
            <button key={c} onClick={() => setCompany(c)} style={{
              padding: '8px 18px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 500,
              border: `1.5px solid ${company === c ? 'var(--accent)' : 'var(--border)'}`,
              background: company === c ? 'var(--accent-soft)' : '#fff',
              color: company === c ? 'var(--accent-text)' : 'var(--text-2)',
              cursor: 'pointer', transition: 'all 0.12s'
            }}>{c}</button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={handleAnalyze}
          disabled={!company || loading} style={{ padding: '10px 24px' }}>
          {loading ? 'Analyzing...' : `Analyze for ${company || '...'}`}
        </button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{error}</div>}
      {loading && <Loader text={`Comparing skills with ${company}...`} />}

      {result && !loading && (
        <div>
          <div className="card" style={{ marginBottom: '16px', textAlign: 'center', padding: '28px' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.03em' }}>
              {result.matchPercentage}%
            </div>
            <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', marginTop: '4px' }}>
              Match with <strong>{company}</strong>
            </p>
            <div style={{ marginTop: '14px', height: '8px', background: 'var(--bg-input)',
              borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${result.matchPercentage}%`,
                background: 'var(--accent)', borderRadius: '4px', transition: 'width 0.8s ease' }} />
            </div>
          </div>

          <div className="grid-2" style={{ marginBottom: '16px' }}>
            <div className="card">
              <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--success)', marginBottom: '12px' }}>Skills you have</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {parse(result.matchedSkills).map((s, i) => <span key={i} className="chip chip-green">{s}</span>)}
              </div>
            </div>
            <div className="card">
              <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--danger)', marginBottom: '12px' }}>Missing skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {parse(result.missingSkills).map((s, i) => <span key={i} className="chip chip-red">{s}</span>)}
              </div>
            </div>
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '16px' }}>Learning roadmap</p>
            {parse(result.learningRoadmap).map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', padding: '12px 0',
                borderBottom: '1px solid var(--border)' }}>
                <span style={{ minWidth: '24px', height: '24px', borderRadius: '50%',
                  background: 'var(--accent-soft)', color: 'var(--accent-text)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 600, flexShrink: 0 }}>{i + 1}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{item.skill}</span>
                    <span className={`chip chip-${item.priority === 'High' ? 'red' : item.priority === 'Medium' ? 'yellow' : 'green'}`}>
                      {item.priority}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-2)', fontSize: '0.82rem' }}>{item.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}