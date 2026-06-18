export default function ScoreCard({ label, score, color = '#5b4fff', bg = '#ede9ff' }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
      <div style={{ position: 'relative', width: '80px', margin: '0 auto 12px' }}>
        <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="40" cy="40" r={r} fill="none" stroke={bg} strokeWidth="5" />
          <circle cx="40" cy="40" r={r} fill="none" stroke={color}
            strokeWidth="5" strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-3)' }}>/100</span>
        </div>
      </div>
      <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-2)' }}>{label}</p>
    </div>
  );
}