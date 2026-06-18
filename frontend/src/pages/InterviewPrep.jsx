import { useState } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';

const COMPANIES = ['SAP Labs', 'Amazon', 'Microsoft', 'Google'];
const parse = (v) => { if (!v) return []; if (Array.isArray(v)) return v; try { return JSON.parse(v); } catch { return []; } };

export default function InterviewPrep() {
  const [company, setCompany] = useState('');
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('technical');

  const tabs = [
    { key: 'technical', label: 'Technical', data: questions?.technicalQuestions },
    { key: 'hr', label: 'HR', data: questions?.hrQuestions },
    { key: 'dsa', label: 'DSA', data: questions?.dsaQuestions },
    { key: 'project', label: 'Projects', data: questions?.projectQuestions },
  ];

  const handleGenerate = async () => {
    if (!company) return;
    setError(''); setLoading(true); setQuestions(null);
    try {
      const res = await api.post('/interview/generate', { targetCompany: company });
      setQuestions(res.data.questions);
      setTab('technical');
    } catch (err) {
      setError(err.response?.data?.message || 'Generation failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Interview preparation</h1>
        <p>AI-generated questions tailored to your resume and target company.</p>
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
        <button className="btn btn-primary" onClick={handleGenerate}
          disabled={!company || loading} style={{ padding: '10px 24px' }}>
          {loading ? 'Generating...' : `Generate for ${company || '...'}`}
        </button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{error}</div>}
      {loading && <Loader text="Generating personalized questions..." />}

      {questions && !loading && (
        <div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: '7px 16px', borderRadius: '7px', fontSize: '0.85rem', fontWeight: 500,
                border: `1.5px solid ${tab === t.key ? 'var(--accent)' : 'var(--border)'}`,
                background: tab === t.key ? 'var(--accent-soft)' : '#fff',
                color: tab === t.key ? 'var(--accent-text)' : 'var(--text-2)',
                cursor: 'pointer', transition: 'all 0.12s'
              }}>{t.label}</button>
            ))}
          </div>
          <div className="card">
            {parse(tabs.find(t => t.key === tab)?.data).map((q, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '14px 0',
                borderBottom: '1px solid var(--border)' }}>
                <span style={{ minWidth: '24px', height: '24px', borderRadius: '50%',
                  background: 'var(--accent-soft)', color: 'var(--accent-text)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 600, flexShrink: 0 }}>{i + 1}</span>
                <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: 1.6 }}>{q}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}