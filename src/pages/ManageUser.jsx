import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoleBasedNavbar from '../components/RoleBasedNavbar';
import '../App.css';

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user'
  });
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost/trapkings-api/manage_users.php');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put('http://localhost/trapkings-api/manage_users.php', {
          ...formData,
          id: editingUser.id
        });
        setNotification({ message: 'User updated successfully!', type: 'success' });
      } else {
        await axios.post('http://localhost/trapkings-api/manage_users.php', formData);
        setNotification({ message: 'User added successfully!', type: 'success' });
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      setNotification({ message: 'Error saving user.', type: 'error' });
    }
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      email: user.email,
      role: user.role
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost/trapkings-api/manage_users.php?id=${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      email: '',
      role: 'user'
    });
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-user-page" style={{ background: '#fafafa', minHeight: '100vh' }}>
      <RoleBasedNavbar />
      <div style={{ maxWidth: 1200, margin: '80px auto 40px auto', padding: '0 20px' }}>
        {notification.message && (
          <div style={{
            marginBottom: 18,
            padding: '12px 20px',
            borderRadius: 8,
            background: notification.type === 'success' ? '#e6f9ed' : '#ffeaea',
            color: notification.type === 'success' ? '#1a7f37' : '#d32f2f',
            fontWeight: 600,
            fontSize: 16,
            textAlign: 'center',
            border: notification.type === 'success' ? '1px solid #b2e2c7' : '1px solid #f5bdbd'
          }}>
            {notification.message}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>Manage Users</h1>
          <div style={{ display: 'flex', gap: 16 }}>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid #ddd',
                width: 200
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24 }}>
          {/* User List */}
          <div style={{ flex: 2, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <th style={{ textAlign: 'left', padding: '12px 0', color: '#666' }}>Username</th>
                  <th style={{ textAlign: 'left', padding: '12px 0', color: '#666' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '12px 0', color: '#666' }}>Role</th>
                  <th style={{ textAlign: 'left', padding: '12px 0', color: '#666' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 0' }}>{user.username}</td>
                    <td style={{ padding: '12px 0' }}>{user.email}</td>
                    <td style={{ padding: '12px 0' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        background: user.role === 'admin' ? '#e6f3ff' : '#f0f0f0',
                        color: user.role === 'admin' ? '#0066cc' : '#666',
                        fontSize: 14
                      }}>
                        {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 0' }}>
                      <button
                        onClick={() => handleEdit(user)}
                        style={{
                          padding: '6px 12px',
                          background: '#f0f0f0',
                          border: 'none',
                          borderRadius: 4,
                          marginRight: 8,
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#ffebee',
                          border: 'none',
                          borderRadius: 4,
                          color: '#d32f2f',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User Form */}
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#666' }}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 14
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#666' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 14
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#666' }}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 14
                  }}
                  required={!editingUser}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#666' }}>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 14,
                    background: '#fff'
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#222',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 16,
                  cursor: 'pointer'
                }}
              >
                {editingUser ? 'Update User' : 'Add User'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUser; 