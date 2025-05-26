import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import './AdminHome.css';
import { FaUserCircle, FaLock } from 'react-icons/fa';
import databaseBg from '../assets/databasehome.jpg';

const AdminProfile = () => {
  const [password, setPassword] = useState('');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [username, setUsername] = useState('');
  const [displayUsername, setDisplayUsername] = useState('');
  const [email, setEmail] = useState('');
  const [originalUsername, setOriginalUsername] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');

  // At the top of the component, get admin name from localStorage
  let localAdminName = '';
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'admin') localAdminName = user.username || '';
  } catch {}

  // Fetch admin info on mount and after save
  const fetchAdminInfo = async () => {
    try {
      const res = await fetch('http://localhost/trapkings-api/get_admin_info.php');
      const result = await res.json();
      if (result.success) {
        setUsername(result.username);
        setDisplayUsername(result.username);
        setEmail(result.email);
        setOriginalUsername(result.username);
        setOriginalEmail(result.email);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  const handleSave = async () => {
    const confirmed = window.confirm('Are you sure you want to save these changes?');
    if (!confirmed) return;

    // Only send changed fields
    const updateData = {};
    if (username && username !== originalUsername) updateData.username = username;
    if (email && email !== originalEmail) updateData.email = email;
    if (password) updateData.password = password;
    if (Object.keys(updateData).length === 0) {
      setEditing(false);
      return;
    }
    try {
      // Update admin info
      const res = await fetch('http://localhost/trapkings-api/update_admin_info.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      const result = await res.json();
      if (result.success) {
        setEditing(false);
        setSaved(true);
        setPassword(''); // Clear password field after successful save
        await fetchAdminInfo(); // Refresh admin info from backend
        // Update localStorage user object with new username if changed
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          if (user && user.role === 'admin' && updateData.username) {
            user.username = username;
            localStorage.setItem('user', JSON.stringify(user));
          }
        } catch {}
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert('Failed to save changes: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to save changes: ' + error.message);
    }
  };

  return (
    <div
      className="admin-dashboard-bg"
      style={{
        minHeight: '100vh',
        background: `url(${databaseBg}) center center/cover no-repeat fixed`,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.60)',
          backdropFilter: 'blur(2px)',
          zIndex: 1,
        }}
      ></div>
      <AdminNavbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', paddingTop: 60, position: 'relative', zIndex: 2 }}>
        <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: '32px 40px 24px 40px', marginBottom: 36, border: '2px solid #222', textAlign: 'center', marginTop: 48 }}>
          <h1 style={{ fontWeight: 700, fontSize: 38, marginBottom: 8, marginTop: 0 }}>Welcome Back, {localAdminName || displayUsername || 'Admin'}</h1>
          <div style={{ color: '#444', fontSize: 18 }}>Here's a quick look at your account activity.</div>
        </div>
        <div style={{ display: 'flex', gap: 48, justifyContent: 'center', alignItems: 'flex-start' }}>
          {/* General Card */}
          <div style={{ flex: 1, minWidth: 320, background: 'rgba(255,255,255,0.97)', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: 32, marginBottom: 24, border: '2px solid #222' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <FaUserCircle size={32} />
              <span style={{ fontWeight: 700, fontSize: 22 }}>General</span>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 6 }}>Username:</div>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                readOnly={!editing}
                placeholder="Change username (optional)"
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#f5f5f5',
                  fontSize: 16,
                  fontWeight: 500,
                  marginBottom: 8,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 6 }}>Email:</div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                readOnly={!editing}
                placeholder="Change email (optional)"
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#f5f5f5',
                  fontSize: 16,
                  fontWeight: 500,
                  marginBottom: 8,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
              />
            </div>
          </div>
          {/* Security Card */}
          <div style={{ flex: 1, minWidth: 320, background: 'rgba(255,255,255,0.97)', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', padding: 32, marginBottom: 24, border: '2px solid #222' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <FaLock size={32} />
              <span style={{ fontWeight: 700, fontSize: 22 }}>Security</span>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 6 }}>Change Password:</div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter new password"
                readOnly={!editing}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#f5f5f5',
                  fontSize: 16,
                  fontWeight: 500,
                  marginBottom: 8,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
              />
              {editing ? (
                <button
                  onClick={handleSave}
                  style={{
                    background: '#222',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 28px',
                    fontWeight: 600,
                    fontSize: 16,
                    marginTop: 8,
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    background: '#888',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 28px',
                    fontWeight: 600,
                    fontSize: 16,
                    marginTop: 8,
                    cursor: 'pointer',
                  }}
                >
                  Edit Profile
                </button>
              )}
              {saved && <div style={{ color: 'green', marginTop: 10, fontWeight: 500 }}>Profile updated successfully!</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile; 