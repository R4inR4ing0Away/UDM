import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/2logo.png';
import bg from '../assets/2back.jpg';
import '../App.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost/trapkings-api/register.php',
        formData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (response.data.message === 'User registered successfully!') {
        alert('Registered successfully!');
        navigate('/signin');
      } else {
        alert(
          (response.data.error ? response.data.error + ': ' + (response.data.details || '') : 'Registration failed')
        );
      }
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.error || error.message));
      console.error('Registration failed:', error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: `url(${bg}) center center/cover no-repeat`,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      margin: 0
    }}>
      {/* Left Side - Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: '#222',
        minWidth: 350
      }}>
        <img src={logo} alt="TrapKings Logo" style={{ width: 300, marginBottom: 10 }} />
      </div>
      {/* Right Side - Form */}
      <div style={{
        background: '#fff',
        padding: '2.5rem 2.5rem 2rem 2.5rem',
        borderRadius: 10,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        width: '100%',
        maxWidth: 400,
        margin: '0 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h2 style={{ marginBottom: 30, fontWeight: 400 }}>Create Account</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="username" style={{ alignSelf: 'flex-start', marginBottom: 2 }}>Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="email" style={{ alignSelf: 'flex-start', marginBottom: 2 }}>Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="password" style={{ alignSelf: 'flex-start', marginBottom: 2 }}>Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
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
            padding: '12px',
            background: '#222',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            fontSize: '1.1rem',
            fontWeight: 500,
            cursor: 'pointer',
            marginTop: 10 
          }}>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;