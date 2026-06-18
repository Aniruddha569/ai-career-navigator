import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (p) => location.pathname === p;

  if (!user) return null;

  return (
    <header style={{
      background: '#fff', borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <div style={{
        maxWidth: '1100px', margin: '0 auto', padding: '0 24px',
        height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <Link to="/dashboard" style={{
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
          fontSize: '1.05rem', color: 'var(--accent)', letterSpacing: '-0.02em'
        }}>
          CareerAI
        </Link>

        <nav style={{ display: 'flex', gap: '2px' }}>
          {[
            { path: '/dashboard', label: 'Dashboard' },
            { path: '/resume', label: 'Resume' },
            { path: '/skill-gap', label: 'Skill Gap' },
            { path: '/interview', label: 'Interview' },
          ].map(({ path, label }) => (
            <Link key={path} to={path} style={{
              padding: '6px 14px', borderRadius: '7px', fontSize: '0.875rem',
              fontWeight: isActive(path) ? 600 : 400,
              color: isActive(path) ? 'var(--accent)' : 'var(--text-2)',
              background: isActive(path) ? 'var(--accent-soft)' : 'transparent',
              transition: 'all 0.12s'
            }}>{label}</Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'var(--accent-soft)', color: 'var(--accent-text)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 600
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="btn btn-ghost"
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}