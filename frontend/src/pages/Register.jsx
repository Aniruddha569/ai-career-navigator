import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', college:'', branch:'', graduationYear:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700,
            fontSize: '1.2rem', color: 'var(--accent)' }}>CareerAI</Link>
          <h2 style={{ marginTop: '14px', fontSize: '1.4rem', fontWeight: 700 }}>Create your account</h2>
          <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', marginTop: '4px' }}>
            Start preparing for your dream internship
          </p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error" style={{ marginBottom: '18px' }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
            <div className="grid-2">
              <div className="field">
                <label>Full name</label>
                <input className="input" placeholder="Aniruddha" value={form.name} onChange={e=>set('name',e.target.value)} />
              </div>
              <div className="field">
                <label>Email</label>
                <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e=>set('email',e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Password</label>
              <input className="input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e=>set('password',e.target.value)} />
            </div>
            <div className="field">
              <label>College (optional)</label>
              <input className="input" placeholder="PCCOE" value={form.college} onChange={e=>set('college',e.target.value)} />
            </div>
            <div className="grid-2">
              <div className="field">
                <label>Branch</label>
                <input className="input" placeholder="Computer Eng." value={form.branch} onChange={e=>set('branch',e.target.value)} />
              </div>
              <div className="field">
                <label>Grad year</label>
                <input className="input" type="number" placeholder="2027" value={form.graduationYear} onChange={e=>set('graduationYear',e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary"
              style={{ width:'100%', justifyContent:'center', padding:'11px', marginTop:'4px' }}
              disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:'18px', fontSize:'0.875rem', color:'var(--text-2)' }}>
            Have an account?{' '}
            <Link to="/login" style={{ color:'var(--accent)', fontWeight:500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}