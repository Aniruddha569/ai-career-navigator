import { useState } from 'react';
import api from '../services/api';

export default function ResumeUploader({ onUploadSuccess }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') { setError('Only PDF files are allowed.'); return; }
    setError(''); setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUploadSuccess(res.data.resume);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally { setUploading(false); }
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => document.getElementById('resume-input').click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border-2)'}`,
          borderRadius: 'var(--radius)', padding: '48px 24px', textAlign: 'center',
          background: dragging ? 'var(--accent-glow)' : 'var(--bg-secondary)',
          transition: 'all 0.2s', cursor: 'pointer'
        }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📄</div>
        <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {uploading ? 'Uploading...' : 'Drop your resume here or click to browse'}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>PDF only · Max 5MB</p>
        <input id="resume-input" type="file" accept=".pdf" style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])} />
      </div>
      {error && <p className="error-msg" style={{ marginTop: '12px' }}>{error}</p>}
    </div>
  );
}