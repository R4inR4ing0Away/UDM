import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RoleBasedNavbar from '../components/RoleBasedNavbar';
import './AdminHome.css';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost/trapkings-api/get_orders.php')
      .then(res => {
        if (res.data.success) setOrders(res.data.orders);
      });
  }, []);

  const handleUpdateOrderStatus = async (orderOrderId) => {
    if (!window.confirm('Only press confirm when the order is in transit. Do you want to continue?')) {
      return;
    }
    try {
      await fetch('http://localhost/trapkings-api/update_order_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderOrderId, status: 'in_transit' })
      });
      // Refresh orders after successful status update
      axios.get('http://localhost/trapkings-api/get_orders.php')
        .then(res => {
          if (res.data.success) setOrders(res.data.orders);
        });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Filter orders by search term
  const filteredOrders = orders.filter(order =>
    order.order_id.toLowerCase().includes(search.toLowerCase()) ||
    order.name.toLowerCase().includes(search.toLowerCase()) ||
    order.email.toLowerCase().includes(search.toLowerCase())
  );

  // Separate orders by status
  const activeOrders = filteredOrders.filter(order => order.status === 'active');
  const inTransitOrders = filteredOrders.filter(order => order.status === 'in_transit');
  const receivedOrders = filteredOrders.filter(order => order.status === 'received');
  const cancelledOrders = filteredOrders.filter(order => order.status === 'cancelled');

  return (
    <div className="admin-container">
      <RoleBasedNavbar />
      <div className="admin-main">
        {/* Search bar at the top right below the navbar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', margin: '30px 0 18px 0' }}>
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid #bbb', fontSize: 16, minWidth: 260 }}
          />
        </div>
        {/* Active Orders Section */}
        <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 32, marginBottom: 40 }}>
          <h2 style={{ marginBottom: 18 }}>Active Orders</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Time Created</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_id}</td>
                  <td>{order.name}</td>
                  <td>{order.email}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600, paddingRight: 32 }}>{order.status}</td>
                  <td>{order.time_created}</td>
                  <td>₱{Number(order.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      style={{ padding: '6px 18px', background: '#222', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
                      onClick={() => handleUpdateOrderStatus(order.order_id)}
                    >
                      Confirm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* In Transit Orders Section */}
        <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 32, marginBottom: 40 }}>
          <h2 style={{ marginBottom: 18 }}>In Transit Orders</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Time Created</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inTransitOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_id}</td>
                  <td>{order.name}</td>
                  <td>{order.email}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600, paddingRight: 32 }}>{order.status}</td>
                  <td>{order.time_created}</td>
                  <td>₱{Number(order.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Received Orders Section */}
        <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 32, marginBottom: 40 }}>
          <h2 style={{ marginBottom: 18 }}>Received Orders</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Time Created</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {receivedOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_id}</td>
                  <td>{order.name}</td>
                  <td>{order.email}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600, paddingRight: 32 }}>{order.status}</td>
                  <td>{order.time_created}</td>
                  <td>₱{Number(order.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Cancelled Orders Section */}
        <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 32 }}>
          <h2 style={{ marginBottom: 18 }}>Cancelled Orders</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Time Created</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cancelledOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_id}</td>
                  <td>{order.name}</td>
                  <td>{order.email}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600, paddingRight: 32 }}>{order.status}</td>
                  <td>{order.time_created}</td>
                  <td>₱{Number(order.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Order; 