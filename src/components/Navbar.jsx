import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profileIcon from '../assets/profile.png';
import cartIcon from '../assets/cart.png';
import adminProfileIcon from '../assets/adminprofile.jpg';
import UserIcons from './UserIcons';
import { FaHome, FaThList, FaEnvelope, FaInfoCircle, FaQuestionCircle, FaRuler } from 'react-icons/fa';
import toplogo from '../assets/toplogo.jpg';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    alert('Logged out successfully!');
    navigate('/signin');
  };

  const profileImg = user && user.role === 'admin' ? adminProfileIcon : profileIcon;

  return (
    <header className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      <div className="logo" style={{ display: 'flex', alignItems: 'center', height: 50 }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center' }}>
          <img src={toplogo} alt="TrapKings Logo" style={{ height: 44, width: 'auto', objectFit: 'contain', marginRight: 8 }} />
        </Link>
      </div>
      <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" className="nav-button" style={{ background: '#f5f5f5', borderRadius: '8px', padding: '0.3rem 1rem', fontWeight: 500 }} onClick={() => window.scrollTo(0, 0)}><FaHome style={{ marginRight: 6, marginBottom: -2 }} />Home</Link>
        <Link to="/products" className="nav-link" onClick={() => window.scrollTo(0, 0)}><FaThList style={{ marginRight: 6, marginBottom: -2 }} />Products</Link>
        <Link to="/contact" className="nav-link" onClick={() => window.scrollTo(0, 0)}><FaEnvelope style={{ marginRight: 6, marginBottom: -2 }} />Contact</Link>
        <Link to="/about" className="nav-link" onClick={() => window.scrollTo(0, 0)}><FaInfoCircle style={{ marginRight: 6, marginBottom: -2 }} />About</Link>
        <Link to="/faqs" className="nav-link" onClick={() => window.scrollTo(0, 0)}><FaQuestionCircle style={{ marginRight: 6, marginBottom: -2 }} />FAQs</Link>
        <Link to="/sizechart" className="nav-link" onClick={() => window.scrollTo(0, 0)}><FaRuler style={{ marginRight: 6, marginBottom: -2 }} />Size Chart</Link>
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {user ? (
          <>
            <button onClick={handleLogout} style={{ border: '1px solid #bbb', borderRadius: '8px', padding: '0.3rem 1.2rem', background: '#fff', fontWeight: 500, cursor: 'pointer' }}>Log Out</button>
            <Link to="/userprofile">
            <img src={profileImg} alt="Profile" style={{ width: 26, height: 26, objectFit: 'contain', marginRight: '0.5rem', cursor: 'pointer' }} />
            </Link>
            <Link to="/usercart">
              <img src={cartIcon} alt="Cart" style={{ width: 22, height: 22, objectFit: 'contain', cursor: 'pointer' }} />
            </Link>
          </>
        ) : (
          <>
            <Link to="/signin">
              <button style={{ border: '1px solid #bbb', borderRadius: '8px', padding: '0.3rem 1.2rem', background: '#fff', fontWeight: 500, cursor: 'pointer', marginRight: '0.5rem' }}>Sign in</button>
            </Link>
            <Link to="/register">
              <button style={{ border: 'none', borderRadius: '8px', padding: '0.3rem 1.2rem', background: '#222', color: '#fff', fontWeight: 500, cursor: 'pointer' }}>Register</button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;