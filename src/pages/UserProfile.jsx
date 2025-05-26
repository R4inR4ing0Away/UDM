import React, { useState, useEffect } from 'react';
import { FaBoxOpen, FaTruck, FaUser, FaKey, FaMapMarkerAlt, FaHistory, FaHeadset } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function getAddressKey() {
  const userId = localStorage.getItem('userId');
  return userId ? `address_${userId}` : 'address_guest';
}

const ShippingAddressForm = ({ onSave }) => {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Load saved address if exists
    const saved = localStorage.getItem(getAddressKey());
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        setFullName(obj.fullName || '');
        setAddress(obj.address || '');
        setNote(obj.note || '');
      } catch {}
    }
  }, []);

  const handleSave = () => {
    const data = { fullName, address, note };
    localStorage.setItem(getAddressKey(), JSON.stringify(data));
    setSuccess(true);
    setShowNotification(true);
    if (onSave) onSave();
    setTimeout(() => setSuccess(false), 2000);
    setTimeout(() => setShowNotification(false), 2500);
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: 350 }}>
      <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 18 }}>Shipping Information</h2>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontWeight: 500, fontSize: 16, display: 'block', marginBottom: 6 }}>Full Name</label>
        <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16, marginBottom: 0 }} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontWeight: 500, fontSize: 16, display: 'block', marginBottom: 6 }}>Address</label>
        <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16, marginBottom: 0 }} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontWeight: 500, fontSize: 16, display: 'block', marginBottom: 6 }}>Delivery note</label>
        <textarea placeholder="Delivery Note" value={note} onChange={e => setNote(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc', fontSize: 16, minHeight: 60 }} />
      </div>
      <button
        style={{ width: '100%', background: '#222', color: '#fff', padding: 16, borderRadius: 8, fontSize: 18, fontWeight: 600, border: 'none', cursor: 'pointer' }}
        onClick={handleSave}
      >
        Save shipping information
      </button>
      {success && <div style={{ color: 'green', marginTop: 12, fontWeight: 500 }}>Shipping information saved!</div>}
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: 30,
          right: 30,
          background: '#222',
          color: '#fff',
          padding: '16px 28px',
          borderRadius: 10,
          fontWeight: 600,
          fontSize: 17,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 9999
        }}>
          Shipping information updated!<br />You will see this change in checkout.
        </div>
      )}
    </div>
  );
};

const placeholderContent = (label) => (
  <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: 350 }}>
    <h2 style={{ fontWeight: 700, fontSize: 26 }}>{label}</h2>
    <div style={{ color: '#888', fontSize: 16, marginTop: 12 }}>Content for {label} will go here.</div>
  </div>
);

const menuItems = [
  { key: 'profile', label: 'Profile Info', icon: <FaUser /> },
  { key: 'password', label: 'Change Password', icon: <FaKey /> },
  { key: 'shipping', label: 'Shipping Address', icon: <FaMapMarkerAlt /> },
  { key: 'orders', label: 'Order History', icon: <FaHistory /> },
  { key: 'support', label: 'Support/Returns', icon: <FaHeadset /> },
];

