import React, { useEffect, useState } from 'react';
import { FaBox, FaLaptop, FaExclamationTriangle, FaListAlt, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import RoleBasedNavbar from '../components/RoleBasedNavbar';
import './AdminHome.css';
import whiteImg from '../assets/white.png';
import blackImg from '../assets/black.png';
import standardImg from '../assets/standard.png';
import reflectiveImg from '../assets/reflective.png';
import blingImg from '../assets/bling.png';
import chingImg from '../assets/ching.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const defaultProducts = [
  { img: whiteImg, name: "EXCLSV MDFCK", price: "₱650", category: "TEE", size: ["S", "M", "L", "XL", "XXL"], quantity: 9, status: "ACTIVE" },
  { img: blingImg, name: "BLING", price: "₱650", category: "TEE", size: ["M", "XL", "XXL"], quantity: 5, status: "ACTIVE" },
  { img: reflectiveImg, name: "REFLECTIVE", price: "₱650", category: "TEE", size: ["L", "XL", "XXL"], quantity: 15, status: "ACTIVE" },
  { img: standardImg, name: "RAWR", price: "₱950", category: "SHORTS", size: ["S", "M", "L", "XL", "XXL"], quantity: 20, status: "INACTIVE" },
];

const Inventory = () => {
  const [products, setProducts] = useState(defaultProducts);
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', category: '', size: [], quantity: 0, status: 'ACTIVE' });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost/trapkings-api/get_product.php')
      .then(res => {
        if (res.data.success) {
          setProducts(res.data.products);
        }
      });
  }, []);

  // Summary calculations
  const totalProducts = products.length;
  const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 6).length;
  const outOfStock = products.filter(p => p.quantity === 0 || p.status === 'INACTIVE').length;
  const activeListing = products.filter(p => p.status === 'ACTIVE').length;

  // Filtering for search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(p.size) ? p.size.join(',').toLowerCase().includes(searchTerm.toLowerCase()) : String(p.size).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    axios.post('http://localhost/trapkings-api/delete_product.php', new URLSearchParams({ id }))
      .then(res => {
        if (res.data.success) {
          setProducts(products.filter(p => p.id !== id));
        } else {
          alert('Delete failed: ' + res.data.error);
        }
      });
  };

  const handleEdit = (idx) => {
    setEditIndex(idx);
    const p = products[idx];
    setEditForm({
      name: p.name,
      price: p.price.replace(/[^\d]/g, ''),
      category: p.category,
      size: Array.isArray(p.size) ? p.size : [],
      quantity: p.quantity,
      status: p.status
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'size') {
      setEditForm((prev) => {
        let newSizes = prev.size || [];
        if (checked) {
          newSizes = [...newSizes, value];
        } else {
          newSizes = newSizes.filter((s) => s !== value);
        }
        return { ...prev, size: newSizes };
      });
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSave = () => {
    const payload = {
      id: products[editIndex].id,
      name: editForm.name,
      price: editForm.price,
      category: editForm.category,
      size: Array.isArray(editForm.size) ? editForm.size.join(',') : editForm.size,
      quantity: editForm.quantity,
      status: editForm.status
    };
    axios.post('http://localhost/trapkings-api/edit_product.php', new URLSearchParams(payload))
      .then(res => {
        if (res.data.success) {
          // Optionally, re-fetch products from the server
          axios.get('http://localhost/trapkings-api/get_product.php')
            .then(res => {
              if (res.data.success) setProducts(res.data.products);
            });
          setEditIndex(null);
        } else {
          alert('Edit failed: ' + res.data.error);
        }
      });
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setEditForm({ name: '', price: '', category: '', size: [], quantity: 0, status: 'ACTIVE' });
  };

  return (
    <div className="inventory-page" style={{ background: '#fafafa', minHeight: '100vh' }}>
      <RoleBasedNavbar />
      <div className="admin-main" style={{ marginTop: 48 }}>
        <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px solid #222' }}>
            <FaBox size={32} style={{ marginBottom: 8 }} />
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>TOTAL PRODUCTS</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{totalProducts}</div>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px solid #222' }}>
            <FaLaptop size={32} style={{ marginBottom: 8 }} />
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>LOW STOCK</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{lowStock}</div>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px solid #222' }}>
            <FaExclamationTriangle size={32} style={{ marginBottom: 8 }} />
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>OUT OF STOCK</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{outOfStock}</div>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px solid #222' }}>
            <FaListAlt size={32} style={{ marginBottom: 8 }} />
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>ACTIVE LISTING</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{activeListing}</div>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.10)', padding: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'inherit' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '12px 8px' }}>Product Name</th>
                <th style={{ padding: '12px 8px' }}>Category</th>
                <th style={{ padding: '12px 8px' }}>Size/Variant Available</th>
                <th style={{ padding: '12px 8px' }}>Price</th>
                <th style={{ padding: '12px 8px' }}>Stock Level</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px', minWidth: 180 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>Action</span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14, width: 120 }}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee', fontSize: 16 }}>
                  <td style={{ padding: '10px 8px', fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '10px 8px' }}>{p.category}</td>
                  <td style={{ padding: '10px 8px' }}>{Array.isArray(p.size) ? p.size.join(', ') : p.size}</td>
                  <td style={{ padding: '10px 8px' }}>{p.price}</td>
                  <td style={{ padding: '10px 8px' }}>{p.quantity}</td>
                  <td style={{ padding: '10px 8px', color: p.status === 'ACTIVE' ? '#1a7f37' : '#888', fontWeight: 700 }}>{p.status}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <button style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 12, padding: '4px 14px', marginRight: 4, fontWeight: 500, fontSize: 14, cursor: 'pointer' }} onClick={() => navigate(`/products/${p.id}?admin=1`)}><FaEye style={{ marginRight: 4, fontSize: 13 }} />view</button>
                    <button style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 12, padding: '4px 14px', marginRight: 4, fontWeight: 500, fontSize: 14, cursor: 'pointer' }} onClick={() => handleEdit(idx)}><FaEdit style={{ marginRight: 4, fontSize: 13 }} />edit</button>
                    <button style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 12, padding: '4px 14px', fontWeight: 500, fontSize: 14, cursor: 'pointer' }} onClick={() => handleDelete(p.id)}><FaTrash style={{ marginRight: 4, fontSize: 13 }} />delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editIndex !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 32, minWidth: 400, maxWidth: 500, boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
            <h2>Edit Product</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input type="text" name="name" value={editForm.name} onChange={handleEditFormChange} placeholder="Product Name" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              <input type="text" name="category" value={editForm.category} onChange={handleEditFormChange} placeholder="Category" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              <input type="number" name="price" value={editForm.price} onChange={handleEditFormChange} placeholder="Price" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                  <label key={sz} style={{ fontWeight: 400, fontSize: '1rem' }}>
                    <input type="checkbox" name="size" value={sz} checked={editForm.size.includes(sz)} onChange={handleEditFormChange} style={{ marginRight: 6 }} />{sz}
                  </label>
                ))}
              </div>
              <input type="number" name="quantity" value={editForm.quantity} onChange={handleEditFormChange} placeholder="Stock Level" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
              <select name="status" value={editForm.status} onChange={handleEditFormChange} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={handleEditCancel} style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleEditSave} style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 500, cursor: 'pointer' }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory; 