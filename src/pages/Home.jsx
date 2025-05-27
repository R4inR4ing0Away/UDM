import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import toplogo from '../assets/toplogo.jpg';
import backgroundImage from '../assets/background.png';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import homeBanner from '../assets/homebanner.png';
import homeBanner2 from '../assets/homebanner2.png';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost/trapkings-api/get_product.php')
      .then(res => {
        if (res.data.success) {
          // Sort by newest (assuming higher id is newer, or use a date field if available)
          const sorted = res.data.products.slice().sort((a, b) => (b.id || 0) - (a.id || 0));
          setProducts(sorted.slice(0, 6));
        }
      });
  }, []);

  function getImageUrl(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `http://localhost/trapkings-api/${path.replace(/^\/+/,'')}`;
  }

  return (
    <div className="home-page" style={{ minHeight: '100vh', background: '#f5f5f5', overflowY: 'auto' }}>
      <Navbar />
      <div
        className="background-image"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '60vh',
          width: '100%',
        }}
      />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1rem 4rem 1rem' }}>
        <h1 style={{ fontFamily: 'Montserrat, Arial Black, sans-serif', fontWeight: 900, fontSize: '2.2rem', letterSpacing: 2, textAlign: 'center', margin: '2.5rem 0 2.5rem 0' }}>
          PRODUCTS
        </h1>
        {/* First row: 3 products */}
        <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', justifyContent: 'flex-start', marginBottom: '2.5rem' }}>
          {products.slice(0, 3).map((product, idx) => (
            <div key={product.id || idx} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', padding: '1.5rem 1.5rem 1.2rem 1.5rem', width: 320, minHeight: 370, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={product.images ? getImageUrl(product.images.split(',')[0].trim()) : getImageUrl(product.image)} alt={product.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 6, marginBottom: 18, background: '#222' }} />
              <div style={{ fontFamily: 'Montserrat, Arial Black, sans-serif', fontWeight: 700, fontSize: '1.1rem', letterSpacing: 1, marginBottom: 6, textAlign: 'center' }}>{product.name}</div>
              <div style={{ fontWeight: 500, fontSize: '1.1rem', marginBottom: 10 }}>₱{String(product.price).replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
              <Link to={`/products/${product.id}`} style={{ marginTop: 'auto', textDecoration: 'none', color: '#222', fontWeight: 600, fontSize: 15, border: '1px solid #222', borderRadius: 6, padding: '8px 22px', background: '#fafafa', transition: 'background 0.2s' }}>View</Link>
            </div>
          ))}
      </div>
      {/* Edge-to-edge banner */}
      <div
        style={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          transform: 'translateX(-50%)',
          margin: '3rem 0 0 0',
          display: 'flex',
          justifyContent: 'center',
          background: 'none'
        }}
      >
        <img
          src={homeBanner}
          alt="Home Banner"
          style={{
            width: '100%',
            maxHeight: 500,
            objectFit: 'cover'
          }}
        />
      </div>
        {/* Second row: next 3 products (after the banner) */}
        <div style={{ maxWidth: 1100, margin: '3rem auto 0 auto', padding: '0 1rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {products.slice(3, 6).map((product, idx) => (
            <div key={product.id || idx} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', padding: '1.5rem 1.5rem 1.2rem 1.5rem', width: 320, minHeight: 370, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={product.images ? getImageUrl(product.images.split(',')[0].trim()) : getImageUrl(product.image)} alt={product.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 6, marginBottom: 18, background: '#222' }} />
              <div style={{ fontFamily: 'Montserrat, Arial Black, sans-serif', fontWeight: 700, fontSize: '1.1rem', letterSpacing: 1, marginBottom: 6, textAlign: 'center' }}>{product.name}</div>
              <div style={{ fontWeight: 500, fontSize: '1.1rem', marginBottom: 10 }}>₱{String(product.price).replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
              <Link to={`/products/${product.id}`} style={{ marginTop: 'auto', textDecoration: 'none', color: '#222', fontWeight: 600, fontSize: 15, border: '1px solid #222', borderRadius: 6, padding: '8px 22px', background: '#fafafa', transition: 'background 0.2s' }}>View</Link>
          </div>
        ))}
      </div>
        {/* View More button under the 2nd row */}
      <div style={{ width: '100vw', position: 'relative', left: '50%', right: '50%', transform: 'translateX(-50%)', margin: '3rem 0 0 0', display: 'flex', justifyContent: 'center', background: 'none' }}>
          <Link
            to="/products"
            onClick={() => window.scrollTo(0, 0)}
            style={{
          display: 'block',
          width: '40vw',
          minWidth: 300,
          maxWidth: 600,
          background: '#222',
          color: '#fff',
          textAlign: 'center',
          padding: '1.5rem 0',
          borderRadius: 10,
          fontSize: '1.1rem',
          fontWeight: 500,
          letterSpacing: 1,
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          transition: 'background 0.2s',
            }}
          >
            VIEW MORE
          </Link>
        </div>
      </div>
      {/* Edge-to-edge banner 2 under the 3 new containers */}
      <div
        style={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          transform: 'translateX(-50%)',
          margin: '3rem 0 0 0',
          display: 'flex',
          justifyContent: 'center',
          background: 'none'
        }}
      >
        <img
          src={homeBanner2}
          alt="Home Banner 2"
          style={{
            width: '100%',
            maxHeight: 500,
            objectFit: 'cover'
          }}
        />
      </div>
      {/* TrapKings description and Learn More button under the second banner */}
      <div style={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        transform: 'translateX(-50%)',
        margin: '3rem 0 0 0',
        padding: '2.5rem 2rem',
        background: '#fff',
        borderRadius: 0,
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '1.15rem', color: '#222', marginBottom: '2.2rem', fontWeight: 500 }}>
          TrapKings is a clothing brand founded by Elijah Lomboy, inspired by popular streetwear brands like Traplord and Trapstar. Elijah launched Trapkings on October 18, 2024.
        </p>
        <Link to="/about" style={{
          display: 'inline-block',
          background: '#222',
          color: '#fff',
          textAlign: 'center',
          padding: '1rem 2.5rem',
          borderRadius: 10,
          fontSize: '1.1rem',
          fontWeight: 500,
          letterSpacing: 1,
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          transition: 'background 0.2s',
        }}
        onClick={() => window.scrollTo(0, 0)}
        >Learn More</Link>
      </div>
    </div>
  );
};

export default Home;