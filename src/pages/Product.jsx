import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../App.css';
import toplogo from '../assets/toplogo.jpg';
import whiteImg from '../assets/white.png';
import blackImg from '../assets/black.png';
import standardImg from '../assets/standard.png';
import reflectiveImg from '../assets/reflective.png';
import blingImg from '../assets/bling.png';
import chingImg from '../assets/ching.png';
import Navbar from '../components/Navbar';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `http://localhost/trapkings-api/${path.replace(/^\/+/,'')}`;
}

const defaultProducts = [
  { img: whiteImg, name: "EXCLSV MDFCK - WHITE", price: "P650", link: "/products/product-detail-1", theme: "light" },
  { img: blackImg, name: "EXCLSV MDFCK - BLACK", price: "P850", link: "/products/product-detail-2", theme: "dark" },
  { img: standardImg, name: "EXCLSV MDFCK", price: "P1,300", link: "/products/product-detail-3" },
  { img: reflectiveImg, name: "REFLECTIVE", price: "P700", link: "/products/product-detail-4" },
  { img: blingImg, name: "BLING", price: "P650", link: "/products/product-detail-5" },
  { img: chingImg, name: "CHING", price: "P700", comingSoon: true }
];

const PRODUCTS_PER_PAGE = 6;
const ALL_COLORS = ['BLACK', 'WHITE', 'PURPLE'];
const ALL_SIZES = ['S', 'M', 'L', 'XL'];

const Product = () => {
  const [products, setProducts] = useState(defaultProducts);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('new');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios.get('http://localhost/trapkings-api/get_product.php')
      .then(res => {
        if (res.data.success) {
          setProducts(res.data.products);
        }
      });
  }, []);

  useEffect(() => {
    axios.get(`http://localhost/trapkings-api/get_product.php?id=${id}`)
      .then(res => {
        if (res.data.success && res.data.products.length > 0) {
          setProducts(res.data.products);
        }
      });
  }, [id]);

  // Filtering
  let filtered = products.filter(p => {
    // Only show ACTIVE products
    if (p.status && p.status !== 'ACTIVE') return false;
    // Search
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    // Color (if color property exists)
    if (selectedColors.length > 0 && p.color && !selectedColors.includes(p.color)) return false;
    // Size (if size property exists)
    if (selectedSizes.length > 0) {
      let sizes = [];
      if (Array.isArray(p.size)) {
        sizes = p.size;
      } else if (typeof p.size === 'string') {
        sizes = p.size.split(',').map(s => s.trim());
      }
      if (!sizes.some(sz => selectedSizes.includes(sz))) return false;
    }
    return true;
  });

  // Sorting
  if (sort === 'price-asc') {
    filtered = filtered.slice().sort((a, b) => parseInt(String(a.price).replace(/[^\d]/g, '')) - parseInt(String(b.price).replace(/[^\d]/g, '')));
  } else if (sort === 'price-desc') {
    filtered = filtered.slice().sort((a, b) => parseInt(String(b.price).replace(/[^\d]/g, '')) - parseInt(String(a.price).replace(/[^\d]/g, '')));
  } // else 'new' = default order

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  // Handlers
  const handleColorChange = color => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
    setPage(1);
  };
  const handleSizeChange = size => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
    setPage(1);
  };
  const handleSort = s => {
    setSort(s);
    setPage(1);
  };
  const handleSearch = e => {
    const val = e.target.value;
    setSearch(val);
    setPage(1);
  };

  const handleAddAndSave = async () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('category', form.category);
    formData.append('size', form.size.join(',')); // join array to string
    formData.append('color', form.color);
    formData.append('quantity', form.quantity);
    formData.append('description', form.description);
    if (imageFiles[0]) formData.append('image', imageFiles[0]); // imageFiles is your file input state

    try {
      await axios.post('http://localhost/trapkings-api/upload_product.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Product added!');
      // Reset your form here
    } catch (err) {
      alert('Error uploading product');
    }
  };

  return (
    <div className="product-page" style={{ background: '#fafafa', minHeight: '100vh' }}>
      <Navbar />
      <main className="product-content" style={{ minHeight: '80vh', display: 'flex', gap: 32, maxWidth: 1200, margin: '0 auto' }}>
        {/* Sidebar */}
        <aside style={{ minWidth: 210, background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: 'fit-content', marginTop: 24 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Color</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
            {ALL_COLORS.map(color => (
              <label key={color} style={{ fontWeight: 400, fontSize: 15 }}>
                <input type="checkbox" checked={selectedColors.includes(color)} onChange={() => handleColorChange(color)} style={{ marginRight: 6 }} />
                {color}
              </label>
            ))}
          </div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Size</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ALL_SIZES.map(size => (
              <label key={size} style={{ fontWeight: 400, fontSize: 15 }}>
                <input type="checkbox" checked={selectedSizes.includes(size)} onChange={() => handleSizeChange(size)} style={{ marginRight: 6 }} />
                {size}
              </label>
            ))}
          </div>
        </aside>
        {/* Main Content */}
        <div style={{ flex: 1, marginTop: 24 }}>
          {/* Search and Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input type="text" value={search} onChange={handleSearch} placeholder="Search" style={{ width: '100%', padding: '10px 38px 10px 16px', borderRadius: 24, border: '1px solid #ccc', fontSize: 16, background: '#fff' }} />
              <FaSearch style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 18 }} />
            </div>
            <button onClick={() => handleSort('new')} style={{ background: sort === 'new' ? '#222' : '#eee', color: sort === 'new' ? '#fff' : '#444', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>New</button>
            <button onClick={() => handleSort('price-asc')} style={{ background: sort === 'price-asc' ? '#222' : '#eee', color: sort === 'price-asc' ? '#fff' : '#444', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>Price ascending</button>
            <button onClick={() => handleSort('price-desc')} style={{ background: sort === 'price-desc' ? '#222' : '#eee', color: sort === 'price-desc' ? '#fff' : '#444', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>Price descending</button>
          </div>
          {/* Product Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', margin: '0 auto' }}>
            {paginatedProducts.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888', fontSize: 18, padding: 40 }}>No products found.</div>
            ) : paginatedProducts.map((product, index) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '1.5rem 1.5rem 1.2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minHeight: 340 }}>
                  <img
                    src={
                      product.images
                        ? getImageUrl(product.images.split(',')[0].trim())
                        : getImageUrl(product.image)
                    }
                    alt={product.name}
                    style={{ width: '100%', height: 180, objectFit: 'contain', borderRadius: 8, marginBottom: 18, background: '#f5f5f5' }}
                  />
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 6 }}>{product.name}</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 0 }}>₱{String(product.price).replace(/[^\d]/g, '')}</div>
                </div>
              </Link>
            ))}
          </div>
          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, margin: '2.5rem 0 0 0' }}>
            <button onClick={() => setPage(page - 1)} disabled={page === 1} style={{ background: 'none', border: 'none', color: page === 1 ? '#bbb' : '#222', fontWeight: 500, fontSize: 18, cursor: page === 1 ? 'default' : 'pointer' }}>&lt; Previous</button>
            <span style={{ fontWeight: 600, fontSize: 18 }}>{page}</span>
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages} style={{ background: 'none', border: 'none', color: page === totalPages ? '#bbb' : '#222', fontWeight: 500, fontSize: 18, cursor: page === totalPages ? 'default' : 'pointer' }}>Next &gt;</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Product;