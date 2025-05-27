import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaTruck, FaUsers, FaCog, FaSignOutAlt, FaUpload } from 'react-icons/fa';
import RoleBasedNavbar from '../components/RoleBasedNavbar';
import './AdminHome.css';
import dashboardBg from '../assets/dashboard.jpg';
import axios from 'axios';

const AdminHome = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('');
  const [displayAdminName, setDisplayAdminName] = useState('');
  const [localAdminName, setLocalAdminName] = useState('');

  useEffect(() => {
    function syncAdminName() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'admin') setLocalAdminName(user.username || '');
        else setLocalAdminName('');
      } catch { setLocalAdminName(''); }
    }
    syncAdminName();
    window.addEventListener('storage', syncAdminName);
    return () => window.removeEventListener('storage', syncAdminName);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [ordersRes, productsRes, usersRes, adminRes] = await Promise.all([
          axios.get('http://localhost/trapkings-api/get_orders.php'),
          axios.get('http://localhost/trapkings-api/get_product.php'),
          axios.get('http://localhost/trapkings-api/manage_users.php'),
          axios.get('http://localhost/trapkings-api/get_admin_info.php'),
        ]);
        setOrders(ordersRes.data.orders || []);
        setProducts(productsRes.data.products || []);
        setUsers(usersRes.data.users || []);
        if (adminRes.data && adminRes.data.success) {
          setAdminName(adminRes.data.username);
          setDisplayAdminName(adminRes.data.username);
        }
        // Debug logs
        console.log('Fetched orders:', ordersRes.data.orders);
        if (ordersRes.data.orders && ordersRes.data.orders.length > 0) {
          ordersRes.data.orders.forEach((order, idx) => {
            let items = order.items;
            if (typeof items === 'string') {
              try { items = JSON.parse(items); } catch { items = []; }
            }
            console.log(`Order #${idx + 1} items:`, items);
          });
        }
      } catch (err) {
        // Optionally handle error
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Stats
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

  // Latest Orders (show 5)
  const latestOrders = [...orders]
    .sort((a, b) => new Date(b.time_created) - new Date(a.time_created))
    .slice(0, 5)
    .map(order => {
      let items = order.items;
      if (typeof items === 'string') {
        try {
          items = JSON.parse(items);
        } catch {
          items = [];
        }
      }
      return { ...order, items };
    });

  // Products Available
  const productsAvailable = products.map(p => ({
    name: p.name,
    stock: p.quantity,
    status: p.status
  }));

  // New Registered Users (show 5, newest first)
  const newUsers = [...users]
    .sort((a, b) => new Date(b.created_at || b.date_created || 0) - new Date(a.created_at || a.date_created || 0))
    .slice(0, 5);

  // Best Selling Products (by sold count, top 5)
  const productSales = {};
  orders.forEach(order => {
    let items = order.items;
    if (typeof items === 'string') {
      try {
        items = JSON.parse(items);
      } catch {
        items = [];
      }
    }
    if (Array.isArray(items)) {
      items.forEach(item => {
        if (!productSales[item.name]) productSales[item.name] = 0;
        productSales[item.name] += item.quantity ? Number(item.quantity) : 1;
      });
    }
  });
  const bestSelling = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, sold]) => ({ name, sold }));

        return (
    <div className="admin-dashboard-bg">
      <div className="dashboard-bg-overlay"></div>
      <RoleBasedNavbar />
      <div className="admin-dashboard-main">
        <div className="dashboard-header">
          <div className="dashboard-title">Welcome to Dashboard, {localAdminName || displayAdminName || 'Admin'}</div>
        </div>
        <div className="dashboard-stats-row">
          <div className="dashboard-stat-card">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{loading ? '...' : totalOrders}</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="stat-label">Total Products</div>
            <div className="stat-value">{loading ? '...' : totalProducts}</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="stat-label">Total Registered Users</div>
            <div className="stat-value">{loading ? '...' : totalUsers}</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">₱ {loading ? '...' : totalRevenue.toLocaleString()}</div>
          </div>
        </div>
        <div className="dashboard-panels-row">
          <div className="dashboard-panel">
            <div className="panel-title">Lastest Orders</div>
            <div className="panel-list">
              {loading ? <div>Loading...</div> : latestOrders.map((order, i) => (
                <div key={order.id || i} className="panel-list-item">
                  <div className="panel-list-item-title">
                    {order.items && order.items.length > 0
                      ? order.items.map((item, idx) => (
                          <span key={idx}>
                            {item.name}{item.size ? ` (${item.size})` : ''}
                            {idx < order.items.length - 1 ? ', ' : ''}
                          </span>
                        ))
                      : order.name}
                  </div>
                  <div className="panel-list-item-desc">
                    {order.name} [{order.shipping_address || ''}]
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-panel">
            <div className="panel-title">Products Available</div>
            <div className="panel-list">
              {loading ? <div>Loading...</div> : productsAvailable.map((p, i) => (
                <div key={i} className="panel-list-item">
                  <div className="panel-list-item-title">{p.name}</div>
                  <div className="panel-list-item-desc">STOCK: {p.stock} {p.stock === 0 ? '[Out of Stock]' : p.stock <= 5 ? '[Low Stock]' : ''}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-panel">
            <div className="panel-title">New Registered Users</div>
            <div className="panel-list">
              {loading ? <div>Loading...</div> : newUsers.map((u, i) => (
                <div key={u.id || i} className="panel-list-item">
                  <div className="panel-list-item-title">{u.username}</div>
                  <div className="panel-list-item-desc">{u.email} [{u.role}]</div>
              </div>
              ))}
              </div>
              </div>
          <div className="dashboard-panel">
            <div className="panel-title">Best Selling Products</div>
            <div className="panel-list">
              {loading ? <div>Loading...</div> : bestSelling.length === 0 ? (
                <div style={{ color: '#888', fontSize: 15 }}>No sales data yet.</div>
              ) : bestSelling.map((p, i) => (
                <div key={i} className="panel-list-item">
                  <div className="panel-list-item-title">{p.name}</div>
                  <div className="panel-list-item-desc">SOLD: {p.sold}</div>
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

