import React, { forwardRef } from 'react';
import logo from '../assets/2logo.png';
import { FaFacebookSquare, FaInstagram, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

const Footer = forwardRef((props, ref) => {
  return (
    <footer ref={ref} style={{ background: '#fff', marginTop: '4rem', boxShadow: '0 -2px 8px rgba(0,0,0,0.03)', fontFamily: 'Montserrat, Arial, sans-serif', width: '100vw', position: 'relative', left: '50%', right: '50%', transform: 'translateX(-50%)' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100vw',
        margin: '0 auto',
        padding: '1.2rem 2.5rem 0.7rem 2.5rem',
        flexWrap: 'wrap',
        gap: '2rem',
      }}>
        {/* About Section */}
        <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', height: '100%' }}>
          <div style={{ width: '100%', textAlign: 'center', marginBottom: 6 }}>
            <img src={logo} alt="TrapKings Logo" style={{ width: 220, height: 'auto', marginBottom: 6, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
          </div>
          <div style={{ fontSize: 15, color: '#222', marginTop: 10, lineHeight: 1.7, textAlign: 'center' }}>
            TrapKings is a clothing inspired by popular streetwear brands popularity grew as he introduced it to friends, who then shared it with their own circles. TrapKings represents the hustle and grind of young entrepreneurs.
          </div>
        </div>
        {/* Contact Us Section */}
        <div style={{ flex: 1, minWidth: 260, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 500, fontSize: 2.1 + 'rem', marginBottom: 18, borderBottom: '3px solid #222', display: 'inline-block', paddingBottom: 2 }}>Contact Us</h2>
          <div style={{ margin: '1.2rem 0', fontSize: 16, color: '#222', textAlign: 'left', display: 'inline-block' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}><FaMapMarkerAlt /> 822 Gabriela St. Tondo, Manila</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}><FaPhoneAlt /> +63-947-1050-509</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}><FaEnvelope /> supporttrapkings@gmail.com</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><FaClock /> Mon-Sat 10AM-11PM</div>
          </div>
        </div>
        {/* Connect with Us Section */}
        <div style={{ flex: 1, minWidth: 260, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 500, fontSize: 2.1 + 'rem', marginBottom: 18, borderBottom: '3px solid #222', display: 'inline-block', paddingBottom: 2 }}>Connect with Us</h2>
          <div style={{ marginTop: 30, display: 'flex', justifyContent: 'center', gap: 30 }}>
            <a href="https://www.facebook.com/profile.php?id=61566621834105" aria-label="Facebook" style={{ color: '#222', fontSize: 32 }} target="_blank" rel="noopener noreferrer"><FaFacebookSquare /></a>
            <a href="https://www.instagram.com/trapkingsph/" aria-label="Instagram" style={{ color: '#222', fontSize: 32 }} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.tiktok.com/@trapkingsofficial28" aria-label="TikTok" style={{ color: '#222', fontSize: 32 }} target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
          </div>
        </div>
      </div>
      {/* Copyright and Policy Bar */}
      <div style={{ background: '#5a5654', color: '#fff', padding: '0.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16, flexWrap: 'wrap', width: '100vw', position: 'relative', left: '50%', right: '50%', transform: 'translateX(-50%)' }}>
        <span>@2025 TrapKings. All right reserved.</span>
        <div style={{ display: 'flex', gap: 40 }}>
          <a href="/trapkings/privacy-policy" style={{ color: '#fff', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/trapkings/terms-of-service" style={{ color: '#fff', textDecoration: 'none' }}>Terms Of Service</a>
        </div>
      </div>
    </footer>
  );
});

export default Footer; 