const InTransitOrders = ({ onOrderAction }) => {
  const [orders, setOrders] = useState([]);
  const [inTransitOrders, setInTransitOrders] = useState([]);

  useEffect(() => {
    const userEmail = JSON.parse(localStorage.getItem('user'))?.email;
    if (!userEmail) return;
    axios.get(`http://localhost/trapkings-api/get_users_orders.php?email=${encodeURIComponent(userEmail)}`)
      .then(res => {
        if (res.data.success) {
          const allOrders = res.data.orders;
          setOrders(allOrders);
          setInTransitOrders(allOrders.filter(order => order.status === 'in_transit'));
        }
      });
  }, []);

  if (inTransitOrders.length === 0) {
    return (
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: 350 }}>
        <h2 style={{ fontWeight: 700, fontSize: 26 }}>In Transit</h2>
        <div style={{ color: '#888', fontSize: 16, marginTop: 12 }}>You have no orders in transit.</div>
      </div>
    );
  }

  const handleReceived = async (orderId) => {
    if (!window.confirm('Mark this order as received?')) return;
    try {
      await fetch('http://localhost/trapkings-api/update_order_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, status: 'received' })
      });
      // Refresh orders after marking as received
      const userEmail = JSON.parse(localStorage.getItem('user'))?.email;
      if (userEmail) {
        axios.get(`http://localhost/trapkings-api/get_users_orders.php?email=${encodeURIComponent(userEmail)}`)
          .then(res => {
            if (res.data.success) {
              const allOrders = res.data.orders;
              setOrders(allOrders);
              setInTransitOrders(allOrders.filter(order => order.status === 'in_transit'));
            }
          });
      }
      if (onOrderAction) onOrderAction();
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: 350 }}>
      <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 18 }}>In Transit</h2>
      {inTransitOrders.map(order => (
        <div key={order.id} style={{ borderBottom: '1px solid #eee', marginBottom: 24, paddingBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Full name: {order.full_name || order.name}</div>
          <div style={{ fontSize: 15, color: '#666', marginBottom: 6 }}>Shipping Address: {order.shipping_address}</div>
          <div style={{ fontSize: 15, color: '#666', marginBottom: 6 }}>Delivery Note: {order.delivery_note}</div>
          <div style={{ fontSize: 15, color: '#666', marginBottom: 6 }}>Shipping: ₱{order.shipping}</div>
          <div style={{ fontSize: 15, color: '#666', marginBottom: 6 }}>Total Order: ₱{Number(order.total).toLocaleString('en-US')}</div>
          <div style={{ fontSize: 15, color: '#666', marginBottom: 6 }}>Method of Payment: {order.method_of_payment || 'Cash on Delivery'}</div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>Items:</div>
            {(() => {
              let items = order.items;
              if (typeof items === 'string') {
                try { items = JSON.parse(items); } catch { items = []; }
              }
              if (Array.isArray(items)) {
                return items.map((item, idx) => (
                  <div key={idx} style={{ marginLeft: 12, marginBottom: 2, fontSize: 15 }}>
                    • {item.name} {item.size ? `(Size: ${item.size})` : ''} x{item.quantity || 1} - ₱{Number(item.price).toLocaleString('en-US')}
              </div>
                ));
              }
              return 'No items data available';
            })()}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <button
              onClick={() => handleReceived(order.id)}
              style={{
                background: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 18px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Order Received
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const MyOrders = ({ onOrderAction }) => {
  const [orders, setOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    const userEmail = JSON.parse(localStorage.getItem('user'))?.email;
    if (!userEmail) return;
    axios.get(`http://localhost/trapkings-api/get_users_orders.php?email=${encodeURIComponent(userEmail)}`)
      .then(res => {
        if (res.data.success) {
          const allOrders = res.data.orders;
          setOrders(allOrders);
          setMyOrders(allOrders.filter(order => order.status === 'active'));
        }
      });
  }, []);

  if (myOrders.length === 0) {
    return (
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: 350 }}>
        <h2 style={{ fontWeight: 700, fontSize: 26 }}>My Orders</h2>
        <div style={{ color: '#888', fontSize: 16, marginTop: 12 }}>You have no active orders.</div>
      </div>
    );
  }

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await fetch('http://localhost/trapkings-api/cancel_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId })
      });
      setMyOrders(prev => prev.filter(order => order.id !== orderId));
      setOrders(prev => prev.filter(order => order.id !== orderId));
      if (onOrderAction) onOrderAction();
    } catch (err) {
      alert('Failed to cancel order.');
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: 350 }}>
      <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 18 }}>My Orders</h2>
      {myOrders.map(order => (
        <div key={order.id} style={{ borderBottom: '1px solid #eee', marginBottom: 24, paddingBottom: 20 }}>
          <div style={{ fontSize: 16, marginBottom: 6 }}>
            <strong>Full name:</strong> {order.full_name || order.name}
          </div>
          <div style={{ fontSize: 16, marginBottom: 6 }}>
            <strong>Shipping Address:</strong> {order.shipping_address}
          </div>
          <div style={{ fontSize: 16, marginBottom: 6 }}>
            <strong>Delivery Note:</strong> {order.delivery_note}
          </div>
          <div style={{ fontSize: 16, marginBottom: 6 }}>
            <strong>Shipping:</strong> ₱{Number(order.shipping).toLocaleString('en-US')}
          </div>
          <div style={{ fontSize: 16, marginBottom: 6 }}>
            <strong>Total Order:</strong> ₱{Number(order.total).toLocaleString('en-US')}
          </div>
          <div style={{ fontSize: 16, marginBottom: 12 }}>
            <strong>Method of Payment:</strong> {order.method_of_payment || 'Cash on Delivery'}
          </div>
          
          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Items:</div>
            <div style={{ marginLeft: 16, marginBottom: 4, fontSize: 15 }}>
              {(() => {
                const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                if (Array.isArray(items)) {
                  return items.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      • {item.name} {item.size ? `(Size: ${item.size})` : ''}
                      <br />
                      <span style={{ marginLeft: 12, color: '#666' }}>
                        Quantity: {item.quantity} - ₱{Number(item.price).toLocaleString('en-US')}
                      </span>
                    </div>
                  ));
                }
                return 'No items data available';
              })()}
              </div>
          </div>
          
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <button 
              onClick={() => handleCancel(order.id)} 
              style={{ 
                background: '#d32f2f', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 8, 
                padding: '8px 18px', 
                fontWeight: 600, 
                cursor: 'pointer' 
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const userEmail = JSON.parse(localStorage.getItem('user'))?.email;
    if (!userEmail) return;
    axios.get(`http://localhost/trapkings-api/get_users_orders.php?email=${encodeURIComponent(userEmail)}`)
      .then(res => {
        if (res.data.success) {
          const allOrders = res.data.orders;
          setOrders(allOrders);
          setOrderHistory(allOrders.filter(order => order.status === 'received' || order.status === 'cancelled'));
        }
      });
  }, []);

  if (orderHistory.length === 0) {
    return (
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: 350 }}>
        <h2 style={{ fontWeight: 700, fontSize: 26 }}>Order History</h2>
        <div style={{ color: '#888', fontSize: 16, marginTop: 12 }}>You have no completed or cancelled orders yet.</div>
      </div>
    );
  }

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order from your history?')) return;
    try {
      await fetch('http://localhost/trapkings-api/delete_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId })
      });
      setOrderHistory(orderHistory.filter(order => order.id !== orderId));
    } catch (err) {
      alert('Failed to delete order.');
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: 350 }}>
      <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 18 }}>Order History</h2>
      {orderHistory.map(order => (
        <div key={order.id} style={{ borderBottom: '1px solid #eee', marginBottom: 24, paddingBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Full name: {order.full_name || order.name}</div>
          <div style={{ fontSize: 15, color: '#666', marginBottom: 6 }}>Shipping Address: {order.shipping_address}</div>
          <div style={{ fontSize: 15, color: '#666', marginBottom: 6 }}>Delivery Note: {order.delivery_note}</div>
          <div style={{ fontSize: 15, color: '#666', marginBottom: 6 }}>Shipping: ₱{order.shipping}</div>
          <div style={{ fontSize: 15, color: '#666', marginBottom: 6 }}>Total Order: ₱{Number(order.total).toLocaleString('en-US')}</div>
          <div style={{ fontSize: 15, color: '#666', marginBottom: 6 }}>Method of Payment: {order.method_of_payment || 'Cash on Delivery'}</div>
          <div style={{ fontSize: 15, color: order.status === 'received' ? 'green' : '#d32f2f', fontWeight: 600, marginBottom: 6 }}>Status: {order.status === 'received' ? 'Received' : 'Cancelled'}</div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>Items:</div>
            {(() => {
              let items = order.items;
              if (typeof items === 'string') {
                try { items = JSON.parse(items); } catch { items = []; }
              }
              if (Array.isArray(items)) {
                return items.map((item, idx) => (
                  <div key={idx} style={{ marginLeft: 12, marginBottom: 2, fontSize: 15 }}>
                    • {item.name} {item.size ? `(Size: ${item.size})` : ''} x{item.quantity || 1} - ₱{Number(item.price).toLocaleString('en-US')}
              </div>
                ));
              }
              return 'No items data available';
            })()}
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 12 }}>
            <button onClick={() => handleDelete(order.id)} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProfileInfoForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch user info from backend
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    setLoading(true);
    fetch('http://localhost/trapkings-api/get_user_info.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsername(data.username);
          setEmail(data.email);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      const res = await fetch('http://localhost/trapkings-api/update_user_info.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, username, email })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        // Update localStorage user
        const user = JSON.parse(localStorage.getItem('user')) || {};
        user.username = username;
        user.email = email;
        localStorage.setItem('user', JSON.stringify(user));
        setTimeout(() => setSuccess(false), 2000);
        setTimeout(() => window.location.reload(), 1000); // Reload after 1s
      } else {
        // No error message needed
      }
    } catch (err) {
      // No error message needed
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: 350, maxWidth: 480, margin: '0 auto' }}>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 18 }}>Profile Info</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 22 }}>
          <label style={{ fontWeight: 600, fontSize: 16, display: 'block', marginBottom: 8 }}>Change Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Change Username"
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #222', fontSize: 16, marginBottom: 0 }}
            required
          />
        </div>
        <div style={{ marginBottom: 32 }}>
          <label style={{ fontWeight: 600, fontSize: 16, display: 'block', marginBottom: 8 }}>Change Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Change Email"
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #222', fontSize: 16, marginBottom: 0 }}
            required
          />
        </div>
        <button type="submit" style={{ width: '100%', background: '#111', color: '#fff', padding: 14, borderRadius: 8, fontSize: 20, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'serif' }}>
          Save Profile Information
        </button>
        {success && <div style={{ color: 'green', marginTop: 16, fontWeight: 500 }}>Profile updated successfully!</div>}
        {loading && <div style={{ color: '#888', marginTop: 16 }}>Loading...</div>}
      </form>
    </div>
  );
};

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    if (!currentPassword || !password) {
      setError('Please fill in both fields');
      return;
    }
    // Verify current password
    try {
      const verifyRes = await fetch('http://localhost/trapkings-api/verify_user_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, password: currentPassword })
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        setError('Current password is incorrect');
        return;
      }
    } catch (err) {
      setError('Failed to verify current password');
      return;
    }
    // Update password
    try {
      const res = await fetch('http://localhost/trapkings-api/update_user_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, password })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setEditing(false);
        setPassword('');
        setCurrentPassword('');
        setTimeout(() => setSuccess(false), 2000);
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setError('Failed to update password');
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: 350, maxWidth: 420, margin: '0 auto', boxSizing: 'border-box' }}>
      <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 18 }}>Change Password</h2>
      <form onSubmit={handleSave}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, fontSize: 18, display: 'block', marginBottom: 8 }}>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            disabled={!editing}
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #222', fontSize: 18, marginBottom: 0, fontFamily: 'serif', boxShadow: '0 2px 6px rgba(0,0,0,0.10)' }}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, fontSize: 18, display: 'block', marginBottom: 8 }}>Change password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Change Password"
            disabled={!editing}
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #222', fontSize: 18, marginBottom: 0, fontFamily: 'serif', boxShadow: '0 2px 6px rgba(0,0,0,0.10)' }}
          />
        </div>
        <div style={{ marginBottom: 12, fontSize: 16, color: '#222', fontFamily: 'serif', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.location.href = '/trapkings/reset-password'}>
          Forgot Password? Click Here
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 18 }}>
          <button
            type="button"
            onClick={() => setEditing(true)}
            disabled={editing}
            style={{
              flex: 1,
              background: '#eee',
              color: '#222',
              border: '1.5px solid #888',
              borderRadius: 8,
              padding: '16px 0',
              fontSize: 20,
              fontWeight: 600,
              fontFamily: 'serif',
              cursor: editing ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.10)'
            }}
          >
            Click to Edit
          </button>
          <button
            type="submit"
            disabled={!editing}
            style={{
              flex: 1,
              background: editing ? '#111' : '#888',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '16px 0',
              fontSize: 22,
              fontWeight: 600,
              fontFamily: 'serif',
              cursor: editing ? 'pointer' : 'not-allowed',
              boxShadow: '0 2px 6px rgba(0,0,0,0.10)'
            }}
          >
            Save Changes
          </button>
        </div>
        {success && <div style={{ color: 'green', marginTop: 16, fontWeight: 500 }}>Password updated successfully!</div>}
        {error && <div style={{ color: 'red', marginTop: 16, fontWeight: 500 }}>{error}</div>}
      </form>
    </div>
  );
};

