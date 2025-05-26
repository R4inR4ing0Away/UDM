import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBox, FaTruck, FaUsers, FaCog, FaSignOutAlt, FaUpload, FaShoppingCart, FaHome } from 'react-icons/fa';
import adminProfileIcon from '../assets/adminprofile.jpg';
import toplogo from '../assets/toplogo.jpg';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    alert('Logged out successfully!');
    navigate('/signin');
  };

  return (
    <header className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 2rem', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      <Link to="/admin" className="logo" style={{ display: 'flex', alignItems: 'center', height: 50, textDecoration: 'none' }}>
        <img src={toplogo} alt="TrapKings Logo" style={{ height: 44, width: 'auto', objectFit: 'contain', marginRight: 8 }} />
      </Link>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/admin" className="nav-item">
            <FaHome /> Home
          </Link>
          <Link to="/admin/order" className="nav-item">
            <FaShoppingCart /> Order
          </Link>
          <Link to="/admin/upload-order" className="nav-item">
            <FaUpload /> Upload Order
          </Link>
          <Link to="/admin/inventory" className="nav-item">
            <FaBox /> Inventory
          </Link>
          <Link to="/admin/manage-user" className="nav-item">
            <FaUsers /> Manage User
          </Link>
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button style={{ border: '1px solid #bbb', borderRadius: '8px', padding: '0.3rem 1.2rem', background: '#fff', fontWeight: 500, cursor: 'pointer' }} onClick={handleLogout}>Log Out</button>
        <Link to="/admin/profile">
          <img src={adminProfileIcon} alt="Admin Profile" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '50%', border: '2px solid #222', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.10)' }} />
        </Link>
      </div>
    </header>
  );
};

export default AdminNavbar;

