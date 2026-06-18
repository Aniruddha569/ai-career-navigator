export default function SkillTag({ skill, type = 'neutral' }) {
  const styles = {
    have: { background: 'rgba(34,197,94,0.1)', color: '#86efac', border: '1px solid rgba(34,197,94,0.3)' },
    missing: { background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' },
    neutral: { background: 'var(--accent-glow)', color: 'var(--accent-light)', border: '1px solid var(--accent)' },
  };
  return (
    <span style={{
      display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
      fontSize: '0.8rem', fontWeight: 500, margin: '3px', ...styles[type]
    }}>{skill}</span>
  );
}