const SupportReturnsContent = () => (
  <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: 350, maxWidth: 600, margin: '0 auto', fontFamily: 'inherit' }}>
    <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 16 }}>Support/Returns</h2>
    <div style={{ fontSize: 17, color: '#222', marginBottom: 18 }}>
      At Trapkings, we take pride in the quality and detail of our streetwear. All items go through thorough quality checks before shipping. However, in the rare event that you receive a defective item or an incorrect order, we're happy to assist you with an exchange.
    </div>
    <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>Eligible Cases for Exchange:</div>
    <ul style={{ marginBottom: 18, marginLeft: 24, fontSize: 16 }}>
      <li>You received a defective or damaged item.</li>
      <li>You received the wrong item, size, or order from what was originally placed.</li>
      <li>Sizing issues may be accommodated on a case-to-case basis, provided the item is unused and in its original condition.</li>
    </ul>
    <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>Important Notes:</div>
    <ul style={{ marginBottom: 18, marginLeft: 24, fontSize: 16 }}>
      <li>All exchange requests must be made within 7 days of receiving your order.</li>
      <li>Items must be unworn, unwashed, and with original tags/packaging.</li>
      <li>Customer will shoulder the shipping fee to and from our address for exchanges that are not due to our error.</li>
      <li>We do not accept refunds under any circumstances.</li>
      <li>Once an order is confirmed and paid, it can no longer be canceled or changed.</li>
    </ul>
    <div style={{ fontSize: 16, marginBottom: 12 }}>
      For detailed instructions or to initiate an exchange, please contact us directly. Our team will evaluate the request and respond accordingly.
    </div>
    <div style={{ fontSize: 16 }}>
      You can view the full Return &amp; Exchange Policy <a href="/trapkings/rne" style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}>[here]</a>.
    </div>
  </div>
);

