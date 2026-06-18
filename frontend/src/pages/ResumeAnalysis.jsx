import { useState, useEffect } from 'react';
import api from '../services/api';
import ResumeUploader from '../components/ResumeUploader';
import ScoreCard from '../components/ScoreCard';
import Loader from '../components/Loader';

const parse = (v) => { if (!v) return []; if (Array.isArray(v)) return v; try { return JSON.parse(v); } catch { return []; } };

export default function ResumeAnalysis() {
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/resume/latest').then(r => { if (r.data.resume) setResume(r.data.resume); });
    api.get('/resume/latest-analysis').then(r => { if (r.data.analysis) setAnalysis(r.data.analysis); });
  }, []);

  const handleAnalyze = async () => {
    if (!resume) return;
    setError(''); setAnalyzing(true);
    try {
      const res = await api.post(`/resume/analyze/${resume.id}`);
      setAnalysis(res.data.analysis);
    } catch (err) {
      setError('AI rate limit reached. Please wait a moment and try again.');
    } finally { setAnalyzing(false); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Resume analysis</h1>
        <p>Upload your PDF and get an instant AI review.</p>
      </div>

      <ResumeUploader onUploadSuccess={(r) => { setResume(r); setAnalysis(null); }} />

      {resume && (
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="card" style={{ flex: 1, padding: '14px 18px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ color: 'var(--success)', fontSize: '1.2rem' }}>✓</span>
            <div>
              <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{resume.originalName || resume.original_name}</p>
              <p style={{ color: 'var(--text-3)', fontSize: '0.78rem' }}>Ready to analyze</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleAnalyze} disabled={analyzing}
            style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}>
            {analyzing ? 'Analyzing...' : 'Analyze with AI'}
          </button>
        </div>
      )}

      {error && <div className="alert alert-error" style={{ marginTop: '14px' }}>{error}</div>}
      {analyzing && <Loader text="Gemini is reviewing your resume..." />}

      {analysis && !analyzing && (
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Your results</h2>

          <div className="grid-3" style={{ marginBottom: '20px' }}>
            <ScoreCard label="Resume score" score={analysis.resume_score} color="#5b4fff" bg="#ede9ff" />
            <ScoreCard label="ATS score" score={analysis.ats_score} color="#16a34a" bg="#dcfce7" />
            <ScoreCard label="SAP readiness" score={analysis.sap_readiness_score || 0} color="#d97706" bg="#fef3c7" />
          </div>

          <div className="grid-2" style={{ marginBottom: '16px' }}>
            <div className="card">
              <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--success)', marginBottom: '12px' }}>Strengths</p>
              {parse(analysis.strengths).map((s, i) => (
                <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)',
                  fontSize: '0.85rem', color: 'var(--text-2)', display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--success)' }}>✓</span>{s}
                </div>
              ))}
            </div>
            <div className="card">
              <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--danger)', marginBottom: '12px' }}>Weaknesses</p>
              {parse(analysis.weaknesses).map((w, i) => (
                <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)',
                  fontSize: '0.85rem', color: 'var(--text-2)', display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--danger)' }}>✗</span>{w}
                </div>
              ))}
            </div>
          </div>

          {parse(analysis.missing_skills).length > 0 && (
            <div className="card" style={{ marginBottom: '16px' }}>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '12px' }}>Missing skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {parse(analysis.missing_skills).map((s, i) => (
                  <span key={i} className="chip chip-red">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '12px' }}>Suggestions</p>
            {parse(analysis.improvement_suggestions).map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 0',
                borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 600, minWidth: '18px' }}>{i + 1}</span>
                <span style={{ color: 'var(--text-2)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}