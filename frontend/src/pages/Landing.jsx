import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid var(--border)', padding: '0 48px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700,
          color: 'var(--accent)', fontSize: '1.1rem' }}>CareerAI</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/login" className="btn btn-ghost">Log in</Link>
          <Link to="/register" className="btn btn-primary">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '96px 24px 72px', textAlign: 'center' }}>
        
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700,
          letterSpacing: '-0.03em', marginBottom: '20px', lineHeight: 1.1 }}>
          Crack Internships & Jobs at<br />
          <span style={{ color: 'var(--accent)' }}>Your Dream Companies</span>
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '1.05rem', marginBottom: '36px', lineHeight: 1.7 }}>
          AI-powered resume analysis, skill-gap detection, and personalized
          interview preparation for ambitious students.
        </p>
        <Link to="/register" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
          Analyze my resume free
        </Link>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px 96px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px' }}>
        {[
          { icon: '📊', title: 'Resume Score', desc: 'ATS score, quality score, and SAP readiness — instantly.' },
          { icon: '🎯', title: 'Skill Gap', desc: 'Exact missing skills for SAP Labs, Amazon, Microsoft, Google.' },
          { icon: '🤖', title: 'Interview Prep', desc: 'Technical, HR, DSA, and project questions from your resume.' },
          { icon: '📈', title: 'Progress', desc: 'Track improvement across all metrics over time.' },
        ].map(f => (
          <div key={f.title} className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '10px' }}>{f.icon}</div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px' }}>{f.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}