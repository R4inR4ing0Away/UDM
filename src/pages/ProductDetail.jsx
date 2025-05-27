import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import toplogo from '../assets/toplogo.jpg';
import whiteImg from '../assets/white.png'; // The white shirt image
import Navbar from '../components/Navbar';
import RoleBasedNavbar from '../components/RoleBasedNavbar';
import Slider from 'react-slick';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaArrowLeft, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `http://localhost/trapkings-api/${path.replace(/^\/+/,'')}`;
}

function getCartKey() {
  const userId = localStorage.getItem('userId');
  return userId ? `cart_${userId}` : 'cart_guest';
}

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState('');
  const [sliderRef, setSliderRef] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost/trapkings-api/get_product.php?id=${id}`)
      .then(res => {
        if (res.data.success && res.data.products.length > 0) {
          setProduct(res.data.products[0]);
        }
      });
  }, [id]);

  if (!product) return <div>Loading...</div>;

  // Ensure quantity is a number
  const quantity = Number(product.quantity);
  const isOutOfStock = isNaN(quantity) || quantity <= 0;

  // Use images array if available, else fallback to single image
  const images = product.images
    ? product.images.split(',').map(img => getImageUrl(img.trim()))
    : [getImageUrl(product.image)];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // We'll use custom arrows
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError('Please select a size.');
      return;
    }
    const cart = JSON.parse(localStorage.getItem(getCartKey())) || [];
    const existingIndex = cart.findIndex(
      item => item.id === product.id && item.size === selectedSize
    );
    if (existingIndex !== -1) {
      // If item exists, increment quantity
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
      // Add new item with quantity 1
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        image: product.images
          ? product.images.split(',')[0].trim()
          : product.image,
        quantity: 1,
      });
    }
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
    alert('Added to cart!');
  };

  // Check for ?admin=1 in the query string
  const isAdminView = new URLSearchParams(location.search).get('admin') === '1';
  // Check if user is signed in
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
  const isSignedIn = !!user;

  return (
    <div className="product-detail-page" style={{ background: '#fafafa', minHeight: '100vh' }}>
      {isAdminView ? <RoleBasedNavbar /> : <Navbar />}
      <main className="product-detail-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', padding: '40px 0' }}>
        {/* Back Button */}
        <button
          style={{
            alignSelf: 'flex-start',
            marginBottom: 18,
            background: 'none',
            color: '#222',
            border: 'none',
            borderRadius: 8,
            padding: '8px 18px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginLeft: 40
          }}
          onClick={() => navigate(-1)}
        >
          <FaChevronLeft /> Back
        </button>
        <div style={{ display: 'flex', gap: 60, maxWidth: 1100, width: '100%' }}>
          {/* Image Slider (left) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 350 }}>
            <div style={{ position: 'relative', width: 350, height: 400 }}>
              <Slider ref={setSliderRef} {...sliderSettings} style={{ width: 350, height: 400 }}>
              {images.map((img, idx) => (
                <div key={idx}>
                  <img
                    src={img}
                    alt={`Product ${idx + 1}`}
                    style={{ width: '100%', maxHeight: 400, objectFit: 'contain', borderRadius: 12, background: '#fff' }}
                  />
                </div>
              ))}
            </Slider>
              {/* Custom Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: -30,
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      fontSize: 32,
                      cursor: 'pointer',
                      color: '#111',
                      zIndex: 2,
                      fontWeight: 'bold',
                      lineHeight: 1
                    }}
                    onClick={() => sliderRef && sliderRef.slickPrev()}
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: -30,
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      fontSize: 32,
                      cursor: 'pointer',
                      color: '#111',
                      zIndex: 2,
                      fontWeight: 'bold',
                      lineHeight: 1
                    }}
                    onClick={() => sliderRef && sliderRef.slickNext()}
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>
          </div>
          {/* Product Info (right) */}
          <div style={{ flex: 1, maxWidth: 420, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', padding: '40px 32px 32px 32px', margin: '0' }}>
            <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 8 }}>{product.name}</h2>
            <div style={{ fontSize: 40, fontWeight: 700, margin: '8px 0 8px 0' }}>₱{product.price}</div>
            <div style={{ color: '#888', fontWeight: 500, letterSpacing: 1, marginBottom: 12, fontSize: 18 }}>
              {product.color && product.color.toUpperCase()}
            </div>
            <div style={{ color: '#666', fontWeight: 500, marginBottom: 24, fontSize: 16 }}>
              Stock: {isNaN(quantity) ? 0 : quantity}
            </div>
            {/* Size selection and Add to Cart only for signed-in users, otherwise show Sign in to Buy */}
            {!isAdminView && isSignedIn && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 500, fontSize: 16, marginBottom: 6, display: 'block' }}>Size</label>
              <select
                value={selectedSize}
                onChange={e => {
                  setSelectedSize(e.target.value);
                  setSizeError('');
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid #ccc',
                  fontSize: 16,
                  background: '#fafafa',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
                disabled={isOutOfStock}
              >
                <option value="">Choose Size</option>
                {product.size && product.size.split(',').map(sz => (
                  <option key={sz} value={sz}>{sz}</option>
                ))}
              </select>
              {sizeError && (
                <div style={{ color: 'red', marginBottom: 12, fontSize: 15 }}>{sizeError}</div>
              )}
            </div>
            )}
            {!isAdminView && isSignedIn && (
            <button
              style={{
                width: '100%',
                background: isOutOfStock ? '#888' : (selectedSize ? '#222' : '#888'),
                color: '#fff',
                padding: 16,
                borderRadius: 8,
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 24,
                border: 'none',
                cursor: isOutOfStock ? 'not-allowed' : (selectedSize ? 'pointer' : 'not-allowed'),
                  transition: 'background 0.2s',
                  display: isAdminView ? 'none' : 'block'
              }}
              disabled={isOutOfStock || !selectedSize}
              onMouseOver={e => {
                if (selectedSize && !isOutOfStock) e.currentTarget.style.background = '#444';
              }}
              onMouseOut={e => {
                if (selectedSize && !isOutOfStock) e.currentTarget.style.background = '#222';
              }}
              onClick={handleAddToCart}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            )}
            {!isAdminView && !isSignedIn && (
              <button
                style={{
                  width: '100%',
                  background: '#222',
                  color: '#fff',
                  padding: 16,
                  borderRadius: 8,
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: 24,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => navigate('/signin')}
                onMouseOver={e => { e.currentTarget.style.background = '#444'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#222'; }}
              >
                Sign in to Buy
              </button>
            )}
            <div
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: 10,
                padding: 18,
                background: '#fafafa'
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 16 }}>Description</div>
              <div style={{ fontSize: 15, color: '#222' }}>{product.description}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;