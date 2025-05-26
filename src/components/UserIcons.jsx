import React from 'react';
import { Link } from 'react-router-dom';
import profileIcon from '../assets/profile.png';
import cartIcon from '../assets/cart.png';

const UserIcons = () => (
  <>
    <img src={profileIcon} alt="Profile" style={{ width: 26, height: 26, objectFit: 'contain', marginRight: '0.5rem', cursor: 'pointer' }} />
    <Link to="/cart">
      <img src={cartIcon} alt="Cart" style={{ width: 22, height: 22, objectFit: 'contain', cursor: 'pointer' }} />
    </Link>
  </>
);

export default UserIcons; 