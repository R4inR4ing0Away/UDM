import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/2logo.png';
import signinBg from '../assets/signin.jpg';
import RoleBasedNavbar from '../components/RoleBasedNavbar';

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/trapkings-api/signin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.message === 'Sign in successful!') {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user.id);
        alert('Logged in successfully!');
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        alert(data.error || 'Sign in failed');
      }
    } catch (error) {
      alert('Sign in failed: ' + error.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: `url(${signinBg}) center center/cover no-repeat`,
      padding: 0,
      margin: 0,
      position: 'relative',
    }}>
      <RoleBasedNavbar />
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2
      }}>
        {/* Left: Sign In Form */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              <label htmlFor="username" style={{ fontWeight: 500, marginBottom: 2 }}>Username</label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
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
              <label htmlFor="password" style={{ fontWeight: 500, marginBottom: 2 }}>Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                style={{
                  padding: '10px',
                  fontSize: '1.1rem',
                  borderRadius: 5,
                  border: '1px solid #888',
                  width: '100%'
                }}
              />
            </div>
            <div style={{ marginBottom: 10, color: '#444', fontSize: 15, textAlign: 'left', width: '100%' }}>
              <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/register')}>
                Not a user? Register here
              </span>
            </div>
            <div style={{ color: '#444', fontSize: 15, textAlign: 'left', width: '100%', marginTop: -6, marginBottom: 10 }}>
              <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/reset-password')}>
                Forgot password? Reset here
              </span>
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
              cursor: 'pointer',
              marginTop: 10,
              letterSpacing: 1
            }}>Sign In</button>
          </form>
        </div>
        {/* Right: Logo and Slogan */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <img src={logo} alt="TrapKings Logo" style={{ width: 340, marginBottom: 30 }} />
        </div>
      </div>
    </div>
  );
};

export default Signin;
