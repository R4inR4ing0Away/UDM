import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import contactBg from '../assets/contact.jpg';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);
    try {
      // Adjust the endpoint as needed for your backend
      await axios.post('http://localhost/trapkings-api/contact.php', form);
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: `url(${contactBg}) center center/cover no-repeat`, paddingTop: 0 }}>
      <Navbar />
      <div style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 60,
        padding: '60px 0 40px 0',
        marginTop: 80,
      }}>
        {/* Contact Form Card */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          padding: '2.5rem 2.5rem 2rem 2.5rem',
          minWidth: 350,
          maxWidth: 400,
          width: '100%',
          margin: '0 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 500, marginBottom: 24, textAlign: 'center' }}>Contact</h1>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #888', fontSize: 16 }}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #888', fontSize: 16 }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={3}
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #888', fontSize: 16, resize: 'vertical' }}
              />
            </div>
            <button type="submit" disabled={submitting} style={{ width: '100%', padding: '12px 0', background: '#333', color: '#fff', border: 'none', borderRadius: 6, fontSize: 17, fontWeight: 500, cursor: 'pointer' }}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
            {success && <div style={{ color: 'green', marginTop: 16, textAlign: 'center' }}>Message sent successfully!</div>}
            {error && <div style={{ color: 'red', marginTop: 16, textAlign: 'center' }}>{error}</div>}
          </form>
        </div>
        {/* Contact Info Card */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          padding: '2.5rem 2.5rem 2rem 2.5rem',
          minWidth: 350,
          maxWidth: 400,
          width: '100%',
          margin: '0 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 500, marginBottom: 24, textAlign: 'left', fontFamily: 'Georgia, serif', textDecoration: 'underline' }}>Contact Information</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}><FaMapMarkerAlt /> 822 Gabriela St. Tondo, Manila</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}><FaPhoneAlt /> +63-947-1050-509</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}><FaEnvelope /> supporttrapkings@gmail.com</div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