const UserProfile = () => {
  // Get username from localStorage user object
  let userName = '';
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    userName = user?.username || '';
  } catch {
    userName = '';
  }
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState(
    location.state && location.state.openShipping
      ? 'shipping'
      : location.state && location.state.openOrders
        ? 'orders'
        : 'profile'
  );
  const [showMyOrders, setShowMyOrders] = useState(
    location.state && location.state.openOrders ? true : false
  );
  const [showInTransit, setShowInTransit] = useState(false);
  const [refreshOrders, setRefreshOrders] = useState(0);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    const userEmail = JSON.parse(localStorage.getItem('user'))?.email;
    if (!userEmail) return;
    axios.get(`http://localhost/trapkings-api/get_users_orders.php?email=${encodeURIComponent(userEmail)}`)
      .then(res => {
        if (res.data.success) {
          setUserOrders(res.data.orders);
        }
      });
  }, [refreshOrders]);

  let rightContent;
  if (showMyOrders) {
    rightContent = <MyOrders onOrderAction={() => setRefreshOrders(r => r + 1)} />;
  } else if (showInTransit) {
    rightContent = <InTransitOrders onOrderAction={() => setRefreshOrders(r => r + 1)} />;
  } else if (selectedMenu === 'shipping') {
    rightContent = <ShippingAddressForm />;
  } else if (selectedMenu === 'orders') {
    rightContent = <OrderHistory key={refreshOrders} />;
  } else if (selectedMenu === 'profile') {
    rightContent = <ProfileInfoForm />;
  } else if (selectedMenu === 'password') {
    rightContent = <ChangePasswordForm />;
  } else if (selectedMenu === 'support') {
    rightContent = <SupportReturnsContent />;
  } else {
    const item = menuItems.find(m => m.key === selectedMenu);
    rightContent = placeholderContent(item ? item.label : '');
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '60px auto 0 auto', fontFamily: 'inherit', minHeight: '80vh' }}>
      <h1 style={{ fontWeight: 600, fontSize: 32, marginBottom: 0 }}>Welcome Back, {userName}!</h1>
      <div style={{ color: '#444', marginBottom: 28, fontSize: 16 }}>Here's a quick look at your account activity.</div>
      <div style={{ display: 'flex', gap: 32 }}>
        {/* Left column: Account summary and menu */}
        <div style={{ flex: '0 0 340px', minWidth: 280 }}>
          {/* Account summary cards */}
          <div style={{ display: 'flex', gap: 18, marginBottom: 18 }}>
            <div
              style={{ flex: 1, border: '1px solid #bbb', borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', cursor: 'pointer', boxShadow: showMyOrders ? '0 0 0 2px #222' : undefined }}
              onClick={() => { setShowMyOrders(true); setShowInTransit(false); setSelectedMenu(''); }}
            >
              <FaBoxOpen size={32} style={{ marginBottom: 8 }} />
              <div style={{ fontWeight: 500, fontSize: 18 }}>My Orders</div>
              <div style={{ color: '#444', fontSize: 15, marginTop: 4 }}>
                {(() => {
                  const activeCount = userOrders.filter(order => order.status === 'active').length;
                  return `${activeCount} order${activeCount !== 1 ? 's' : ''}`;
                })()}
              </div>
            </div>
            <div
              style={{ flex: 1, border: '1px solid #bbb', borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', cursor: 'pointer', boxShadow: showInTransit ? '0 0 0 2px #222' : undefined }}
              onClick={() => { setShowInTransit(true); setShowMyOrders(false); setSelectedMenu(''); }}
            >
              <FaTruck size={32} style={{ marginBottom: 8 }} />
              <div style={{ fontWeight: 500, fontSize: 18 }}>In Transit</div>
              <div style={{ color: '#444', fontSize: 15, marginTop: 4 }}>
                {(() => {
                  const inTransitCount = userOrders.filter(order => order.status === 'in_transit').length;
                  return `${inTransitCount} shipment${inTransitCount !== 1 ? 's' : ''}`;
                })()}
              </div>
            </div>
          </div>
          {/* Account Settings menu */}
          <div style={{ border: '1px solid #bbb', borderRadius: 14, background: '#fff', padding: 24, marginTop: 18 }}>
            <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 18 }}>Account Settings</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {menuItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => {
                    setSelectedMenu(item.key);
                    setShowMyOrders(false);
                    setShowInTransit(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    minWidth: 180,
                    background: selectedMenu === item.key ? '#f0f0f0' : 'none',
                    border: 'none',
                    color: '#222',
                    fontWeight: 500,
                    fontSize: 16,
                    padding: '10px 8px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'background 0.2s'
                  }}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Right column: Content */}
        <div style={{ flex: 1, minWidth: 350, marginLeft: 24 }}>{rightContent}</div>
      </div>
    </div>
  );
};

export default UserProfile; 