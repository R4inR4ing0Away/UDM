import React from 'react';
import Navbar from './Navbar';
import AdminNavbar from './AdminNavbar';

const RoleBasedNavbar = () => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {}
  return user && user.role && user.role.toLowerCase() === 'admin' ? <AdminNavbar /> : <Navbar />;
};

export default RoleBasedNavbar; 