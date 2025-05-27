import React, { useRef, useState } from 'react';
import RoleBasedNavbar from '../components/RoleBasedNavbar';
import './AdminHome.css';
import { FaPlus } from 'react-icons/fa';
import whiteImg from '../assets/white.png';
import blackImg from '../assets/black.png';
import standardImg from '../assets/standard.png';
import reflectiveImg from '../assets/reflective.png';
import blingImg from '../assets/bling.png';
import chingImg from '../assets/ching.png';
import axios from 'axios';

const defaultProducts = [
  { img: whiteImg, name: "EXCLSV MDFCK - WHITE", price: "P650", link: "/products/product-detail-1", theme: "light" },
  { img: blackImg, name: "EXCLSV MDFCK - BLACK", price: "P850", link: "/products/product-detail-2", theme: "dark" },
  { img: standardImg, name: "EXCLSV MDFCK", price: "P1,300", link: "/products/product-detail-3" },
  { img: reflectiveImg, name: "REFLECTIVE", price: "P700", link: "/products/product-detail-4" },
  { img: blingImg, name: "BLING", price: "P650", link: "/products/product-detail-5" },
  { img: chingImg, name: "CHING", price: "P700", comingSoon: true }
];

const UploadOrder = () => {
  const fileInputRef = useRef(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    size: [],
    color: '',
    quantity: '',
    description: '',
    status: 'ACTIVE',
  });
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const getHiddenDefaultProducts = () => JSON.parse(localStorage.getItem('hiddenDefaultProducts')) || [];
  const setHiddenDefaultProducts = (arr) => localStorage.setItem('hiddenDefaultProducts', JSON.stringify(arr));

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setImageFiles(files);

    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(results => setImagePreviews(results));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'size') {
      setForm((prev) => {
        let newSizes = prev.size || [];
        if (checked) {
          newSizes = [...newSizes, value];
        } else {
          newSizes = newSizes.filter((s) => s !== value);
        }
        return { ...prev, size: newSizes };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCancel = () => {
    alert('You have cancelled.');
    setImagePreviews([]);
    setImageFiles([]);
    setForm({
      name: '',
      price: '',
      category: '',
      size: [],
      color: '',
      quantity: '',
      description: '',
      status: 'ACTIVE',
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddAndSave = async () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('category', form.category);
    formData.append('size', form.size.join(','));
    formData.append('color', form.color);
    formData.append('quantity', form.quantity);
    formData.append('description', form.description);
    formData.append('status', form.status || 'ACTIVE');
    imageFiles.forEach((file, idx) => {
      formData.append('images[]', file);
    });

    try {
      const response = await axios.post('http://localhost/trapkings-api/upload_product.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        alert('Product added successfully!');
        setImagePreviews([]);
        setImageFiles([]);
        setForm({ name: '', price: '', category: '', size: [], color: '', quantity: '', description: '', status: 'ACTIVE' });
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        alert('Error: ' + response.data.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading product');
    }
  };

  const openRemoveModal = () => {
    const stored = JSON.parse(localStorage.getItem('products')) || [];
    const hidden = getHiddenDefaultProducts();
    const filteredDefaults = defaultProducts.filter((_, idx) => !hidden.includes(idx));
    setAllProducts([...filteredDefaults, ...stored]);
    setShowRemoveModal(true);
  };

  const closeRemoveModal = () => setShowRemoveModal(false);

  const handleRemoveProduct = (index) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return;
    const stored = JSON.parse(localStorage.getItem('products')) || [];
    const hidden = getHiddenDefaultProducts();
    const defaultCount = defaultProducts.length - hidden.length;
    if (index < defaultCount) {
      let visibleIdx = -1;
      for (let i = 0; i < defaultProducts.length; i++) {
        if (!hidden.includes(i)) visibleIdx++;
        if (visibleIdx === index) {
          setHiddenDefaultProducts([...hidden, i]);
          alert('Default product removed!');
          break;
        }
      }
      const newFilteredDefaults = defaultProducts.filter((_, idx) => ![...hidden, index].includes(idx));
      setAllProducts([...newFilteredDefaults, ...stored]);
    } else {
      const newStored = stored.filter((_, i) => i !== (index - defaultCount));
      localStorage.setItem('products', JSON.stringify(newStored));
      setAllProducts([...defaultProducts.filter((_, idx) => !hidden.includes(idx)), ...newStored]);
      alert('Product removed!');
    }
  };

  return (
    <div className="upload-order-page" style={{ background: '#fafafa', minHeight: '100vh' }}>
      <RoleBasedNavbar />
      <div className="admin-main">
        <div className="uploadorder-flex">
          {/* Left: Image Upload Section + Buttons */}
          <div className="uploadorder-image-section">
            <label className="uploadorder-image-label" style={{ marginTop: 32, marginLeft: 8, display: 'block' }}>INSERT PHOTO</label>
            <div className="uploadorder-image-box" onClick={handleImageClick} style={{ marginTop: 12 }}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
                accept="image/*"
                multiple
              />
              <div className="uploadorder-image-placeholder">
                {imagePreviews.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {imagePreviews.map((img, idx) => (
                        <img key={idx} src={img} alt={`Preview ${idx + 1}`} style={{ maxWidth: 120, maxHeight: 120, borderRadius: '10px' }} />
                      ))}
                    </div>
                    <button type="button" onClick={() => { setImagePreviews([]); if (fileInputRef.current) fileInputRef.current.value = ''; }} style={{ background: '#eee', color: '#444', border: 'none', borderRadius: 8, padding: '6px 18px', fontSize: '0.95rem', fontWeight: 400, marginTop: 6, boxShadow: '0 2px 4px rgba(0,0,0,0.08)', cursor: 'pointer' }}>Clear Images</button>
                  </div>
                ) : (
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="100" height="100" rx="8" fill="#e0e0e0" />
                    <path d="M40 80L60 60L80 80" stroke="#bdbdbd" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="50" cy="50" r="8" fill="#bdbdbd" />
                    <circle cx="90" cy="90" r="18" fill="#e0e0e0" />
                    <circle cx="90" cy="90" r="14" stroke="#bdbdbd" strokeWidth="4" fill="none" />
                    <FaPlus style={{ position: 'absolute', left: 90, top: 90, fontSize: 24, color: '#bdbdbd' }} />
                  </svg>
                )}
              </div>
            </div>
            <div className="uploadorder-buttons" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: 32, marginLeft: 60 }}>
              <div style={{ display: 'flex', gap: '3rem', marginBottom: 0 }}>
                <button className="btn-cancel" type="button" onClick={handleCancel} style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 12, padding: '16px 64px', fontSize: '1.2rem', fontWeight: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.18)', marginBottom: 0 }}>Cancel</button>
                <button className="btn-add" type="button" onClick={handleAddAndSave} style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 12, padding: '16px 64px', fontSize: '1.2rem', fontWeight: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.18)', marginBottom: 0 }}>Add and Save</button>
              </div>
            </div>
          </div>

          {/* Right: Product Form Section */}
          <form className="uploadorder-form-section" style={{ marginTop: 32 }}>
            <div className="form-group">
              <label>PRODUCT NAME</label>
              <input type="text" name="name" placeholder="Input Product Name" value={form.name} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>PRICE:</label>
              <input type="number" name="price" placeholder="Input Price" value={form.price} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>CATEGORY:</label>
              <input type="text" name="category" placeholder="Input Category" value={form.category} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>SIZE:</label>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <label key={sz} style={{ fontWeight: 400, fontSize: '1rem' }}>
                    <input
                      type="checkbox"
                      name="size"
                      value={sz}
                      checked={form.size.includes(sz)}
                      onChange={handleInputChange}
                      style={{ marginRight: 6 }}
                    />
                    {sz}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>COLOR:</label>
              <input type="text" name="color" placeholder="Input Color" value={form.color} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>QUANTITY:</label>
              <input type="number" name="quantity" placeholder="Input Quantity" value={form.quantity} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" placeholder="Description" rows={3} value={form.description} onChange={handleInputChange} />
            </div>
          </form>
        </div>
      </div>
      {showRemoveModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: 32, minWidth: 400, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
            <h2>Remove a Product</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {allProducts.map((prod, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
                  <img src={prod.imgs ? prod.imgs[0] : prod.img} alt={prod.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, marginRight: 16 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{prod.name}</div>
                    <div style={{ color: '#666', fontSize: 14 }}>{prod.price}</div>
                  </div>
                  <button style={{ background: '#ff4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 500 }} onClick={() => handleRemoveProduct(idx)}>Remove</button>
                </li>
              ))}
            </ul>
            <button style={{ marginTop: 16, background: '#222', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 500, cursor: 'pointer' }} onClick={closeRemoveModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadOrder; 