import React, { useState } from 'react';
import { supabase } from './supabase';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const inputStyle = {
    width: '100%', padding: '13px 14px',
    background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 12, color: '#f0ede8', fontSize: 15,
    fontFamily: "'Syne', sans-serif", marginBottom: 12,
    outline: 'none',
  };

  const handleSubmit = async () => {
    setLoading(true); setError(''); setMessage('');
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } }
      });
      if (error) setError(error.message);
      else setMessage('Check your email to confirm your account.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px' }}>
      <div style={{ width: '100%', maxWidth: 390 }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: '#8a8780', letterSpacing: '0.1em', marginBottom: 8 }}>ENDURANCE TRAINING</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#f0ede8', fontFamily: "'Syne', sans-serif" }}>
            Train<br />Smarter.
          </h1>
        </div>

        {mode === 'signup' && (
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Full name" style={inputStyle} />
        )}
        <input value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Email" type="email" style={inputStyle} />
        <input value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Password" type="password" style={inputStyle} />

        {error && <div style={{ fontSize: 13, color: '#e8583a', marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>{error}</div>}
        {message && <div style={{ fontSize: 13, color: '#5ac47a', marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>{message}</div>}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '15px', borderRadius: 12,
          background: '#e8583a', border: 'none', color: '#fff',
          fontSize: 15, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'Syne', sans-serif", marginBottom: 16,
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? 'Loading...' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>

        <div style={{ textAlign: 'center', fontSize: 13, color: '#8a8780' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage(''); }}
            style={{ color: '#e8583a', cursor: 'pointer', fontWeight: 600 }}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </span>
        </div>
      </div>
    </div>
  );
}