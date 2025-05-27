import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('http://localhost/trapkings-api/reset_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Password successfully changed!');
      } else {
        setMessage(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      setMessage('Failed to reset password: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 60 }}>
        <form onSubmit={handleSubmit} style={{
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          padding: '2.5rem 2.5rem 2rem 2.5rem',
          minWidth: 340,
          maxWidth: 350,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}>
          <h2 style={{ textAlign: 'center', fontWeight: 700, marginBottom: 18 }}>Reset Password</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
            <label htmlFor="email" style={{ fontWeight: 500, marginBottom: 2 }}>Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                padding: '10px',
                fontSize: '1.1rem',
                borderRadius: 5,
                border: '1px solid #888',
                width: '100%'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
            <label htmlFor="newPassword" style={{ fontWeight: 500, marginBottom: 2 }}>New Password</label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              style={{
                padding: '10px',
                fontSize: '1.1rem',
                borderRadius: 5,
                border: '1px solid #888',
                width: '100%'
              }}
            />
          </div>
          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            background: '#222',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: 10,
            letterSpacing: 1
          }} disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
          {message && <div style={{ marginTop: 16, color: message.includes('success') ? 'green' : 'red', textAlign: 'center' }}>{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 